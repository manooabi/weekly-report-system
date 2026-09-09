// require('dotenv').config();

// const { PrismaClient } = require('@prisma/client');
// const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
// const { hashPassword } = require('../src/utils/password');

// const adapter = new PrismaMariaDb({
//     host: 'localhost',
//     port: 3306,
//     user: 'root',
//     password: '',
//     database: 'weekly_report_system',
// });

// const prisma = new PrismaClient({ adapter });

// async function main() {
//     // ========================================================
//     // 1. ROLES
//     // ========================================================

//     await prisma.role.createMany({
//         data: [
//             {
//                 code: 'ADMIN',
//                 name: 'Administrator'
//             },
//             {
//                 code: 'MANAGER',
//                 name: 'Manager'
//             },
//             {
//                 code: 'TEAM_MEMBER',
//                 name: 'Team Member'
//             }
//         ],
//         skipDuplicates: true
//     });
// const roles = await prisma.role.findMany({
//     where: {
//         code: {
//             in: ['ADMIN', 'MANAGER', 'TEAM_MEMBER']
//         }
//     }
// });

// const roleMap = Object.fromEntries(
//     roles.map(role => [role.code, role.id])
// );

// // const { hashPassword } = require('../src/utils/password');

// const passwordHash = await hashPassword('Password123!');

// await prisma.user.createMany({
//     data: [
//         {
//             name: 'System Admin',
//             email: 'admin@example.com',
//             passwordHash,
//             roleId: roleMap.ADMIN
//         },
//         {
//             name: 'John Manager',
//             email: 'manager@example.com',
//             passwordHash,
//             roleId: roleMap.MANAGER
//         }
//     ],
//     skipDuplicates: true
// });

//     // ========================================================
//     // 2. REPORT STATUSES
//     // ========================================================

//     await prisma.reportStatus.createMany({
//         data: [
//             {
//                 code: 'DRAFT',
//                 name: 'Draft'
//             },
//             {
//                 code: 'SUBMITTED',
//                 name: 'Submitted'
//             },
//             {
//                 code: 'CORRECTION_REQUESTED',
//                 name: 'Correction Requested'
//             },
//             {
//                 code: 'APPROVED',
//                 name: 'Approved'
//             }
//         ],
//         skipDuplicates: true
//     });


//     // ========================================================
//     // 3. TASK PRIORITIES
//     // ========================================================

//     await prisma.taskPriority.createMany({
//         data: [
//             {
//                 code: 'LOW',
//                 name: 'Low'
//             },
//             {
//                 code: 'MEDIUM',
//                 name: 'Medium'
//             },
//             {
//                 code: 'HIGH',
//                 name: 'High'
//             },
//             {
//                 code: 'CRITICAL',
//                 name: 'Critical'
//             }
//         ],
//         skipDuplicates: true
//     });


//     // ========================================================
//     // 4. TASK STATUSES
//     // ========================================================

//     await prisma.taskStatus.createMany({
//         data: [
//             {
//                 code: 'NOT_STARTED',
//                 name: 'Not Started'
//             },
//             {
//                 code: 'IN_PROGRESS',
//                 name: 'In Progress'
//             },
//             {
//                 code: 'COMPLETED',
//                 name: 'Completed'
//             },
//             {
//                 code: 'BLOCKED',
//                 name: 'Blocked'
//             }
//         ],
//         skipDuplicates: true
//     });


//     // ========================================================
//     // 5. TASK TYPES
//     // ========================================================

//     await prisma.taskType.createMany({
//         data: [
//             {
//                 code: 'DEVELOPMENT',
//                 name: 'Development'
//             },
//             {
//                 code: 'TESTING',
//                 name: 'Testing'
//             },
//             {
//                 code: 'MEETING',
//                 name: 'Meeting'
//             },
//             {
//                 code: 'SUPPORT',
//                 name: 'Support'
//             },
//             {
//                 code: 'DOCUMENTATION',
//                 name: 'Documentation'
//             },
//             {
//                 code: 'RESEARCH',
//                 name: 'Research'
//             }
//         ],
//         skipDuplicates: true
//     });


//     // ========================================================
//     // 6. REVIEW ACTIONS
//     // ========================================================

