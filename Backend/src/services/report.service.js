const prisma = require('../config/prisma');

const createReport = async ({ userId, projectId, weekStart, weekEnd }) => {

    const membership = await prisma.projectMember.findFirst({
        where: {
            projectId,
            userId
        }
    });

    if (!membership) {
        const error = new Error('You are not a member of this project');
        error.statusCode = 403;
        throw error;
    }

    const status = await prisma.reportStatus.findFirst({
        where: {
            code: 'DRAFT'
        }
    });

    if (!status) {
        const error = new Error('Initial report status not found');
        error.statusCode = 500;
        throw error;
    }

    const report = await prisma.report.create({
        data: {
            userId,
            projectId,
            weekStart: new Date(weekStart),
            weekEnd: new Date(weekEnd),
            statusId: status.id
        }
    });

    return report;
};
const getReports = async (userId) => {
    return await prisma.report.findMany({
        where: {
            userId
        },
        include: {
            project: true,
            status: true
        },
        orderBy: {
            weekStart: 'desc'
        }
    });
};
const getReportById = async (reportId, userId) => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    include: { project: true, status: true }
  });

  if (!report) {
    const error = new Error('Report not found');
    error.statusCode = 404;
    throw error;
  }

  if (report.userId !== userId) {
    const error = new Error('You do not have permission to view this report');
    error.statusCode = 403;
    throw error;
  }

  return report;
};
const getManagerReportById = async (reportId) => {
    const report = await prisma.report.findUnique({
        where: {
            id: reportId
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            project: {
                include: {
                    category: true
                }
            },
            status: true
        }
    });

    if (!report) {
        const error = new Error('Report not found');
        error.statusCode = 404;
        throw error;
    }

    return report;
};
const createReportVersion = async ({
    reportId,
    userId,
    nextWeekPlan,
    notes,
    links
}) => {
    const report = await prisma.report.findUnique({
        where: {
            id: reportId
        }
    });

    if (!report) {
        const error = new Error('Report not found');
        error.statusCode = 404;
        throw error;
    }

    if (report.userId !== userId) {
        const error = new Error(
            'You do not have permission to edit this report'
        );
        error.statusCode = 403;
        throw error;
    }

    if (report.currentVersionId !== null) {
        const error = new Error(
            'A report version already exists'
        );
        error.statusCode = 409;
        throw error;
    }

    const version = await prisma.reportVersion.create({
        data: {
            reportId,
            versionNumber: 1,
            createdById: userId,
            nextWeekPlan,
            notes,
            links
        }
    });

    await prisma.report.update({
        where: {
            id: reportId
        },
        data: {
            currentVersionId: version.id
        }
    });

    return version; 
};
const createReportTask = async ({
    reportId,
    versionId,
    userId,
    taskName,
    priorityId,
    plannedPercentage,
    actualPercentage,
    statusId,
    plannedHours,
    spentHours,
    deliverable
}) => {
    const report = await prisma.report.findUnique({
        where: {
            id: reportId
        }
    });

    if (!report) {
        const error = new Error('Report not found');
        error.statusCode = 404;
        throw error;
    }

    if (report.userId !== userId) {
        const error = new Error(
            'You do not have permission to edit this report'
        );
        error.statusCode = 403;
        throw error;
    }

    const version = await prisma.reportVersion.findUnique({
        where: {
            id: versionId
        }
    });

    if (!version || version.reportId !== reportId) {
        const error = new Error('Report version not found');
        error.statusCode = 404;
        throw error;
    }

    if (version.submittedAt !== null) {
        const error = new Error(
            'Submitted report versions cannot be modified'
        );
        error.statusCode = 400;
        throw error;
    }

    const task = await prisma.reportTask.create({
        data: {
            reportVersionId: versionId,
            taskName,
            priorityId,
            plannedPercentage,
            actualPercentage,
            statusId,
            plannedHours,
            spentHours,
            deliverable
        }
    });

    return task;
};
const createReportAchievement = async ({
    reportId,
    versionId,
    userId,
    achievement,
    isKeyAchievement
}) => {
    const report = await prisma.report.findUnique({
        where: { id: reportId }
    });

    if (!report) {
        const error = new Error('Report not found');
        error.statusCode = 404;
        throw error;
    }

    if (report.userId !== userId) {
        const error = new Error(
            'You do not have permission to edit this report'
        );
        error.statusCode = 403;
        throw error;
    }

    const version = await prisma.reportVersion.findUnique({
        where: { id: versionId }
    });

    if (!version || version.reportId !== reportId) {
        const error = new Error('Report version not found');
        error.statusCode = 404;
        throw error;
    }

    if (version.submittedAt !== null) {
        const error = new Error(
            'Submitted report versions cannot be modified'
        );
        error.statusCode = 400;
        throw error;
    }

    const result = await prisma.reportAchievement.create({
        data: {
            reportVersionId: versionId,
            achievement,
            isKeyAchievement
        }
    });

    return result;
};
const createReportBlocker = async ({
    reportId,
    versionId,
    userId,
    blocker,
    isKeyBlocker
}) => {
    const report = await prisma.report.findUnique({
        where: { id: reportId }
    });

    if (!report) {
        const error = new Error('Report not found');
        error.statusCode = 404;
        throw error;
    }

    if (report.userId !== userId) {
        const error = new Error(
            'You do not have permission to edit this report'
        );
        error.statusCode = 403;
        throw error;
    }

    const version = await prisma.reportVersion.findUnique({
        where: { id: versionId }
    });

    if (!version || version.reportId !== reportId) {
        const error = new Error('Report version not found');
        error.statusCode = 404;
        throw error;
    }

    if (version.submittedAt !== null) {
        const error = new Error(
            'Submitted report versions cannot be modified'
        );
        error.statusCode = 400;
        throw error;
    }

    const result = await prisma.reportBlocker.create({
        data: {
            reportVersionId: versionId,
            blocker,
            isKeyBlocker
        }
    });

    return result;
};
const createReportHours = async ({
    reportId,
    versionId,
    userId,
    taskTypeId,
    hours
}) => {
    const report = await prisma.report.findUnique({
        where: { id: reportId }
    });

    if (!report) {
        const error = new Error('Report not found');
        error.statusCode = 404;
        throw error;
    }

    if (report.userId !== userId) {
        const error = new Error(
            'You do not have permission to edit this report'
        );
        error.statusCode = 403;
        throw error;
    }

    const version = await prisma.reportVersion.findUnique({
        where: { id: versionId }
    });

    if (!version || version.reportId !== reportId) {
        const error = new Error('Report version not found');
        error.statusCode = 404;
        throw error;
    }

    if (version.submittedAt !== null) {
        const error = new Error(
            'Submitted report versions cannot be modified'
        );
        error.statusCode = 400;
        throw error;
    }

    const taskType = await prisma.taskType.findUnique({
        where: { id: taskTypeId }
    });

    if (!taskType) {
        const error = new Error('Task type not found');
        error.statusCode = 404;
        throw error;
    }

    const existingHours = await prisma.reportHour.findUnique({
        where: {
            reportVersionId_taskTypeId: {
                reportVersionId: versionId,
                taskTypeId
            }
        }
    });

    if (existingHours) {
        const error = new Error(
            'Hours for this task type already exist'
        );
        error.statusCode = 409;
        throw error;
    }

    const reportHours = await prisma.reportHour.create({
        data: {
            reportVersionId: versionId,
            taskTypeId,
            hours
        }
    });

    return reportHours;
};
const updateReportTask = async ({
    taskId,
    userId,
    data
}) => {
    const task = await prisma.reportTask.findUnique({
        where: {
            id: taskId
        },
        include: {
            reportVersion: {
                include: {
                    report: true
                }
            }
        }
    });

    if (!task) {
        const error = new Error('Report task not found');
        error.statusCode = 404;
        throw error;
    }

    if (task.reportVersion.report.userId !== userId) {
        const error = new Error(
            'You do not have permission to edit this task'
        );
        error.statusCode = 403;
        throw error;
    }

    if (task.reportVersion.submittedAt !== null) {
        const error = new Error(
            'Submitted report versions cannot be modified'
        );
        error.statusCode = 400;
        throw error;
    }

    return await prisma.reportTask.update({
        where: {
            id: taskId
        },
        data
    });
};
const deleteReportTask = async ({
    taskId,
    userId
}) => {
    const task = await prisma.reportTask.findUnique({
        where: {
            id: taskId
        },
        include: {
            reportVersion: {
                include: {
                    report: true
                }
            }
        }
    });

    if (!task) {
        const error = new Error('Report task not found');
        error.statusCode = 404;
        throw error;
    }

    if (task.reportVersion.report.userId !== userId) {
        const error = new Error(
            'You do not have permission to delete this task'
        );
        error.statusCode = 403;
        throw error;
    }

    if (task.reportVersion.submittedAt !== null) {
        const error = new Error(
            'Submitted report versions cannot be modified'
        );
        error.statusCode = 400;
        throw error;
    }

    await prisma.reportTask.delete({
        where: {
            id: taskId
        }
    });
};
const updateReportAchievement = async ({ achievementId, userId, data }) => {

    const achievement = await prisma.reportAchievement.findUnique({
        where: {
            id: achievementId
        }
    });

    if (!achievement) {
        const error = new Error('Achievement not found');
        error.statusCode = 404;
        throw error;
    }

    const version = await prisma.reportVersion.findUnique({
        where: {
            id: achievement.reportVersionId
        }
    });

    if (!version) {
        const error = new Error('Report version not found');
        error.statusCode = 404;
        throw error;
    }

    const report = await prisma.report.findUnique({
        where: {
            id: version.reportId
        }
    });

    if (!report) {
        const error = new Error('Report not found');
        error.statusCode = 404;
        throw error;
    }

    if (report.userId !== userId) {
        const error = new Error('You are not allowed to modify this achievement');
        error.statusCode = 403;
        throw error;
    }

    if (version.submittedAt !== null) {
        const error = new Error('Submitted report versions cannot be modified');
        error.statusCode = 400;
        throw error;
    }

    return await prisma.reportAchievement.update({
        where: {
            id: achievementId
        },
        data
    });
};


