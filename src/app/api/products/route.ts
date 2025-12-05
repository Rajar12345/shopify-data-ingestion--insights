import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products, tenants } from '@/db/schema';
import { eq, like, and, gte, lte, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single product fetch
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const tenantId = searchParams.get('tenantId');
      
      let whereCondition = eq(products.id, parseInt(id));
      
      if (tenantId) {
        if (isNaN(parseInt(tenantId))) {
          return NextResponse.json({ 
            error: "Valid tenantId is required",
            code: "INVALID_TENANT_ID" 
          }, { status: 400 });
        }
        whereCondition = and(
          eq(products.id, parseInt(id)),
          eq(products.tenantId, parseInt(tenantId))
        );
      }

      const product = await db.select()
        .from(products)
        .where(whereCondition)
        .limit(1);

      if (product.length === 0) {
        return NextResponse.json({ 
          error: 'Product not found',
          code: "PRODUCT_NOT_FOUND" 
        }, { status: 404 });
      }

      return NextResponse.json(product[0], { status: 200 });
    }

    // List products with multi-tenant filtering
    const tenantId = searchParams.get('tenantId');
    
    // REQUIRED: tenantId must be provided for list operations
    if (!tenantId) {
      return NextResponse.json({ 
        error: "tenantId is required for listing products",
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
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const conditions = [eq(products.tenantId, parseInt(tenantId))];

    // Search by title
    if (search) {
      conditions.push(like(products.title, `%${search}%`));
    }

    // Price range filtering
    if (minPrice && !isNaN(parseFloat(minPrice))) {
      conditions.push(gte(products.price, parseFloat(minPrice)));
    }

    if (maxPrice && !isNaN(parseFloat(maxPrice))) {
      conditions.push(lte(products.price, parseFloat(maxPrice)));
    }

    const results = await db.select()
      .from(products)
      .where(and(...conditions))
      .orderBy(desc(products.createdAt))
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
    const { tenantId, shopifyProductId, title, price, inventory } = body;

    // Validate required fields
    if (!tenantId) {
      return NextResponse.json({ 
        error: "tenantId is required",
        code: "MISSING_TENANT_ID" 
      }, { status: 400 });
    }

    if (isNaN(parseInt(tenantId))) {
      return NextResponse.json({ 
        error: "Valid tenantId is required",
        code: "INVALID_TENANT_ID" 
      }, { status: 400 });
    }

    if (!shopifyProductId || typeof shopifyProductId !== 'string' || shopifyProductId.trim() === '') {
      return NextResponse.json({ 
        error: "shopifyProductId is required and must be a non-empty string",
        code: "MISSING_SHOPIFY_PRODUCT_ID" 
      }, { status: 400 });
    }

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json({ 
        error: "title is required and must be a non-empty string",
        code: "MISSING_TITLE" 
      }, { status: 400 });
    }

    if (price === undefined || price === null) {
      return NextResponse.json({ 
        error: "price is required",
        code: "MISSING_PRICE" 
      }, { status: 400 });
    }

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      return NextResponse.json({ 
        error: "price must be a positive number greater than 0",
        code: "INVALID_PRICE" 
      }, { status: 400 });
    }

    // Validate inventory if provided
    let inventoryValue = 0;
    if (inventory !== undefined && inventory !== null) {
      inventoryValue = parseInt(inventory);
      if (isNaN(inventoryValue) || inventoryValue < 0) {
        return NextResponse.json({ 
          error: "inventory must be a non-negative integer",
          code: "INVALID_INVENTORY" 
        }, { status: 400 });
      }
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
      }, { status: 404 });
    }

    // Create product
    const now = new Date().toISOString();
    const newProduct = await db.insert(products)
      .values({
        tenantId: parseInt(tenantId),
        shopifyProductId: shopifyProductId.trim(),
        title: title.trim(),
        price: priceValue,
        inventory: inventoryValue,
        createdAt: now,
        updatedAt: now
      })
      .returning();

    return NextResponse.json(newProduct[0], { status: 201 });

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

    const body = await request.json();
    const { title, price, inventory } = body;

    // Check if product exists
    const existingProduct = await db.select()
      .from(products)
      .where(eq(products.id, parseInt(id)))
      .limit(1);

    if (existingProduct.length === 0) {
      return NextResponse.json({ 
        error: 'Product not found',
        code: "PRODUCT_NOT_FOUND" 
      }, { status: 404 });
    }

    // Build update object
    const updates: any = {
      updatedAt: new Date().toISOString()
    };

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return NextResponse.json({ 
          error: "title must be a non-empty string",
          code: "INVALID_TITLE" 
        }, { status: 400 });
      }
      updates.title = title.trim();
    }

    if (price !== undefined) {
      const priceValue = parseFloat(price);
      if (isNaN(priceValue) || priceValue <= 0) {
        return NextResponse.json({ 
          error: "price must be a positive number greater than 0",
          code: "INVALID_PRICE" 
        }, { status: 400 });
      }
      updates.price = priceValue;
    }

    if (inventory !== undefined) {
      const inventoryValue = parseInt(inventory);
      if (isNaN(inventoryValue) || inventoryValue < 0) {
        return NextResponse.json({ 
          error: "inventory must be a non-negative integer",
          code: "INVALID_INVENTORY" 
        }, { status: 400 });
      }
      updates.inventory = inventoryValue;
    }

    const updated = await db.update(products)
      .set(updates)
      .where(eq(products.id, parseInt(id)))
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

    // Check if product exists
    const existingProduct = await db.select()
      .from(products)
      .where(eq(products.id, parseInt(id)))
      .limit(1);

    if (existingProduct.length === 0) {
      return NextResponse.json({ 
        error: 'Product not found',
        code: "PRODUCT_NOT_FOUND" 
      }, { status: 404 });
    }

    const deleted = await db.delete(products)
      .where(eq(products.id, parseInt(id)))
      .returning();

    return NextResponse.json({ 
      message: 'Product deleted successfully',
      product: deleted[0]
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}