//     await prisma.reviewAction.createMany({
//         data: [
//             {
//                 code: 'APPROVE',
//                 name: 'Approve'
//             },
//             {
//                 code: 'REQUEST_CORRECTION',
//                 name: 'Request Correction'
//             }
//         ],
//         skipDuplicates: true
//     });


//     console.log('Reference data seeded successfully.');
// }

// main()
//     .catch((error) => {
//         console.error('Seeding failed:', error);
//         process.exit(1);
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//     });

//-----------------------------------------------------------------------------------------------------------------

require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const { hashPassword } = require('../src/utils/password');

const adapter = new PrismaMariaDb({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'weekly_report_system',
});

const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Starting database seed...');

    // ========================================================
    // 1. ROLES
    // ========================================================

    await prisma.role.createMany({
        data: [
            {
                code: 'ADMIN',
                name: 'Administrator',
            },
            {
                code: 'MANAGER',
                name: 'Manager',
            },
            {
                code: 'TEAM_MEMBER',
                name: 'Team Member',
            },
        ],
        skipDuplicates: true,
    });

    const roles = await prisma.role.findMany({
        where: {
            code: {
                in: ['ADMIN', 'MANAGER', 'TEAM_MEMBER'],
            },
        },
    });

    const roleMap = Object.fromEntries(
        roles.map((role) => [role.code, role.id])
    );

    // ========================================================
    // 2. REPORT STATUSES
    // ========================================================

    await prisma.reportStatus.createMany({
        data: [
            {
                code: 'DRAFT',
                name: 'Draft',
            },
            {
                code: 'SUBMITTED',
                name: 'Submitted',
            },
            {
                code: 'CORRECTION_REQUESTED',
                name: 'Correction Requested',
            },
            {
                code: 'APPROVED',
                name: 'Approved',
            },
        ],
        skipDuplicates: true,
    });

    const reportStatuses = await prisma.reportStatus.findMany({
        where: {
            code: {
                in: [
                    'DRAFT',
                    'SUBMITTED',
                    'CORRECTION_REQUESTED',
                    'APPROVED',
                ],
            },
        },
    });

    const reportStatusMap = Object.fromEntries(
        reportStatuses.map((status) => [status.code, status.id])
    );

    // ========================================================
    // 3. TASK PRIORITIES
    // ========================================================

    await prisma.taskPriority.createMany({
        data: [
            {
                code: 'LOW',
                name: 'Low',
            },
            {
                code: 'MEDIUM',
                name: 'Medium',
            },
            {
                code: 'HIGH',
                name: 'High',
            },
            {
                code: 'CRITICAL',
                name: 'Critical',
            },
        ],
        skipDuplicates: true,
    });

    const priorities = await prisma.taskPriority.findMany({
        where: {
            code: {
                in: [
                    'LOW',
                    'MEDIUM',
                    'HIGH',
                    'CRITICAL',
                ],
            },
        },
    });

    const priorityMap = Object.fromEntries(
        priorities.map((priority) => [
            priority.code,
            priority.id,
        ])
    );

    // ========================================================
    // 4. TASK STATUSES
    // ========================================================

    await prisma.taskStatus.createMany({
        data: [
            {
                code: 'NOT_STARTED',
                name: 'Not Started',
            },
            {
                code: 'IN_PROGRESS',
                name: 'In Progress',
            },
            {
                code: 'COMPLETED',
                name: 'Completed',
            },
            {
                code: 'BLOCKED',
                name: 'Blocked',
            },
        ],
        skipDuplicates: true,
    });

    const taskStatuses = await prisma.taskStatus.findMany({
        where: {
            code: {
                in: [
                    'NOT_STARTED',
                    'IN_PROGRESS',
                    'COMPLETED',
                    'BLOCKED',
                ],
            },
        },
    });

    const taskStatusMap = Object.fromEntries(
        taskStatuses.map((status) => [
            status.code,
            status.id,
        ])
    );

    // ========================================================
    // 5. TASK TYPES
    // ========================================================

    await prisma.taskType.createMany({
        data: [
            {
                code: 'DEVELOPMENT',
                name: 'Development',
            },
            {
                code: 'TESTING',
                name: 'Testing',
            },
            {
                code: 'MEETING',
                name: 'Meeting',
            },
            {
                code: 'SUPPORT',
                name: 'Support',
            },
            {
                code: 'DOCUMENTATION',
                name: 'Documentation',
            },
            {
                code: 'RESEARCH',
                name: 'Research',
            },
        ],
        skipDuplicates: true,
    });

    const taskTypes = await prisma.taskType.findMany({
        where: {
            code: {
                in: [
                    'DEVELOPMENT',
                    'TESTING',
                    'MEETING',
                    'SUPPORT',
                    'DOCUMENTATION',
                    'RESEARCH',
                ],
            },
        },
    });

    const taskTypeMap = Object.fromEntries(
        taskTypes.map((type) => [
            type.code,
            type.id,
        ])
    );

    // ========================================================
    // 6. REVIEW ACTIONS
    // ========================================================

    await prisma.reviewAction.createMany({
        data: [
            {
                code: 'APPROVE',
                name: 'Approve',
            },
            {
                code: 'REQUEST_CORRECTION',
                name: 'Request Correction',
            },
        ],
        skipDuplicates: true,
    });

    const reviewActions = await prisma.reviewAction.findMany({
        where: {
            code: {
                in: [
                    'APPROVE',
                    'REQUEST_CORRECTION',
                ],
            },
        },
    });

    const reviewActionMap = Object.fromEntries(
        reviewActions.map((action) => [
            action.code,
            action.id,
        ])
    );

    // ========================================================
    // 7. USERS
    // ========================================================

    const passwordHash = await hashPassword(
        'Password123!'
    );

    const admin = await prisma.user.upsert({
        where: {
            email: 'admin@example.com',
        },
        update: {
            name: 'System Admin',
            roleId: roleMap.ADMIN,
            isActive: true,
            passwordHash,
        },
        create: {
            name: 'System Admin',
            email: 'admin@example.com',
            passwordHash,
            roleId: roleMap.ADMIN,
            isActive: true,
        },
    });

    const manager = await prisma.user.upsert({
        where: {
            email: 'manager@example.com',
        },
        update: {
            name: 'John Manager',
            roleId: roleMap.MANAGER,
            isActive: true,
            passwordHash,
        },
        create: {
            name: 'John Manager',
            email: 'manager@example.com',
            passwordHash,
            roleId: roleMap.MANAGER,
            isActive: true,
        },
    });

    const john = await prisma.user.upsert({
        where: {
            email: 'john@example.com',
        },
        update: {
            name: 'John Doe',
            roleId: roleMap.TEAM_MEMBER,
            isActive: true,
            passwordHash,
        },
        create: {
            name: 'John Doe',
            email: 'john@example.com',
            passwordHash,
            roleId: roleMap.TEAM_MEMBER,
            isActive: true,
        },
    });

    const jane = await prisma.user.upsert({
        where: {
            email: 'jane@example.com',
        },
        update: {
            name: 'Jane Smith',
            roleId: roleMap.TEAM_MEMBER,
            isActive: true,
            passwordHash,
        },
        create: {
            name: 'Jane Smith',
            email: 'jane@example.com',
            passwordHash,
            roleId: roleMap.TEAM_MEMBER,
            isActive: true,
        },
    });

    const mike = await prisma.user.upsert({
        where: {
            email: 'mike@example.com',
        },
        update: {
            name: 'Mike Wilson',
            roleId: roleMap.TEAM_MEMBER,
            isActive: true,
            passwordHash,
        },
        create: {
            name: 'Mike Wilson',
            email: 'mike@example.com',
            passwordHash,
            roleId: roleMap.TEAM_MEMBER,
            isActive: true,
        },
    });

    console.log('Users seeded.');

    // ========================================================
    // 8. CATEGORIES
    // ========================================================

    const softwareCategory = await prisma.category.upsert({
        where: {
            name: 'Software Development',
        },
        update: {
            description:
                'Software development and engineering activities.',
            isActive: true,
        },
        create: {
            name: 'Software Development',
            description:
                'Software development and engineering activities.',
            isActive: true,
        },
    });

    const businessCategory = await prisma.category.upsert({
        where: {
            name: 'Business Analysis',
        },
        update: {
            description:
                'Business analysis and requirements activities.',
            isActive: true,
        },
        create: {
            name: 'Business Analysis',
            description:
                'Business analysis and requirements activities.',
            isActive: true,
        },
    });

    const testingCategory = await prisma.category.upsert({
        where: {
            name: 'Quality Assurance',
        },
        update: {
            description:
                'Software testing and quality assurance activities.',
            isActive: true,
        },
        create: {
            name: 'Quality Assurance',
            description:
                'Software testing and quality assurance activities.',
            isActive: true,
        },
    });

    // ========================================================
    // 9. PROJECTS
    // ========================================================

    const weeklyReportProject =
        await prisma.project.upsert({
            where: {
                name: 'Weekly Report System',
            },
            update: {
                categoryId: softwareCategory.id,
                description:
                    'Internal weekly employee reporting system.',
                isActive: true,
            },
            create: {
                name: 'Weekly Report System',
                categoryId: softwareCategory.id,
                description:
                    'Internal weekly employee reporting system.',
                isActive: true,
            },
        });

    const posProject = await prisma.project.upsert({
        where: {
            name: 'POS System',
        },
        update: {
            categoryId: softwareCategory.id,
            description:
                'Point of sale management system.',
            isActive: true,
        },
        create: {
            name: 'POS System',
            categoryId: softwareCategory.id,
            description:
                'Point of sale management system.',
            isActive: true,
        },
    });

    const accountingProject =
        await prisma.project.upsert({
            where: {
                name: 'Accounting System',
            },
            update: {
                categoryId: businessCategory.id,
                description:
                    'Finance and accounting management system.',
                isActive: true,
            },
            create: {
                name: 'Accounting System',
                categoryId: businessCategory.id,
                description:
                    'Finance and accounting management system.',
                isActive: true,
            },
        });

    const testingProject =
        await prisma.project.upsert({
            where: {
                name: 'QA Automation',
            },
            update: {
                categoryId: testingCategory.id,
                description:
                    'Automated software testing project.',
                isActive: true,
            },
            create: {
                name: 'QA Automation',
                categoryId: testingCategory.id,
                description:
                    'Automated software testing project.',
                isActive: true,
            },
        });

    console.log('Categories and projects seeded.');

    // ========================================================
    // 10. PROJECT MEMBERS
    // ========================================================

    const memberships = [
        {
            projectId: weeklyReportProject.id,
            userId: john.id,
        },
        {
            projectId: weeklyReportProject.id,
            userId: jane.id,
        },
        {
            projectId: weeklyReportProject.id,
            userId: mike.id,
        },
        {
            projectId: posProject.id,
            userId: john.id,
        },
        {
            projectId: posProject.id,
            userId: mike.id,
        },
        {
            projectId: accountingProject.id,
            userId: jane.id,
        },
        {
            projectId: testingProject.id,
            userId: mike.id,
        },
    ];

    await prisma.projectMember.createMany({
        data: memberships,
        skipDuplicates: true,
    });

    console.log('Project memberships seeded.');

    // ========================================================
    // HELPER: CREATE REPORT
    // ========================================================

    async function createReport({
        userId,
        projectId,
        weekStart,
        weekEnd,
        statusCode,
        versionNumber = 1,
        nextWeekPlan,
        notes,
        links,
        tasks = [],
        achievements = [],
        blockers = [],
        hours = [],
        reviews = [],
    }) {
        const existingReport =
            await prisma.report.findFirst({
                where: {
                    userId,
                    projectId,
                    weekStart: new Date(
                        `${weekStart}T00:00:00.000Z`
                    ),
                    weekEnd: new Date(
                        `${weekEnd}T00:00:00.000Z`
                    ),
                },
            });

        let report;

        if (existingReport) {
            await prisma.report.update({
                where: {
                    id: existingReport.id,
                },
                data: {
                    currentVersionId: null,
                },
            });

            await prisma.reportReview.deleteMany({
                where: {
                    reportId: existingReport.id,
                },
            });

            const oldVersions =
                await prisma.reportVersion.findMany({
                    where: {
                        reportId: existingReport.id,
                    },
                    select: {
                        id: true,
                    },
                });

            const oldVersionIds =
                oldVersions.map(
                    (version) => version.id
                );

            if (oldVersionIds.length > 0) {
                await prisma.reportTask.deleteMany({
                    where: {
                        reportVersionId: {
                            in: oldVersionIds,
                        },
                    },
                });

                await prisma.reportAchievement.deleteMany({
                    where: {
                        reportVersionId: {
                            in: oldVersionIds,
                        },
                    },
                });

                await prisma.reportBlocker.deleteMany({
                    where: {
                        reportVersionId: {
                            in: oldVersionIds,
                        },
                    },
                });

                await prisma.reportHour.deleteMany({
                    where: {
                        reportVersionId: {
                            in: oldVersionIds,
                        },
                    },
                });

                await prisma.reportVersion.deleteMany({
                    where: {
                        id: {
                            in: oldVersionIds,
                        },
                    },
                });
            }

            report = await prisma.report.update({
                where: {
                    id: existingReport.id,
                },
                data: {
                    statusId:
                        reportStatusMap[statusCode],
                },
            });
        } else {
            report = await prisma.report.create({
                data: {
                    userId,
                    projectId,
                    weekStart: new Date(
                        `${weekStart}T00:00:00.000Z`
                    ),
                    weekEnd: new Date(
                        `${weekEnd}T00:00:00.000Z`
                    ),
                    statusId:
                        reportStatusMap[statusCode],
                },
            });
        }

        const version =
            await prisma.reportVersion.create({
                data: {
                    reportId: report.id,
                    versionNumber,
                    createdById: userId,
                    nextWeekPlan,
                    notes,
                    links,
                    submittedAt:
                        statusCode === 'SUBMITTED' ||
                        statusCode ===
                            'CORRECTION_REQUESTED' ||
                        statusCode === 'APPROVED'
                            ? new Date()
                            : null,
                },
            });

        await prisma.report.update({
            where: {
                id: report.id,
            },
            data: {
                currentVersionId: version.id,
            },
        });

        // ----------------------------------------------------
        // Tasks
        // ----------------------------------------------------

        for (const task of tasks) {
            await prisma.reportTask.create({
                data: {
                    reportVersionId: version.id,
                    taskName: task.taskName,
                    priorityId:
                        priorityMap[task.priority],
                    plannedPercentage:
                        task.plannedPercentage,
                    actualPercentage:
                        task.actualPercentage,
                    statusId:
                        taskStatusMap[task.status],
                    plannedHours:
                        task.plannedHours,
                    spentHours:
                        task.spentHours,
                    deliverable:
                        task.deliverable || null,
                },
            });
        }

        // ----------------------------------------------------
        // Achievements
        // ----------------------------------------------------

        for (const achievement of achievements) {
            await prisma.reportAchievement.create({
                data: {
                    reportVersionId: version.id,
                    achievement:
                        achievement.text,
                    isKeyAchievement:
                        achievement.isKey || false,
                },
            });
        }

        // ----------------------------------------------------
        // Blockers
        // ----------------------------------------------------

        for (const blocker of blockers) {
            await prisma.reportBlocker.create({
                data: {
                    reportVersionId: version.id,
                    blocker: blocker.text,
                    isKeyBlocker:
                        blocker.isKey || false,
                },
            });
        }

        // ----------------------------------------------------
        // Hours
        // ----------------------------------------------------

        for (const hour of hours) {
            await prisma.reportHour.create({
                data: {
                    reportVersionId: version.id,
                    taskTypeId:
                        taskTypeMap[hour.type],
                    hours: hour.hours,
                },
            });
        }

        // ----------------------------------------------------
        // Reviews
        // ----------------------------------------------------

        for (const review of reviews) {
            await prisma.reportReview.create({
                data: {
                    reportId: report.id,
                    reportVersionId: version.id,
                    reviewerId: review.reviewerId,
                    actionId:
                        reviewActionMap[
                            review.action
                        ],
                    comment: review.comment || null,
                },
            });
        }

        return report;
    }

    // ========================================================
    // 11. DEMO REPORTS
    // ========================================================

    // --------------------------------------------------------
    // JOHN DOE - APPROVED REPORT
    // --------------------------------------------------------

    await createReport({
        userId: john.id,
        projectId: weeklyReportProject.id,
        weekStart: '2026-08-31',
        weekEnd: '2026-09-06',
        statusCode: 'APPROVED',
        nextWeekPlan:
            'Continue improving the reporting dashboard and complete remaining UI work.',
        notes:
            'Completed the planned development work for the week.',
        links:
            'https://github.com/example/weekly-report-system',
        tasks: [
            {
                taskName: 'Implement manager dashboard',
                priority: 'HIGH',
                plannedPercentage: 100,
                actualPercentage: 100,
                status: 'COMPLETED',
                plannedHours: 8,
                spentHours: 7.5,
                deliverable:
                    'Completed manager dashboard implementation.',
            },
            {
                taskName: 'Implement report filtering',
                priority: 'MEDIUM',
                plannedPercentage: 100,
                actualPercentage: 100,
                status: 'COMPLETED',
                plannedHours: 5,
                spentHours: 5,
                deliverable:
                    'Added report filtering by member, project and status.',
            },
        ],
        achievements: [
            {
                text:
                    'Completed manager reporting dashboard.',
                isKey: true,
            },
            {
                text:
                    'Implemented report filtering functionality.',
                isKey: false,
            },
        ],
        blockers: [],
        hours: [
            {
                type: 'DEVELOPMENT',
                hours: 12.5,
            },
            {
                type: 'TESTING',
                hours: 3,
            },
            {
                type: 'MEETING',
                hours: 1.5,
            },
        ],
        reviews: [
            {
                reviewerId: manager.id,
                action: 'APPROVE',
                comment:
                    'Good progress. All planned work has been completed.',
            },
        ],
    });

    // --------------------------------------------------------
    // JOHN DOE - DRAFT
    // --------------------------------------------------------

    await createReport({
        userId: john.id,
        projectId: weeklyReportProject.id,
        weekStart: '2026-09-07',
        weekEnd: '2026-09-13',
        statusCode: 'DRAFT',
        nextWeekPlan:
            'Complete the remaining report review improvements.',
        notes:
            'This report is still being prepared.',
        tasks: [
            {
                taskName: 'Improve report details page',
                priority: 'MEDIUM',
                plannedPercentage: 60,
                actualPercentage: 20,
                status: 'IN_PROGRESS',
                plannedHours: 8,
                spentHours: 2,
                deliverable:
                    'Initial improvements completed.',
            },
        ],
        achievements: [
            {
                text:
                    'Started report details improvements.',
                isKey: false,
            },
        ],
        hours: [
            {
                type: 'DEVELOPMENT',
                hours: 2,
            },
        ],
    });

    // --------------------------------------------------------
    // JANE SMITH - SUBMITTED
    // --------------------------------------------------------

    await createReport({
        userId: jane.id,
        projectId: accountingProject.id,
        weekStart: '2026-08-31',
        weekEnd: '2026-09-06',
        statusCode: 'SUBMITTED',
        nextWeekPlan:
            'Continue developing accounting reports and improve transaction validation.',
        notes:
            'All planned work was completed and the report is ready for manager review.',
        links:
            'https://github.com/example/accounting-system',
        tasks: [
            {
                taskName: 'Implement transaction validation',
                priority: 'HIGH',
                plannedPercentage: 100,
                actualPercentage: 90,
                status: 'IN_PROGRESS',
                plannedHours: 10,
                spentHours: 9,
                deliverable:
                    'Implemented transaction validation rules.',
            },
            {
                taskName: 'Update accounting reports',
                priority: 'MEDIUM',
                plannedPercentage: 100,
                actualPercentage: 100,
                status: 'COMPLETED',
                plannedHours: 6,
                spentHours: 6,
                deliverable:
                    'Updated monthly accounting report calculations.',
            },
        ],
        achievements: [
            {
                text:
                    'Implemented transaction validation.',
                isKey: true,
            },
        ],
        blockers: [],
        hours: [
            {
                type: 'DEVELOPMENT',
                hours: 15,
            },
            {
                type: 'TESTING',
                hours: 3,
            },
        ],
    });

    // --------------------------------------------------------
    // JANE SMITH - CORRECTION REQUESTED
    // --------------------------------------------------------

    await createReport({
        userId: jane.id,
        projectId: weeklyReportProject.id,
        weekStart: '2026-08-24',
        weekEnd: '2026-08-30',
        statusCode: 'CORRECTION_REQUESTED',
        nextWeekPlan:
            'Correct the report calculations and provide clearer deliverables.',
        notes:
            'Report requires additional clarification.',
        tasks: [
            {
                taskName: 'Prepare weekly statistics',
                priority: 'HIGH',
                plannedPercentage: 100,
                actualPercentage: 75,
                status: 'COMPLETED',
                plannedHours: 6,
                spentHours: 7,
                deliverable:
                    'Prepared initial weekly statistics.',
            },
        ],
        achievements: [
            {
                text:
                    'Prepared weekly statistics.',
                isKey: true,
            },
        ],
        blockers: [
            {
                text:
                    'Some source data was incomplete.',
                isKey: true,
            },
        ],
        hours: [
            {
                type: 'DEVELOPMENT',
                hours: 5,
            },
            {
                type: 'RESEARCH',
                hours: 2,
            },
        ],
        reviews: [
            {
                reviewerId: manager.id,
                action: 'REQUEST_CORRECTION',
                comment:
                    'Please provide clearer deliverables and verify the reported hours.',
            },
        ],
    });

    // --------------------------------------------------------
    // MIKE WILSON - DRAFT
    // --------------------------------------------------------

    await createReport({
        userId: mike.id,
        projectId: posProject.id,
        weekStart: '2026-09-07',
        weekEnd: '2026-09-13',
        statusCode: 'DRAFT',
        nextWeekPlan:
            'Continue POS checkout development.',
        notes:
            'Draft report currently being prepared.',
        tasks: [
            {
                taskName: 'Implement checkout flow',
                priority: 'CRITICAL',
                plannedPercentage: 80,
                actualPercentage: 30,
                status: 'IN_PROGRESS',
                plannedHours: 12,
                spentHours: 4,
                deliverable:
                    'Checkout API integration started.',
            },
        ],
        hours: [
            {
                type: 'DEVELOPMENT',
                hours: 4,
            },
        ],
    });

    // --------------------------------------------------------
    // MIKE WILSON - SUBMITTED
    // --------------------------------------------------------

    await createReport({
        userId: mike.id,
        projectId: testingProject.id,
        weekStart: '2026-08-31',
        weekEnd: '2026-09-06',
        statusCode: 'SUBMITTED',
        nextWeekPlan:
            'Continue automated regression testing.',
        notes:
            'Automation suite is ready for manager review.',
        tasks: [
            {
                taskName: 'Create login test cases',
                priority: 'HIGH',
                plannedPercentage: 100,
                actualPercentage: 100,
                status: 'COMPLETED',
                plannedHours: 5,
                spentHours: 4.5,
                deliverable:
                    'Completed automated login test cases.',
            },
            {
                taskName: 'Create report workflow tests',
                priority: 'HIGH',
                plannedPercentage: 70,
                actualPercentage: 50,
                status: 'IN_PROGRESS',
                plannedHours: 8,
                spentHours: 5,
                deliverable:
                    'Initial report workflow tests completed.',
            },
        ],
        achievements: [
            {
                text:
                    'Automated the login test suite.',
                isKey: true,
            },
        ],
        hours: [
            {
                type: 'TESTING',
                hours: 9.5,
            },
            {
                type: 'DEVELOPMENT',
                hours: 2,
            },
        ],
    });

    console.log('Demo reports seeded.');

    // ========================================================
    // FINISHED
    // ========================================================

    console.log('');
    console.log('==========================================');
    console.log('Database seed completed successfully!');
    console.log('==========================================');
    console.log('');
    console.log('Demo accounts:');
    console.log('');
    console.log('ADMIN');
    console.log('Email: admin@example.com');
    console.log('Password: Password123!');
    console.log('');
    console.log('MANAGER');
    console.log('Email: manager@example.com');
    console.log('Password: Password123!');
    console.log('');
    console.log('TEAM MEMBER');
    console.log('Email: john@example.com');
    console.log('Password: Password123!');
    console.log('');
    console.log('TEAM MEMBER');
    console.log('Email: jane@example.com');
    console.log('Password: Password123!');
    console.log('');
    console.log('TEAM MEMBER');
    console.log('Email: mike@example.com');
    console.log('Password: Password123!');
    console.log('');
}

main()
    .catch((error) => {
        console.error('Seeding failed:');
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