const deleteReportAchievement = async ({ achievementId, userId }) => {

    const achievement = await prisma.reportAchievement.findUnique({
        where: {
            id: achievementId
        }
    });

    if (!achievement) {
        const error = new Error('Achievement not found');
        error.statusCode = 404;
        throw error;
    }

    const version = await prisma.reportVersion.findUnique({
        where: {
            id: achievement.reportVersionId
        }
    });

    if (!version) {
        const error = new Error('Report version not found');
        error.statusCode = 404;
        throw error;
    }

    const report = await prisma.report.findUnique({
        where: {
            id: version.reportId
        }
    });

    if (!report) {
        const error = new Error('Report not found');
        error.statusCode = 404;
        throw error;
    }

    if (report.userId !== userId) {
        const error = new Error('You are not allowed to delete this achievement');
        error.statusCode = 403;
        throw error;
    }

    if (version.submittedAt !== null) {
        const error = new Error('Submitted report versions cannot be modified');
        error.statusCode = 400;
        throw error;
    }

    await prisma.reportAchievement.delete({
        where: {
            id: achievementId
        }
    });
};
const updateReportBlocker = async ({ blockerId, userId, data }) => {

    const blocker = await prisma.reportBlocker.findUnique({
        where: {
            id: blockerId
        }
    });

    if (!blocker) {
        const error = new Error('Blocker not found');
        error.statusCode = 404;
        throw error;
    }

    const version = await prisma.reportVersion.findUnique({
        where: {
            id: blocker.reportVersionId
        }
    });

    if (!version) {
        const error = new Error('Report version not found');
        error.statusCode = 404;
        throw error;
    }

    const report = await prisma.report.findUnique({
        where: {
            id: version.reportId
        }
    });

    if (!report) {
        const error = new Error('Report not found');
        error.statusCode = 404;
        throw error;
    }

    if (report.userId !== userId) {
        const error = new Error('You are not allowed to modify this blocker');
        error.statusCode = 403;
        throw error;
    }

    if (version.submittedAt !== null) {
        const error = new Error('Submitted report versions cannot be modified');
        error.statusCode = 400;
        throw error;
    }

    return await prisma.reportBlocker.update({
        where: {
            id: blockerId
        },
        data
    });
};


