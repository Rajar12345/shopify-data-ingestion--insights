import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { customers, tenants } from '@/db/schema';
import { eq, like, and, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single customer by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const tenantId = searchParams.get('tenantId');
      let whereCondition;

      if (tenantId) {
        whereCondition = and(
          eq(customers.id, parseInt(id)),
          eq(customers.tenantId, parseInt(tenantId))
        );
      } else {
        whereCondition = eq(customers.id, parseInt(id));
      }

      const customer = await db.select()
        .from(customers)
        .where(whereCondition)
        .limit(1);

      if (customer.length === 0) {
        return NextResponse.json({ 
          error: 'Customer not found',
          code: 'CUSTOMER_NOT_FOUND' 
        }, { status: 404 });
      }

      return NextResponse.json(customer[0], { status: 200 });
    }

    // List customers with multi-tenant filtering
    const tenantId = searchParams.get('tenantId');
    
    if (!tenantId) {
      return NextResponse.json({ 
        error: "tenantId is required for listing customers",
        code: "TENANT_ID_REQUIRED" 
      }, { status: 400 });
    }

    if (isNaN(parseInt(tenantId))) {
      return NextResponse.json({ 
        error: "Valid tenantId is required",
        code: "INVALID_TENANT_ID" 
      }, { status: 400 });
    }

    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');

    let query = db.select().from(customers);

    // Always filter by tenantId
    let whereCondition = eq(customers.tenantId, parseInt(tenantId));

    // Add search condition if provided
    if (search) {
      const searchCondition = or(
        like(customers.email, `%${search}%`),
        like(customers.firstName, `%${search}%`),
        like(customers.lastName, `%${search}%`)
      );
      whereCondition = and(whereCondition, searchCondition);
    }

    const results = await query
      .where(whereCondition)
      .orderBy(desc(customers.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      tenantId, 
      shopifyCustomerId, 
      email, 
      firstName, 
      lastName,
      totalSpent,
      ordersCount
    } = body;

    // Validate required fields
    if (!tenantId) {
      return NextResponse.json({ 
        error: "tenantId is required",
        code: "MISSING_TENANT_ID" 
      }, { status: 400 });
    }

    if (!shopifyCustomerId) {
      return NextResponse.json({ 
        error: "shopifyCustomerId is required",
        code: "MISSING_SHOPIFY_CUSTOMER_ID" 
      }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ 
        error: "email is required",
        code: "MISSING_EMAIL" 
      }, { status: 400 });
    }

    if (!firstName) {
      return NextResponse.json({ 
        error: "firstName is required",
        code: "MISSING_FIRST_NAME" 
      }, { status: 400 });
    }

    if (!lastName) {
      return NextResponse.json({ 
        error: "lastName is required",
        code: "MISSING_LAST_NAME" 
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: "Invalid email format",
        code: "INVALID_EMAIL_FORMAT" 
      }, { status: 400 });
    }

    // Validate tenantId is a valid integer
    if (isNaN(parseInt(tenantId))) {
      return NextResponse.json({ 
        error: "Valid tenantId is required",
        code: "INVALID_TENANT_ID" 
      }, { status: 400 });
    }

    // Check if tenant exists
    const tenant = await db.select()
      .from(tenants)
      .where(eq(tenants.id, parseInt(tenantId)))
      .limit(1);

    if (tenant.length === 0) {
      return NextResponse.json({ 
        error: "Tenant not found",
        code: "TENANT_NOT_FOUND" 
      }, { status: 404 });
    }

    // Prepare insert data with sanitization and defaults
    const now = new Date().toISOString();
    const insertData = {
      tenantId: parseInt(tenantId),
      shopifyCustomerId: shopifyCustomerId.trim(),
      email: email.trim().toLowerCase(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      totalSpent: totalSpent !== undefined ? parseFloat(totalSpent) : 0,
      ordersCount: ordersCount !== undefined ? parseInt(ordersCount) : 0,
      createdAt: now,
      updatedAt: now
    };

    // Insert customer
    const newCustomer = await db.insert(customers)
      .values(insertData)
      .returning();

    return NextResponse.json(newCustomer[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const body = await request.json();
    const { 
      email, 
      firstName, 
      lastName,
      totalSpent,
      ordersCount
    } = body;

    // Check if customer exists
    const existingCustomer = await db.select()
      .from(customers)
      .where(eq(customers.id, parseInt(id)))
      .limit(1);

    if (existingCustomer.length === 0) {
      return NextResponse.json({ 
        error: 'Customer not found',
        code: 'CUSTOMER_NOT_FOUND' 
      }, { status: 404 });
    }

    // Prepare update data
    const updates: any = {
      updatedAt: new Date().toISOString()
    };

    if (email !== undefined) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json({ 
          error: "Invalid email format",
          code: "INVALID_EMAIL_FORMAT" 
        }, { status: 400 });
      }
      updates.email = email.trim().toLowerCase();
    }

    if (firstName !== undefined) {
      updates.firstName = firstName.trim();
    }

    if (lastName !== undefined) {
      updates.lastName = lastName.trim();
    }

    if (totalSpent !== undefined) {
      updates.totalSpent = parseFloat(totalSpent);
    }

    if (ordersCount !== undefined) {
      updates.ordersCount = parseInt(ordersCount);
    }

    // Update customer
    const updated = await db.update(customers)
      .set(updates)
      .where(eq(customers.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if customer exists
    const existingCustomer = await db.select()
      .from(customers)
      .where(eq(customers.id, parseInt(id)))
      .limit(1);

    if (existingCustomer.length === 0) {
      return NextResponse.json({ 
        error: 'Customer not found',
        code: 'CUSTOMER_NOT_FOUND' 
      }, { status: 404 });
    }

    // Delete customer
    const deleted = await db.delete(customers)
      .where(eq(customers.id, parseInt(id)))
      .returning();

    return NextResponse.json({ 
      message: 'Customer deleted successfully',
      customer: deleted[0]
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}