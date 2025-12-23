const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Create a default user
    const admin = await prisma.user.upsert({
        where: { email: 'admin@akbharmal.com' },
        update: {},
        create: {
            email: 'admin@akbharmal.com',
            name: 'Admin User',
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
                constants: {
                    bearingOffset: 6.375,
                    handleOffset: 1.875,
                    glassWidthOffset: 0.625,
                    glassHeightOffset: 2.5
                }
            },
            {
                buildType: 'Z-Section',
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

    console.log({ admin, client });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