const deleteReportBlocker = async ({ blockerId, userId }) => {

    const blocker = await prisma.reportBlocker.findUnique({
        where: {
            id: blockerId
        }
    });

    if (!blocker) {
        const error = new Error('Blocker not found');
        error.statusCode = 404;
        throw error;
    }

    const version = await prisma.reportVersion.findUnique({
        where: {
            id: blocker.reportVersionId
        }
    });

    if (!version) {
        const error = new Error('Report version not found');
        error.statusCode = 404;
        throw error;
    }

    const report = await prisma.report.findUnique({
        where: {
            id: version.reportId
        }
    });

    if (!report) {
        const error = new Error('Report not found');
        error.statusCode = 404;
        throw error;
    }

    if (report.userId !== userId) {
        const error = new Error('You are not allowed to delete this blocker');
        error.statusCode = 403;
        throw error;
    }

    if (version.submittedAt !== null) {
        const error = new Error('Submitted report versions cannot be modified');
        error.statusCode = 400;
        throw error;
    }

    await prisma.reportBlocker.delete({
        where: {
            id: blockerId
        }
    });
};
const updateReportHour = async ({ hourId, userId, data }) => {

    const hour = await prisma.reportHour.findUnique({
        where: {
            id: hourId
        }
    });

    if (!hour) {
        const error = new Error('Report hour not found');
        error.statusCode = 404;
        throw error;
    }

    const version = await prisma.reportVersion.findUnique({
        where: {
            id: hour.reportVersionId
        }
    });

    if (!version) {
        const error = new Error('Report version not found');
        error.statusCode = 404;
        throw error;
    }

    const report = await prisma.report.findUnique({
        where: {
            id: version.reportId
        }
    });

    if (!report) {
        const error = new Error('Report not found');
        error.statusCode = 404;
        throw error;
    }

    if (report.userId !== userId) {
        const error = new Error('You are not allowed to modify these hours');
        error.statusCode = 403;
        throw error;
    }

    if (version.submittedAt !== null) {
        const error = new Error('Submitted report versions cannot be modified');
        error.statusCode = 400;
        throw error;
    }

    if (data.taskTypeId !== undefined) {
        const taskType = await prisma.taskType.findUnique({
            where: {
                id: data.taskTypeId
            }
        });

        if (!taskType) {
            const error = new Error('Task type not found');
            error.statusCode = 404;
            throw error;
        }

        const existingHour = await prisma.reportHour.findFirst({
            where: {
                reportVersionId: hour.reportVersionId,
                taskTypeId: data.taskTypeId,
                NOT: {
                    id: hourId
                }
            }
        });

        if (existingHour) {
            const error = new Error(
                'Hours for this task type already exist for this report version'
            );
            error.statusCode = 409;
            throw error;
        }
    }

    return await prisma.reportHour.update({
        where: {
            id: hourId
        },
        data
    });
};


