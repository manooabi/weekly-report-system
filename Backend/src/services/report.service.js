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
    deleteReportHour
};