import { db } from '@/db';
import { orders } from '@/db/schema';

async function main() {
    const now = new Date();
    const ordersData = [];
    
    // Helper function to generate random shopify order ID
    const generateShopifyOrderId = () => {
        const randomDigits = Math.floor(Math.random() * 10000000000000000).toString().padStart(16, '0');
        return `order_${randomDigits}`;
    };
    
    // Helper function to get random date in last N months
    const getRandomDateInLastMonths = (monthsAgo: number, monthsRange: number = 1) => {
        const date = new Date(now);
        date.setMonth(date.getMonth() - monthsAgo);
        const randomDays = Math.floor(Math.random() * (monthsRange * 30));
        date.setDate(date.getDate() + randomDays);
        return date;
    };
    
    // Helper function to get price by distribution
    const getRandomPrice = () => {
        const rand = Math.random();
        if (rand < 0.40) {
            // 40% small orders: $20-$100
            return parseFloat((20 + Math.random() * 80).toFixed(2));
        } else if (rand < 0.75) {
            // 35% medium orders: $100-$300
            return parseFloat((100 + Math.random() * 200).toFixed(2));
        } else if (rand < 0.95) {
            // 20% large orders: $300-$500
            return parseFloat((300 + Math.random() * 200).toFixed(2));
        } else {
            // 5% very large orders: $500-$800
            return parseFloat((500 + Math.random() * 300).toFixed(2));
        }
    };
    
    // Helper function to get status based on date and distribution
    const getStatusForDate = (orderDate: Date, orderIndex: number, totalOrders: number) => {
        const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
        
        // Determine status based on position in array (to maintain distribution)
        const statusRatio = orderIndex / totalOrders;
        
        if (statusRatio < 0.65) {
            // 65% completed
            return 'completed';
        } else if (statusRatio < 0.80) {
            // 15% processing
            return daysDiff < 7 ? 'processing' : 'completed';
        } else if (statusRatio < 0.90) {
            // 10% pending
            return daysDiff < 3 ? 'pending' : 'processing';
        } else if (statusRatio < 0.97) {
            // 7% cancelled
            return 'cancelled';
        } else {
            // 3% refunded
            return 'refunded';
        }
    };
    
    // Tenant configurations
    const tenantConfigs = [
        { tenantId: 1, customerStart: 1, customerEnd: 50 },
        { tenantId: 2, customerStart: 51, customerEnd: 100 },
        { tenantId: 3, customerStart: 101, customerEnd: 150 }
    ];
    
    // Generate 200 orders per tenant
    for (const config of tenantConfigs) {
        const { tenantId, customerStart, customerEnd } = config;
        
        // Create array to track order distribution by month
        const ordersByPeriod = {
            recent: 80,    // Last 3 months: 40% = 80 orders
            middle: 70,    // Months 4-8: 35% = 70 orders
            older: 50      // Months 9-12: 25% = 50 orders
        };
        
        let orderCount = 0;
        
        // Recent orders (last 3 months) - 80 orders
        for (let i = 0; i < ordersByPeriod.recent; i++) {
            const monthsAgo = Math.floor(Math.random() * 3);
            const orderDate = getRandomDateInLastMonths(monthsAgo, 1);
            const customerId = customerStart + Math.floor(Math.random() * (customerEnd - customerStart + 1));
            const totalPrice = getRandomPrice();
            const status = getStatusForDate(orderDate, orderCount, 200);
            
            // updatedAt is more recent for active orders
            let updatedAt = new Date(orderDate);
            if (status === 'pending' || status === 'processing') {
                updatedAt = new Date(now.getTime() - Math.random() * 2 * 24 * 60 * 60 * 1000);
            }
            
            ordersData.push({
                tenantId,
                shopifyOrderId: generateShopifyOrderId(),
                customerId,
                totalPrice,
                status,
                orderDate: orderDate.toISOString(),
                createdAt: orderDate.toISOString(),
                updatedAt: updatedAt.toISOString()
            });
            
            orderCount++;
        }
        
        // Middle period (months 4-8) - 70 orders
        for (let i = 0; i < ordersByPeriod.middle; i++) {
            const monthsAgo = 3 + Math.floor(Math.random() * 5);
            const orderDate = getRandomDateInLastMonths(monthsAgo, 1);
            const customerId = customerStart + Math.floor(Math.random() * (customerEnd - customerStart + 1));
            const totalPrice = getRandomPrice();
            const status = getStatusForDate(orderDate, orderCount, 200);
            
            let updatedAt = new Date(orderDate);
            if (status === 'pending' || status === 'processing') {
                updatedAt = new Date(now.getTime() - Math.random() * 2 * 24 * 60 * 60 * 1000);
            }
            
            ordersData.push({
                tenantId,
                shopifyOrderId: generateShopifyOrderId(),
                customerId,
                totalPrice,
                status,
                orderDate: orderDate.toISOString(),
                createdAt: orderDate.toISOString(),
                updatedAt: updatedAt.toISOString()
            });
            
            orderCount++;
        }
        
        // Older period (months 9-12) - 50 orders
        for (let i = 0; i < ordersByPeriod.older; i++) {
            const monthsAgo = 8 + Math.floor(Math.random() * 4);
            const orderDate = getRandomDateInLastMonths(monthsAgo, 1);
            const customerId = customerStart + Math.floor(Math.random() * (customerEnd - customerStart + 1));
            const totalPrice = getRandomPrice();
            const status = getStatusForDate(orderDate, orderCount, 200);
            
            let updatedAt = new Date(orderDate);
            if (status === 'pending' || status === 'processing') {
                updatedAt = new Date(now.getTime() - Math.random() * 2 * 24 * 60 * 60 * 1000);
            }
            
            ordersData.push({
                tenantId,
                shopifyOrderId: generateShopifyOrderId(),
                customerId,
                totalPrice,
                status,
                orderDate: orderDate.toISOString(),
                createdAt: orderDate.toISOString(),
                updatedAt: updatedAt.toISOString()
            });
            
            orderCount++;
        }
    }
    
    // Insert all orders
    await db.insert(orders).values(ordersData);
    
    console.log(`✅ Orders seeder completed successfully - Generated ${ordersData.length} orders across 3 tenants`);
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});