const deleteReportHour = async ({ hourId, userId }) => {

    const hour = await prisma.reportHour.findUnique({
        where: {
            id: hourId
        }
    });

    if (!hour) {
        const error = new Error('Report hour not found');
        error.statusCode = 404;
        throw error;
    }

    const version = await prisma.reportVersion.findUnique({
        where: {
            id: hour.reportVersionId
        }
    });

    if (!version) {
        const error = new Error('Report version not found');
        error.statusCode = 404;
        throw error;
    }

    const report = await prisma.report.findUnique({
        where: {
            id: version.reportId
        }
    });

    if (!report) {
        const error = new Error('Report not found');
        error.statusCode = 404;
        throw error;
    }

    if (report.userId !== userId) {
        const error = new Error('You are not allowed to delete these hours');
        error.statusCode = 403;
        throw error;
    }

    if (version.submittedAt !== null) {
        const error = new Error('Submitted report versions cannot be modified');
        error.statusCode = 400;
        throw error;
    }

    await prisma.reportHour.delete({
        where: {
            id: hourId
        }
    });
};
const submitReportVersion = async ({ reportId, versionId, userId }) => {

    const report = await prisma.report.findUnique({
        where: {
            id: reportId
        }
    });

    if (!report) {
        const error = new Error('Report not found');
        error.statusCode = 404;
        throw error;
    }

    if (report.userId !== userId) {
        const error = new Error('You are not allowed to submit this report');
        error.statusCode = 403;
        throw error;
    }

    const version = await prisma.reportVersion.findUnique({
        where: {
            id: versionId
        }
    });

    if (!version) {
        const error = new Error('Report version not found');
        error.statusCode = 404;
        throw error;
    }

    if (version.reportId !== reportId) {
        const error = new Error('Report version does not belong to this report');
        error.statusCode = 400;
        throw error;
    }

    if (version.submittedAt !== null) {
        const error = new Error('This report version has already been submitted');
        error.statusCode = 400;
        throw error;
    }

    // Check that at least one task exists
    const taskCount = await prisma.reportTask.count({
        where: {
            reportVersionId: versionId
        }
    });

    if (taskCount === 0) {
        const error = new Error('At least one task is required before submitting the report');
        error.statusCode = 400;
        throw error;
    }

    // Check exactly one key achievement
    const keyAchievementCount = await prisma.reportAchievement.count({
        where: {
            reportVersionId: versionId,
            isKeyAchievement: true
        }
    });

    if (keyAchievementCount !== 1) {
        const error = new Error('The report must have exactly one key achievement');
        error.statusCode = 400;
        throw error;
    }

    // Check exactly one key blocker
    const keyBlockerCount = await prisma.reportBlocker.count({
        where: {
            reportVersionId: versionId,
            isKeyBlocker: true
        }
    });

    if (keyBlockerCount !== 1) {
        const error = new Error('The report must have exactly one key blocker');
        error.statusCode = 400;
        throw error;
    }

    // Find SUBMITTED status
    const submittedStatus = await prisma.reportStatus.findUnique({
        where: {
            code: 'SUBMITTED'
        }
    });

    if (!submittedStatus) {
        const error = new Error('SUBMITTED status not found');
        error.statusCode = 500;
        throw error;
    }

    const submittedAt = new Date();

    // Update version and report together
    const result = await prisma.$transaction([
        prisma.reportVersion.update({
            where: {
                id: versionId
            },
            data: {
                submittedAt
            }
        }),

        prisma.report.update({
            where: {
                id: reportId
            },
            data: {
                statusId: submittedStatus.id
            }
        })
    ]);

    return {
        report: result[1],
        version: result[0]
    };
};
const requestReportCorrection = async ({
    reportId,
    versionId,
    reviewerId,
    comment
}) => {

    // Find report
    const report = await prisma.report.findUnique({
        where: {
            id: reportId
        }
    });

    if (!report) {
        const error = new Error('Report not found');
        error.statusCode = 404;
        throw error;
    }

    // Find version
    const version = await prisma.reportVersion.findUnique({
        where: {
            id: versionId
        }
    });

    if (!version) {
        const error = new Error('Report version not found');
        error.statusCode = 404;
        throw error;
    }

    if (version.reportId !== reportId) {
        const error = new Error('Report version does not belong to this report');
        error.statusCode = 400;
        throw error;
    }

    // Version must already be submitted
    if (version.submittedAt === null) {
        const error = new Error('Only submitted reports can be sent for correction');
        error.statusCode = 400;
        throw error;
    }

    // Make sure current report status is SUBMITTED
    const submittedStatus = await prisma.reportStatus.findUnique({
        where: {
            code: 'SUBMITTED'
        }
    });

    if (!submittedStatus || report.statusId !== submittedStatus.id) {
        const error = new Error('Report is not currently submitted');
        error.statusCode = 400;
        throw error;
    }

    // Find correction action
    const correctionAction = await prisma.reviewAction.findUnique({
        where: {
            code: 'REQUEST_CORRECTION'
        }
    });

    if (!correctionAction) {
        const error = new Error('REQUEST_CORRECTION action not found');
        error.statusCode = 500;
        throw error;
    }

    // Find correction-requested status
    const correctionStatus = await prisma.reportStatus.findUnique({
        where: {
            code: 'CORRECTION_REQUESTED'
        }
    });

    if (!correctionStatus) {
        const error = new Error('CORRECTION_REQUESTED status not found');
        error.statusCode = 500;
        throw error;
    }

    // Create review and update report together
    const result = await prisma.$transaction([
        prisma.reportReview.create({
            data: {
                reportId,
                reportVersionId: versionId,
                reviewerId,
                actionId: correctionAction.id,
                comment
            }
        }),

        prisma.report.update({
            where: {
                id: reportId
            },
            data: {
                statusId: correctionStatus.id
            }
        })
    ]);

    return {
        review: result[0],
        report: result[1]
    };
};
// const createCorrectionVersion = async ({
//     reportId,
//     userId
// }) => {

//     const report = await prisma.report.findUnique({
//         where: {
//             id: reportId
//         }
//     });

//     if (!report) {
//         const error = new Error('Report not found');
//         error.statusCode = 404;
//         throw error;
//     }

//     if (report.userId !== userId) {
//         const error = new Error(
//             'You are not allowed to create a correction version'
//         );
//         error.statusCode = 403;
//         throw error;
//     }

//     const correctionStatus = await prisma.reportStatus.findUnique({
//         where: {
//             code: 'CORRECTION_REQUESTED'
//         }
//     });

//     if (!correctionStatus || report.statusId !== correctionStatus.id) {
//         const error = new Error(
//             'This report is not waiting for correction'
//         );
//         error.statusCode = 400;
//         throw error;
//     }

//     const currentVersion = await prisma.reportVersion.findUnique({
//         where: {
//             id: report.currentVersionId
//         },
//         include: {
//             tasks: true,
//             achievements: true,
//             blockers: true,
//             hours: true
//         }
//     });

