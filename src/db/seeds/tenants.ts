import { db } from '@/db';
import { tenants } from '@/db/schema';

async function main() {
    const sampleTenants = [
        {
            name: 'Acme Store',
            shopifyDomain: 'acme-store.myshopify.com',
            shopifyAccessToken: 'shpat_abc123def456ghi789jkl012mno345pqr678',
            createdAt: new Date('2023-08-15').toISOString(),
            updatedAt: new Date('2024-02-10').toISOString(),
        },
        {
            name: 'Fashion Boutique',
            shopifyDomain: 'fashion-boutique.myshopify.com',
            shopifyAccessToken: 'shpat_xyz789uvw456rst123opq890lmn567ijk234',
            createdAt: new Date('2023-09-20').toISOString(),
            updatedAt: new Date('2024-02-15').toISOString(),
        },
        {
            name: 'Tech Gadgets',
            shopifyDomain: 'tech-gadgets.myshopify.com',
            shopifyAccessToken: 'shpat_qwe321rty654uio987asd210fgh543jkl876',
            createdAt: new Date('2023-10-05').toISOString(),
            updatedAt: new Date('2024-02-20').toISOString(),
        }
    ];

    await db.insert(tenants).values(sampleTenants);
    
    console.log('✅ Tenants seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});