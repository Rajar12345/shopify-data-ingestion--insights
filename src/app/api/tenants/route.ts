import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { tenants } from '@/db/schema';
import { eq, like, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single tenant by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const tenant = await db.select()
        .from(tenants)
        .where(eq(tenants.id, parseInt(id)))
        .limit(1);

      if (tenant.length === 0) {
        return NextResponse.json({ 
          error: 'Tenant not found',
          code: 'TENANT_NOT_FOUND' 
        }, { status: 404 });
      }

      return NextResponse.json(tenant[0], { status: 200 });
    }

    // List tenants with pagination and search
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');

    let query = db.select().from(tenants);

    if (search) {
      query = query.where(
        or(
          like(tenants.name, `%${search}%`),
          like(tenants.shopifyDomain, `%${search}%`)
        )
      );
    }

    const results = await query
      .orderBy(desc(tenants.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, shopifyDomain, shopifyAccessToken } = body;

    // Validate required fields
    if (!name || name.trim() === '') {
      return NextResponse.json({ 
        error: "Name is required and cannot be empty",
        code: "MISSING_NAME" 
      }, { status: 400 });
    }

    if (!shopifyDomain || shopifyDomain.trim() === '') {
      return NextResponse.json({ 
        error: "Shopify domain is required",
        code: "MISSING_SHOPIFY_DOMAIN" 
      }, { status: 400 });
    }

    if (!shopifyAccessToken || shopifyAccessToken.trim() === '') {
      return NextResponse.json({ 
        error: "Shopify access token is required",
        code: "MISSING_SHOPIFY_ACCESS_TOKEN" 
      }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedName = name.trim();
    const sanitizedDomain = shopifyDomain.trim().toLowerCase();
    const sanitizedToken = shopifyAccessToken.trim();

    // Check if shopifyDomain already exists
    const existingTenant = await db.select()
      .from(tenants)
      .where(eq(tenants.shopifyDomain, sanitizedDomain))
      .limit(1);

    if (existingTenant.length > 0) {
      return NextResponse.json({ 
        error: "Shopify domain already exists",
        code: "DUPLICATE_SHOPIFY_DOMAIN" 
      }, { status: 400 });
    }

    // Create new tenant
    const now = new Date().toISOString();
    const newTenant = await db.insert(tenants)
      .values({
        name: sanitizedName,
        shopifyDomain: sanitizedDomain,
        shopifyAccessToken: sanitizedToken,
        createdAt: now,
        updatedAt: now
      })
      .returning();

    return NextResponse.json(newTenant[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if tenant exists
    const existingTenant = await db.select()
      .from(tenants)
      .where(eq(tenants.id, parseInt(id)))
      .limit(1);

    if (existingTenant.length === 0) {
      return NextResponse.json({ 
        error: 'Tenant not found',
        code: 'TENANT_NOT_FOUND' 
      }, { status: 404 });
    }

    const body = await request.json();
    const { name, shopifyDomain, shopifyAccessToken } = body;

    // Prepare update data
    const updates: any = {
      updatedAt: new Date().toISOString()
    };

    // Validate and add fields if provided
    if (name !== undefined) {
      if (!name || name.trim() === '') {
        return NextResponse.json({ 
          error: "Name cannot be empty",
          code: "INVALID_NAME" 
        }, { status: 400 });
      }
      updates.name = name.trim();
    }

    if (shopifyDomain !== undefined) {
      if (!shopifyDomain || shopifyDomain.trim() === '') {
        return NextResponse.json({ 
          error: "Shopify domain cannot be empty",
          code: "INVALID_SHOPIFY_DOMAIN" 
        }, { status: 400 });
      }

      const sanitizedDomain = shopifyDomain.trim().toLowerCase();

      // Check if new domain conflicts with existing tenant (excluding current tenant)
      const conflictingTenant = await db.select()
        .from(tenants)
        .where(eq(tenants.shopifyDomain, sanitizedDomain))
        .limit(1);

      if (conflictingTenant.length > 0 && conflictingTenant[0].id !== parseInt(id)) {
        return NextResponse.json({ 
          error: "Shopify domain already exists",
          code: "DUPLICATE_SHOPIFY_DOMAIN" 
        }, { status: 400 });
      }

      updates.shopifyDomain = sanitizedDomain;
    }

    if (shopifyAccessToken !== undefined) {
      if (!shopifyAccessToken || shopifyAccessToken.trim() === '') {
        return NextResponse.json({ 
          error: "Shopify access token cannot be empty",
          code: "INVALID_SHOPIFY_ACCESS_TOKEN" 
        }, { status: 400 });
      }
      updates.shopifyAccessToken = shopifyAccessToken.trim();
    }

    // Update tenant
    const updatedTenant = await db.update(tenants)
      .set(updates)
      .where(eq(tenants.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedTenant[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if tenant exists
    const existingTenant = await db.select()
      .from(tenants)
      .where(eq(tenants.id, parseInt(id)))
      .limit(1);

    if (existingTenant.length === 0) {
      return NextResponse.json({ 
        error: 'Tenant not found',
        code: 'TENANT_NOT_FOUND' 
      }, { status: 404 });
    }

    // Delete tenant
    const deletedTenant = await db.delete(tenants)
      .where(eq(tenants.id, parseInt(id)))
      .returning();

    return NextResponse.json({ 
      message: 'Tenant deleted successfully',
      tenant: deletedTenant[0]
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error.message 
    }, { status: 500 });
  }
}