//     if (!currentVersion) {
//         const error = new Error('Current report version not found');
//         error.statusCode = 404;
//         throw error;
//     }

//     const newVersionNumber = currentVersion.versionNumber + 1;

//     const newVersion = await prisma.$transaction(async (tx) => {

//         const version = await tx.reportVersion.create({
//             data: {
//                 reportId,
//                 versionNumber: newVersionNumber,
//                 createdById: userId,
//                 nextWeekPlan: currentVersion.nextWeekPlan,
//                 notes: currentVersion.notes,
//                 links: currentVersion.links
//             }
//         });

//         if (currentVersion.tasks.length > 0) {
//             await tx.reportTask.createMany({
//                 data: currentVersion.tasks.map(task => ({
//                     reportVersionId: version.id,
//                    taskName: task.taskName,
//                     percentage: task.percentage
//                 }))
//             });
//         }

//         if (currentVersion.achievements.length > 0) {
//             await tx.reportAchievement.createMany({
//                 data: currentVersion.achievements.map(achievement => ({
//                     reportVersionId: version.id,
//                     achievement: achievement.achievement,
//                     isKeyAchievement: achievement.isKeyAchievement
//                 }))
//             });
//         }

//         if (currentVersion.blockers.length > 0) {
//             await tx.reportBlocker.createMany({
//                 data: currentVersion.blockers.map(blocker => ({
//                     reportVersionId: version.id,
//                     blocker: blocker.blocker,
//                     isKeyBlocker: blocker.isKeyBlocker
//                 }))
//             });
//         }

//         if (currentVersion.hours.length > 0) {
//             await tx.reportHour.createMany({
//                 data: currentVersion.hours.map(hour => ({
//                     reportVersionId: version.id,
//                     taskTypeId: hour.taskTypeId,
//                     hours: hour.hours
//                 }))
//             });
//         }

//         await tx.report.update({
//             where: {
//                 id: reportId
//             },
//             data: {
//                 currentVersionId: version.id
//             }
//         });

//         return version;
//     });

//     return newVersion;
// };
// const createCorrectionVersion = async ({
//     reportId,
//     userId
// }) => {

//     const report = await prisma.report.findUnique({
//         where: {
//             id: reportId
//         }
//     });

//     if (!report) {
//         const error = new Error('Report not found');
//         error.statusCode = 404;
//         throw error;
//     }

//     if (report.userId !== userId) {
//         const error = new Error(
//             'You are not allowed to create a correction version'
//         );
//         error.statusCode = 403;
//         throw error;
//     }

//     const correctionStatus = await prisma.reportStatus.findUnique({
//         where: {
//             code: 'CORRECTION_REQUESTED'
//         }
//     });

//     if (!correctionStatus) {
//         const error = new Error(
//             'CORRECTION_REQUESTED status not found'
//         );
//         error.statusCode = 500;
//         throw error;
//     }

//     if (report.statusId !== correctionStatus.id) {
//         const error = new Error(
//             'This report is not waiting for correction'
//         );
//         error.statusCode = 400;
//         throw error;
//     }

//     if (!report.currentVersionId) {
//         const error = new Error(
//             'Current report version not found'
//         );
//         error.statusCode = 404;
//         throw error;
//     }

//     const currentVersion = await prisma.reportVersion.findUnique({
//         where: {
//             id: report.currentVersionId
//         },
//         include: {
//             tasks: true,
//             achievements: true,
//             blockers: true,
//             hours: true
//         }
//     });

//     if (!currentVersion) {
//         const error = new Error(
//             'Current report version not found'
//         );
//         error.statusCode = 404;
//         throw error;
//     }

//     const newVersionNumber = currentVersion.versionNumber + 1;

//     const newVersion = await prisma.$transaction(async (tx) => {

//         const version = await tx.reportVersion.create({
//             data: {
//                 reportId,
//                 versionNumber: newVersionNumber,
//                 createdById: userId,
//                 nextWeekPlan: currentVersion.nextWeekPlan,
//                 notes: currentVersion.notes,
//                 links: currentVersion.links
//             }
//         });

//         if (currentVersion.tasks.length > 0) {
//             await tx.reportTask.createMany({
//                 data: currentVersion.tasks.map(task => ({
//                     reportVersionId: version.id,
//                     taskName: task.taskName,
//                     priorityId: task.priorityId,
//                     plannedPercentage: task.plannedPercentage,
//                     actualPercentage: task.actualPercentage,
//                     statusId: task.statusId,
//                     plannedHours: task.plannedHours,
//                     spentHours: task.spentHours,
//                     deliverable: task.deliverable
//                 }))
//             });
//         }

//         if (currentVersion.achievements.length > 0) {
//             await tx.reportAchievement.createMany({
//                 data: currentVersion.achievements.map(achievement => ({
//                     reportVersionId: version.id,
//                     achievement: achievement.achievement,
//                     isKeyAchievement: achievement.isKeyAchievement
//                 }))
//             });
//         }

//         if (currentVersion.blockers.length > 0) {
//             await tx.reportBlocker.createMany({
//                 data: currentVersion.blockers.map(blocker => ({
//                     reportVersionId: version.id,
//                     blocker: blocker.blocker,
//                     isKeyBlocker: blocker.isKeyBlocker
//                 }))
//             });
//         }

//         if (currentVersion.hours.length > 0) {
//             await tx.reportHour.createMany({
//                 data: currentVersion.hours.map(hour => ({
//                     reportVersionId: version.id,
//                     taskTypeId: hour.taskTypeId,
//                     hours: hour.hours
//                 }))
//             });
//         }

