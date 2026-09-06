require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

const adapter = new PrismaMariaDb({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'weekly_report_system',
});

const prisma = new PrismaClient({ adapter });

async function main() {
    // ========================================================
    // 1. ROLES
    // ========================================================

    await prisma.role.createMany({
        data: [
            {
                code: 'ADMIN',
                name: 'Administrator'
            },
            {
                code: 'MANAGER',
                name: 'Manager'
            },
            {
                code: 'TEAM_MEMBER',
                name: 'Team Member'
            }
        ],
        skipDuplicates: true
    });


    // ========================================================
    // 2. REPORT STATUSES
    // ========================================================

    await prisma.reportStatus.createMany({
        data: [
            {
                code: 'DRAFT',
                name: 'Draft'
            },
            {
                code: 'SUBMITTED',
                name: 'Submitted'
            },
            {
                code: 'CORRECTION_REQUESTED',
                name: 'Correction Requested'
            },
            {
                code: 'APPROVED',
                name: 'Approved'
            }
        ],
        skipDuplicates: true
    });


    // ========================================================
    // 3. TASK PRIORITIES
    // ========================================================

    await prisma.taskPriority.createMany({
        data: [
            {
                code: 'LOW',
                name: 'Low'
            },
            {
                code: 'MEDIUM',
                name: 'Medium'
            },
            {
                code: 'HIGH',
                name: 'High'
            },
            {
                code: 'CRITICAL',
                name: 'Critical'
            }
        ],
        skipDuplicates: true
    });


    // ========================================================
    // 4. TASK STATUSES
    // ========================================================

    await prisma.taskStatus.createMany({
        data: [
            {
                code: 'NOT_STARTED',
                name: 'Not Started'
            },
            {
                code: 'IN_PROGRESS',
                name: 'In Progress'
            },
            {
                code: 'COMPLETED',
                name: 'Completed'
            },
            {
                code: 'BLOCKED',
                name: 'Blocked'
            }
        ],
        skipDuplicates: true
    });


    // ========================================================
    // 5. TASK TYPES
    // ========================================================

    await prisma.taskType.createMany({
        data: [
            {
                code: 'DEVELOPMENT',
                name: 'Development'
            },
            {
                code: 'TESTING',
                name: 'Testing'
            },
            {
                code: 'MEETING',
                name: 'Meeting'
            },
            {
                code: 'SUPPORT',
                name: 'Support'
            },
            {
                code: 'DOCUMENTATION',
                name: 'Documentation'
            },
            {
                code: 'RESEARCH',
                name: 'Research'
            }
        ],
        skipDuplicates: true
    });


    // ========================================================
    // 6. REVIEW ACTIONS
    // ========================================================

    await prisma.reviewAction.createMany({
        data: [
            {
                code: 'APPROVE',
                name: 'Approve'
            },
            {
                code: 'REQUEST_CORRECTION',
                name: 'Request Correction'
            }
        ],
        skipDuplicates: true
    });


    console.log('Reference data seeded successfully.');
}

main()
    .catch((error) => {
        console.error('Seeding failed:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });