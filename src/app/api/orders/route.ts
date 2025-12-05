import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { orders, customers, tenants } from '@/db/schema';
import { eq, and, gte, lte, desc } from 'drizzle-orm';

const VALID_STATUSES = ['pending', 'processing', 'completed', 'cancelled', 'refunded'];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single record fetch
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
          eq(orders.id, parseInt(id)),
          eq(orders.tenantId, parseInt(tenantId))
        );
      } else {
        whereCondition = eq(orders.id, parseInt(id));
      }

      const order = await db.select()
        .from(orders)
        .where(whereCondition)
        .limit(1);

      if (order.length === 0) {
        return NextResponse.json({ 
          error: 'Order not found',
          code: 'ORDER_NOT_FOUND' 
        }, { status: 404 });
      }

      return NextResponse.json(order[0], { status: 200 });
    }

    // List with filtering - tenantId is REQUIRED for multi-tenant isolation
    const tenantId = searchParams.get('tenantId');
    if (!tenantId) {
      return NextResponse.json({ 
        error: "tenantId is required for multi-tenant isolation",
        code: "TENANT_ID_REQUIRED" 
      }, { status: 400 });
    }

    if (isNaN(parseInt(tenantId))) {
      return NextResponse.json({ 
        error: "Valid tenantId is required",
        code: "INVALID_TENANT_ID" 
      }, { status: 400 });
    }

    const customerId = searchParams.get('customerId');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    // Build query conditions
    const conditions = [eq(orders.tenantId, parseInt(tenantId))];

    if (customerId) {
      if (isNaN(parseInt(customerId))) {
        return NextResponse.json({ 
          error: "Valid customerId is required",
          code: "INVALID_CUSTOMER_ID" 
        }, { status: 400 });
      }
      conditions.push(eq(orders.customerId, parseInt(customerId)));
    }

    if (status) {
      if (!VALID_STATUSES.includes(status)) {
        return NextResponse.json({ 
          error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
          code: "INVALID_STATUS" 
        }, { status: 400 });
      }
      conditions.push(eq(orders.status, status));
    }

    if (startDate) {
      conditions.push(gte(orders.orderDate, startDate));
    }

    if (endDate) {
      conditions.push(lte(orders.orderDate, endDate));
    }

    const results = await db.select()
      .from(orders)
      .where(and(...conditions))
      .orderBy(desc(orders.orderDate))
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
    const { tenantId, shopifyOrderId, customerId, totalPrice, status, orderDate } = body;

    // Validate required fields
    if (!tenantId) {
      return NextResponse.json({ 
        error: "tenantId is required",
        code: "MISSING_TENANT_ID" 
      }, { status: 400 });
    }

    if (!shopifyOrderId) {
      return NextResponse.json({ 
        error: "shopifyOrderId is required",
        code: "MISSING_SHOPIFY_ORDER_ID" 
      }, { status: 400 });
    }

    if (!customerId) {
      return NextResponse.json({ 
        error: "customerId is required",
        code: "MISSING_CUSTOMER_ID" 
      }, { status: 400 });
    }

    if (totalPrice === undefined || totalPrice === null) {
      return NextResponse.json({ 
        error: "totalPrice is required",
        code: "MISSING_TOTAL_PRICE" 
      }, { status: 400 });
    }

    if (!status) {
      return NextResponse.json({ 
        error: "status is required",
        code: "MISSING_STATUS" 
      }, { status: 400 });
    }

    if (!orderDate) {
      return NextResponse.json({ 
        error: "orderDate is required",
        code: "MISSING_ORDER_DATE" 
      }, { status: 400 });
    }

    // Validate field types and values
    if (isNaN(parseInt(tenantId))) {
      return NextResponse.json({ 
        error: "Valid tenantId is required",
        code: "INVALID_TENANT_ID" 
      }, { status: 400 });
    }

    if (isNaN(parseInt(customerId))) {
      return NextResponse.json({ 
        error: "Valid customerId is required",
        code: "INVALID_CUSTOMER_ID" 
      }, { status: 400 });
    }

    if (isNaN(parseFloat(totalPrice)) || parseFloat(totalPrice) <= 0) {
      return NextResponse.json({ 
        error: "totalPrice must be a positive number",
        code: "INVALID_TOTAL_PRICE" 
      }, { status: 400 });
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ 
        error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
        code: "INVALID_STATUS" 
      }, { status: 400 });
    }

    // Validate tenant exists
    const tenant = await db.select()
      .from(tenants)
      .where(eq(tenants.id, parseInt(tenantId)))
      .limit(1);

    if (tenant.length === 0) {
      return NextResponse.json({ 
        error: "Tenant not found",
        code: "TENANT_NOT_FOUND" 
      }, { status: 400 });
    }

    // Validate customer exists and belongs to the same tenant
    const customer = await db.select()
      .from(customers)
      .where(
        and(
          eq(customers.id, parseInt(customerId)),
          eq(customers.tenantId, parseInt(tenantId))
        )
      )
      .limit(1);

    if (customer.length === 0) {
      return NextResponse.json({ 
        error: "Customer not found or does not belong to the specified tenant",
        code: "CUSTOMER_NOT_FOUND" 
      }, { status: 400 });
    }

    const now = new Date().toISOString();

    const newOrder = await db.insert(orders)
      .values({
        tenantId: parseInt(tenantId),
        shopifyOrderId: shopifyOrderId.trim(),
        customerId: parseInt(customerId),
        totalPrice: parseFloat(totalPrice),
        status: status.trim(),
        orderDate,
        createdAt: now,
        updatedAt: now
      })
      .returning();

    return NextResponse.json(newOrder[0], { status: 201 });

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

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if order exists
    const existingOrder = await db.select()
      .from(orders)
      .where(eq(orders.id, parseInt(id)))
      .limit(1);

    if (existingOrder.length === 0) {
      return NextResponse.json({ 
        error: 'Order not found',
        code: 'ORDER_NOT_FOUND' 
      }, { status: 404 });
    }

    const body = await request.json();
    const updates: any = {};

    // Validate and update status
    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status)) {
        return NextResponse.json({ 
          error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
          code: "INVALID_STATUS" 
        }, { status: 400 });
      }
      updates.status = body.status.trim();
    }

    // Validate and update totalPrice
    if (body.totalPrice !== undefined) {
      if (isNaN(parseFloat(body.totalPrice)) || parseFloat(body.totalPrice) <= 0) {
        return NextResponse.json({ 
          error: "totalPrice must be a positive number",
          code: "INVALID_TOTAL_PRICE" 
        }, { status: 400 });
      }
      updates.totalPrice = parseFloat(body.totalPrice);
    }

    // Always update updatedAt
    updates.updatedAt = new Date().toISOString();

    const updated = await db.update(orders)
      .set(updates)
      .where(eq(orders.id, parseInt(id)))
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

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if order exists before deleting
    const existingOrder = await db.select()
      .from(orders)
      .where(eq(orders.id, parseInt(id)))
      .limit(1);

    if (existingOrder.length === 0) {
      return NextResponse.json({ 
        error: 'Order not found',
        code: 'ORDER_NOT_FOUND' 
      }, { status: 404 });
    }

    const deleted = await db.delete(orders)
      .where(eq(orders.id, parseInt(id)))
      .returning();

    return NextResponse.json({ 
      message: 'Order deleted successfully',
      order: deleted[0]
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}