//         await tx.report.update({
//             where: {
//                 id: reportId
//             },
//             data: {
//                 currentVersionId: version.id
//             }
//         });

//         return version;
//     });

//     return newVersion;
// };

const createCorrectionVersion = async ({
    reportId,
    userId
}) => {

    const report = await prisma.report.findUnique({
        where: {
            id: reportId
        }
    });

    if (!report) {
        const error = new Error('Report not found');
        error.statusCode = 404;
        throw error;
    }

    if (report.userId !== userId) {
        const error = new Error(
            'You are not allowed to create a correction version'
        );
        error.statusCode = 403;
        throw error;
    }

    const correctionStatus = await prisma.reportStatus.findUnique({
        where: {
            code: 'CORRECTION_REQUESTED'
        }
    });

    if (!correctionStatus) {
        const error = new Error(
            'CORRECTION_REQUESTED status not found'
        );
        error.statusCode = 500;
        throw error;
    }

    if (report.statusId !== correctionStatus.id) {
        const error = new Error(
            'This report is not waiting for correction'
        );
        error.statusCode = 400;
        throw error;
    }

    if (!report.currentVersionId) {
        const error = new Error(
            'Current report version not found'
        );
        error.statusCode = 404;
        throw error;
    }

    const currentVersion = await prisma.reportVersion.findUnique({
        where: {
            id: report.currentVersionId
        },
        include: {
            tasks: true,
            achievements: true,
            blockers: true,
            hours: true
        }
    });

    if (!currentVersion) {
        const error = new Error(
            'Current report version not found'
        );
        error.statusCode = 404;
        throw error;
    }

    /*
     * If the current version has not been submitted yet,
     * it is already the correction/editing version.
     *
     * This prevents creating Version 3 when the user
     * refreshes or opens the Edit & Resubmit page again.
     */
    if (!currentVersion.submittedAt) {
        return currentVersion;
    }

    const newVersionNumber =
        currentVersion.versionNumber + 1;

    /*
     * Check whether the next version already exists.
     *
     * This protects against duplicate requests where
     * Version 2 may already have been created.
     */
    const existingVersion =
        await prisma.reportVersion.findUnique({
            where: {
                reportId_versionNumber: {
                    reportId,
                    versionNumber: newVersionNumber
                }
            },
            include: {
                tasks: true,
                achievements: true,
                blockers: true,
                hours: true
            }
        });

    if (existingVersion) {

        /*
         * Make sure the existing version becomes
         * the current version for editing.
         */
        await prisma.report.update({
            where: {
                id: reportId
            },
            data: {
                currentVersionId: existingVersion.id
            }
        });

        return existingVersion;
    }

    const newVersion = await prisma.$transaction(
        async (tx) => {

            const version =
                await tx.reportVersion.create({
                    data: {
                        reportId,
                        versionNumber: newVersionNumber,
                        createdById: userId,
                        nextWeekPlan: currentVersion.nextWeekPlan,
                        notes: currentVersion.notes,
                        links: currentVersion.links
                    }
                });

            if (currentVersion.tasks.length > 0) {
                await tx.reportTask.createMany({
                    data: currentVersion.tasks.map(task => ({
                        reportVersionId: version.id,
                        taskName: task.taskName,
                        priorityId: task.priorityId,
                        plannedPercentage:
                            task.plannedPercentage,
                        actualPercentage:
                            task.actualPercentage,
                        statusId: task.statusId,
                        plannedHours: task.plannedHours,
                        spentHours: task.spentHours,
                        deliverable: task.deliverable
                    }))
                });
            }

            if (currentVersion.achievements.length > 0) {
                await tx.reportAchievement.createMany({
                    data:
                        currentVersion.achievements.map(
                            achievement => ({
                                reportVersionId: version.id,
                                achievement:
                                    achievement.achievement,
                                isKeyAchievement:
                                    achievement.isKeyAchievement
                            })
                        )
                });
            }

            if (currentVersion.blockers.length > 0) {
                await tx.reportBlocker.createMany({
                    data:
                        currentVersion.blockers.map(
                            blocker => ({
                                reportVersionId: version.id,
                                blocker: blocker.blocker,
                                isKeyBlocker:
                                    blocker.isKeyBlocker
                            })
                        )
                });
            }

            if (currentVersion.hours.length > 0) {
                await tx.reportHour.createMany({
                    data:
                        currentVersion.hours.map(hour => ({
                            reportVersionId: version.id,
                            taskTypeId: hour.taskTypeId,
                            hours: hour.hours
                        }))
                });
            }

            await tx.report.update({
                where: {
                    id: reportId
                },
                data: {
                    currentVersionId: version.id
                }
            });

            return version;
        }
    );

    return newVersion;
};


