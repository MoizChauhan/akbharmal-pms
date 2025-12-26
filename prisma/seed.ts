import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import "dotenv/config";
import bcrypt from "bcryptjs";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create a default user
    const admin = await prisma.user.upsert({
        where: { email: 'admin@akbharmal.com' },
        update: {
            password: hashedPassword
        },
        create: {
            email: 'admin@akbharmal.com',
            name: 'Admin User',
            password: hashedPassword,
            activeModules: [
                "Dashboard",
                "Clients",
                "Orders",
                "Workshop",
                "CMS",
                "UAM",
                "Accounts"
            ]
        }
    });

    // Create some Glass Masters
    await prisma.glassMaster.createMany({
        data: [
            { type: 'Clear', color: 'Transparent', mmRange: '5mm', pricePerSqFt: 45 },
            { type: 'Toughened', color: 'Clear', mmRange: '12mm', pricePerSqFt: 120 },
            { type: 'Reflective', color: 'Blue', mmRange: '5mm', pricePerSqFt: 65 },
        ],
        skipDuplicates: true
    });

    // Create some Aluminum Masters
    await prisma.aluminumMaster.createMany({
        data: [
            {
                buildType: 'Domal 27x65',
                pricePerSqFt: 350,
                constants: {
                    bearingOffset: 6.375,
                    handleOffset: 1.875,
                    glassWidthOffset: 0.625,
                    glassHeightOffset: 2.5
                }
            },
            {
                buildType: 'Z-Section',
                pricePerSqFt: 180,
                constants: {
                    bearingOffset: 4.5,
                    handleOffset: 1.5,
                    glassWidthOffset: 0.5,
                    glassHeightOffset: 2.0
                }
            }
        ],
        skipDuplicates: true
    });

    // Create a sample client
    const client = await prisma.client.upsert({
        where: { id: 'sample-client' },
        update: {},
        create: {
            id: 'sample-client',
            name: 'John Doe Construction',
            phone: '9876543210',
            address: 'Industrial Area, Block B'
        }
    });

    console.log('Seed completed successfully');
    console.log({ adminId: admin.id, clientId: client.id });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