const approveReport = async ({
    reportId,
    versionId,
    reviewerId,
    comment
}) => {

    // Find report
    const report = await prisma.report.findUnique({
        where: {
            id: reportId
        }
    });

    if (!report) {
        const error = new Error('Report not found');
        error.statusCode = 404;
        throw error;
    }

    // Find version
    const version = await prisma.reportVersion.findUnique({
        where: {
            id: versionId
        }
    });

    if (!version) {
        const error = new Error('Report version not found');
        error.statusCode = 404;
        throw error;
    }

    if (version.reportId !== reportId) {
        const error = new Error('Report version does not belong to this report');
        error.statusCode = 400;
        throw error;
    }

    // Version must already be submitted
    if (version.submittedAt === null) {
        const error = new Error('Only submitted reports can be approved');
        error.statusCode = 400;
        throw error;
    }

    // Make sure current report status is SUBMITTED
    const submittedStatus = await prisma.reportStatus.findUnique({
        where: {
            code: 'SUBMITTED'
        }
    });

    if (!submittedStatus || report.statusId !== submittedStatus.id) {
        const error = new Error('Report is not currently submitted');
        error.statusCode = 400;
        throw error;
    }

    // Find approve action
    const approveAction = await prisma.reviewAction.findUnique({
        where: {
            code: 'APPROVE'
        }
    });

    if (!approveAction) {
        const error = new Error('APPROVE action not found');
        error.statusCode = 500;
        throw error;
    }

    // Find approved status
    const approvedStatus = await prisma.reportStatus.findUnique({
        where: {
            code: 'APPROVED'
        }
    });

    if (!approvedStatus) {
        const error = new Error('APPROVED status not found');
        error.statusCode = 500;
        throw error;
    }

    // Create review and update report together
    const result = await prisma.$transaction([
        prisma.reportReview.create({
            data: {
                reportId,
                reportVersionId: versionId,
                reviewerId,
                actionId: approveAction.id,
                comment: comment || null
            }
        }),

        prisma.report.update({
            where: {
                id: reportId
            },
            data: {
                statusId: approvedStatus.id
            }
        })
    ]);

    return {
        review: result[0],
        report: result[1]
    };
};
const getReportReviews = async ({
    reportId,
    userId,
    role
}) => {

    // Find report
    const report = await prisma.report.findUnique({
        where: {
            id: reportId
        }
    });

    if (!report) {
        const error = new Error('Report not found');
        error.statusCode = 404;
        throw error;
    }

    // Team members can only view reviews of their own reports
    if (role === 'TEAM_MEMBER' && report.userId !== userId) {
        const error = new Error(
            'You are not allowed to view this report review history'
        );
        error.statusCode = 403;
        throw error;
    }

    const reviews = await prisma.reportReview.findMany({
        where: {
            reportId
        },
        include: {
            reviewer: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            action: {
                select: {
                    id: true,
                    code: true,
                    name: true
                }
            },
            reportVersion: {
                select: {
                    id: true,
                    versionNumber: true,
                    createdAt: true,
                    submittedAt: true
                }
            }
        },
        orderBy: {
            createdAt: 'asc'
        }
    });

    return reviews;
};
const getDashboardSummary = async () => {

    const submittedStatus = await prisma.reportStatus.findUnique({
        where: {
            code: 'SUBMITTED'
        }
    });

    const correctionStatus = await prisma.reportStatus.findUnique({
        where: {
            code: 'CORRECTION_REQUESTED'
        }
    });

    const approvedStatus = await prisma.reportStatus.findUnique({
        where: {
            code: 'APPROVED'
        }
    });

    if (!submittedStatus || !correctionStatus || !approvedStatus) {
        const error = new Error('Required report statuses not found');
        error.statusCode = 500;
        throw error;
    }

    // Get current week's Monday and Sunday
    const today = new Date();

    const day = today.getDay();

    const monday = new Date(today);
    monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    // Get all reports for this week
    const reports = await prisma.report.findMany({
        where: {
            weekStart: {
                gte: monday
            },
            weekEnd: {
                lte: sunday
            }
        }
    });

    const totalReports = reports.length;

    const submittedCount = reports.filter(
        report => report.statusId === submittedStatus.id
    ).length;

    const correctionCount = reports.filter(
        report => report.statusId === correctionStatus.id
    ).length;

    const approvedCount = reports.filter(
        report => report.statusId === approvedStatus.id
    ).length;

    const complianceRate = totalReports > 0
        ? Number(
            (((submittedCount + approvedCount) / totalReports) * 100).toFixed(2)
        )
        : 0;

    return {
        weekStart: monday,
        weekEnd: sunday,
        totalReports,
        submittedCount,
        correctionCount,
        approvedCount,
        complianceRate
    };
};
const getManagerReports = async ({
    userId,
    projectId,
    categoryId,
    statusId,
    startDate,
    endDate,
     page = 1,
    limit = 10
}) => {

    const where = {};

    if (userId) {
        where.userId = userId;
    }

    if (projectId) {
        where.projectId = projectId;
    }
    if (categoryId) {
         where.project = { categoryId: categoryId }; 
        }

    if (statusId) {
        where.statusId = statusId;
    }

    if (startDate) {
        where.weekStart = {
            gte: new Date(startDate)
        };
    }

    if (endDate) {
        where.weekEnd = {
            lte: new Date(endDate)
        };
    }

    const skip = (page - 1) * limit;

    const [reports, total] = await prisma.$transaction([
        prisma.report.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                weekStart: 'desc'
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                project: {
                    select: {
                        id: true,
                        name: true,
                        category: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                status: {
                    select: {
                        id: true,
                        code: true,
                        name: true
                    }
                }
            }
        }),

        prisma.report.count({
            where
        })
    ]);

    return {
        reports,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};
const getReportVersions = async ({
    reportId,
    userId,
    role
}) => {

    const report = await prisma.report.findUnique({
        where: {
            id: reportId
        }
    });

    if (!report) {
        const error = new Error('Report not found');
        error.statusCode = 404;
        throw error;
    }

    if (role === 'TEAM_MEMBER' && report.userId !== userId) {
        const error = new Error(
            'You are not allowed to view this report'
        );
        error.statusCode = 403;
        throw error;
    }

    const versions = await prisma.reportVersion.findMany({
        where: {
            reportId
        },
        orderBy: {
            versionNumber: 'asc'
        },
        include: {
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            tasks: {
                include: {
                    priority: true,
                    status: true
                }
            },
            achievements: true,
            blockers: true,
            hours: {
                include: {
                    taskType: true
                }
            },
            reviews: {
                include: {
                    reviewer: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    },
                    action: true
                },
                orderBy: {
                    createdAt: 'asc'
                }
            }
        }
    });

    return versions;
};
const getStatusByMember = async () => {

    const reports = await prisma.report.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true
                }
            },
            status: {
                select: {
                    code: true,
                    name: true
                }
            }
        }
    });

    const result = {};

    reports.forEach(report => {

        const memberName = report.user.name;

        if (!result[memberName]) {
            result[memberName] = {
                draft: 0,
                submitted: 0,
                correctionRequested: 0,
                approved: 0
            };
        }

        switch (report.status.code) {

            case 'DRAFT':
                result[memberName].draft++;
                break;

            case 'SUBMITTED':
                result[memberName].submitted++;
                break;

            case 'CORRECTION_REQUESTED':
                result[memberName].correctionRequested++;
                break;

            case 'APPROVED':
                result[memberName].approved++;
                break;
        }
    });

    return result;
};
const getWorkloadByProject = async () => {

    const reports = await prisma.report.findMany({
        include: {
            project: {
                select: {
                    id: true,
                    name: true
                }
            },
            currentVersion: {
                include: {
                    tasks: true
                }
            }
        }
    });

    const result = {};

    reports.forEach(report => {

        const projectName = report.project.name;

        if (!result[projectName]) {
            result[projectName] = {
                plannedHours: 0,
                spentHours: 0
            };
        }

        if (report.currentVersion) {

            report.currentVersion.tasks.forEach(task => {

                result[projectName].plannedHours +=
                    Number(task.plannedHours);

                result[projectName].spentHours +=
                    Number(task.spentHours);

            });
        }
    });

    return result;
};
const getTimeByTaskType = async () => {

    const hours = await prisma.reportHour.findMany({
        include: {
            taskType: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });

    const result = {};

    hours.forEach(hour => {

        const taskTypeName = hour.taskType.name;

        if (!result[taskTypeName]) {
            result[taskTypeName] = 0;
        }

        result[taskTypeName] += Number(hour.hours);
    });

    return result;
};
const getTaskTrend = async () => {

    const reports = await prisma.report.findMany({
        orderBy: {
            weekStart: 'asc'
        },
        include: {
            currentVersion: {
                include: {
                    tasks: {
                        include: {
                            status: true
                        }
                    }
                }
            }
        }
    });

    return reports.map(report => {

        const tasks = report.currentVersion?.tasks || [];

        const completedTasks = tasks.filter(
            task => task.status.code === 'COMPLETED'
        ).length;

        const plannedHours = tasks.reduce(
            (total, task) => total + Number(task.plannedHours),
            0
        );

        const spentHours = tasks.reduce(
            (total, task) => total + Number(task.spentHours),
            0
        );

        return {
            weekStart: report.weekStart,
            weekEnd: report.weekEnd,
            totalTasks: tasks.length,
            completedTasks,
            plannedHours,
            spentHours
        };
    });
};
const getOpenBlockers = async () => {

    const reports = await prisma.report.findMany({
        where: {
            status: {
                code: {
                    in: [
                        'SUBMITTED',
                        'CORRECTION_REQUESTED'
                    ]
                }
            }
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true
                }
            },
            project: {
                select: {
                    id: true,
                    name: true
                }
            },
            currentVersion: {
                include: {
                    blockers: true
                }
            }
        },
        orderBy: {
            updatedAt: 'desc'
        }
    });

    const result = [];

    reports.forEach(report => {

        const blockers = report.currentVersion?.blockers || [];

        blockers.forEach(blocker => {

            result.push({
                reportId: report.id,
                versionId: report.currentVersion.id,
                member: report.user.name,
                project: report.project.name,
                weekStart: report.weekStart,
                blocker: blocker.blocker,
                isKeyBlocker: blocker.isKeyBlocker
            });

        });
    });

    return result;
};
const getRecentActivity = async () => {

    const reviews = await prisma.reportReview.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        take: 20,
        include: {
            reviewer: {
                select: {
                    id: true,
                    name: true
                }
            },
            action: {
                select: {
                    code: true,
                    name: true
                }
            },
            report: {
                select: {
                    id: true,
                    user: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    project: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            },
            reportVersion: {
                select: {
                    id: true,
                    versionNumber: true,
                    submittedAt: true
                }
            }
        }
    });

    return reviews.map(review => ({
        reportId: review.report.id,
        versionId: review.reportVersion.id,
        versionNumber: review.reportVersion.versionNumber,
        member: review.report.user.name,
        project: review.report.project.name,
        action: review.action.code,
        actionName: review.action.name,
        reviewer: review.reviewer.name,
        comment: review.comment,
        createdAt: review.createdAt
    }));
};
module.exports = {
    createReport,
    getReports,
    getReportById,
    createReportVersion,
    createReportTask,
    createReportAchievement,
    createReportBlocker,
    createReportHours,
     updateReportTask,
    deleteReportTask,
     updateReportAchievement,
    deleteReportAchievement,
    updateReportBlocker,
    deleteReportBlocker,
      updateReportHour,
    deleteReportHour,
    submitReportVersion,
    requestReportCorrection,
    createCorrectionVersion,
    approveReport,
    getReportReviews,
    getDashboardSummary,
    getManagerReports,
    getReportVersions,
    getStatusByMember,
    getWorkloadByProject,
    getTimeByTaskType,
    getTaskTrend,
    getOpenBlockers,
    getRecentActivity,
    getManagerReportById
};