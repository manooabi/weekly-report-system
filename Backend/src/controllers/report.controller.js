const reportService = require('../services/report.service');

const createReport = async (req, res, next) => {
    try {
        const report = await reportService.createReport({
            userId: req.user.userId,
            projectId: req.body.projectId,
            weekStart: req.body.weekStart,
            weekEnd: req.body.weekEnd
        });

        res.status(201).json({
            success: true,
            message: 'Report created successfully',
            data: report
        });
    } catch (error) {
        next(error);
    }
};
const getReports = async (req, res, next) => {
    try {
        const reports = await reportService.getReports(req.user.userId);

        res.json({
            success: true,
            data: reports
        });
    } catch (error) {
        next(error);
    }
};
const getReportById = async (req, res, next) => {
    try {
        const reportId = Number(req.params.id);

        const report = await reportService.getReportById(
            reportId,
            req.user.userId
        );

        res.json({
            success: true,
            data: report
        });
    } catch (error) {
        next(error);
    }
};
const createReportVersion = async (req, res, next) => {
    try {
        const version = await reportService.createReportVersion({
            reportId: Number(req.params.id),
            userId: req.user.userId,
            nextWeekPlan: req.body.nextWeekPlan,
            notes: req.body.notes,
            links: req.body.links
        });

        res.status(201).json({
            success: true,
            message: 'Report version created successfully',
            data: version
        });
    } catch (error) {
        next(error);
    }
};
const createReportTask = async (req, res, next) => {
    try {
        const task = await reportService.createReportTask({
            reportId: Number(req.params.reportId),
            versionId: Number(req.params.versionId),
            userId: req.user.userId,
            taskName: req.body.taskName,
            priorityId: req.body.priorityId,
            plannedPercentage: req.body.plannedPercentage,
            actualPercentage: req.body.actualPercentage,
            statusId: req.body.statusId,
            plannedHours: req.body.plannedHours,
            spentHours: req.body.spentHours,
            deliverable: req.body.deliverable
        });

        res.status(201).json({
            success: true,
            message: 'Report task created successfully',
            data: task
        });
    } catch (error) {
        next(error);
    }
};
const createReportAchievement = async (req, res, next) => {
    try {
        const achievement = await reportService.createReportAchievement({
            reportId: Number(req.params.reportId),
            versionId: Number(req.params.versionId),
            userId: req.user.userId,
            achievement: req.body.achievement,
            isKeyAchievement: req.body.isKeyAchievement
        });

        res.status(201).json({
            success: true,
            message: 'Report achievement created successfully',
            data: achievement
        });
    } catch (error) {
        next(error);
    }
};
const createReportBlocker = async (req, res, next) => {
    try {
        const blocker = await reportService.createReportBlocker({
            reportId: Number(req.params.reportId),
            versionId: Number(req.params.versionId),
            userId: req.user.userId,
            blocker: req.body.blocker,
            isKeyBlocker: req.body.isKeyBlocker
        });

        res.status(201).json({
            success: true,
            message: 'Report blocker created successfully',
            data: blocker
        });
    } catch (error) {
        next(error);
    }
};
const createReportHours = async (req, res, next) => {
    try {
        const reportHours = await reportService.createReportHours({
            reportId: Number(req.params.reportId),
            versionId: Number(req.params.versionId),
            userId: req.user.userId,
            taskTypeId: req.body.taskTypeId,
            hours: req.body.hours
        });

        res.status(201).json({
            success: true,
            message: 'Report hours created successfully',
            data: reportHours
        });
    } catch (error) {
        next(error);
    }
};
const updateReportTask = async (req, res, next) => {
    try {
        const task = await reportService.updateReportTask({
            taskId: Number(req.params.taskId),
            userId: req.user.userId,
            data: req.body
        });

        res.json({
            success: true,
            message: 'Report task updated successfully',
            data: task
        });
    } catch (error) {
        next(error);
    }
};

const deleteReportTask = async (req, res, next) => {
    try {
        await reportService.deleteReportTask({
            taskId: Number(req.params.taskId),
            userId: req.user.userId
        });

        res.json({
            success: true,
            message: 'Report task deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
const updateReportAchievement = async (req, res, next) => {
    try {
        const achievement = await reportService.updateReportAchievement({
            achievementId: Number(req.params.achievementId),
            userId: req.user.userId,
            data: req.body
        });

        res.json({
            success: true,
            message: 'Achievement updated successfully',
            data: achievement
        });
    } catch (error) {
        next(error);
    }
};


const deleteReportAchievement = async (req, res, next) => {
    try {
        await reportService.deleteReportAchievement({
            achievementId: Number(req.params.achievementId),
            userId: req.user.userId
        });

        res.json({
            success: true,
            message: 'Achievement deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
const updateReportBlocker = async (req, res, next) => {
    try {
        const blocker = await reportService.updateReportBlocker({
            blockerId: Number(req.params.blockerId),
            userId: req.user.userId,
            data: req.body
        });

        res.json({
            success: true,
            message: 'Blocker updated successfully',
            data: blocker
        });
    } catch (error) {
        next(error);
    }
};


const deleteReportBlocker = async (req, res, next) => {
    try {
        await reportService.deleteReportBlocker({
            blockerId: Number(req.params.blockerId),
            userId: req.user.userId
        });

        res.json({
            success: true,
            message: 'Blocker deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
const updateReportHour = async (req, res, next) => {
    try {
        const hour = await reportService.updateReportHour({
            hourId: Number(req.params.hourId),
            userId: req.user.userId,
            data: req.body
        });

        res.json({
            success: true,
            message: 'Report hours updated successfully',
            data: hour
        });
    } catch (error) {
        next(error);
    }
};


const deleteReportHour = async (req, res, next) => {
    try {
        await reportService.deleteReportHour({
            hourId: Number(req.params.hourId),
            userId: req.user.userId
        });

        res.json({
            success: true,
            message: 'Report hours deleted successfully'
        });
    } catch (error) {
        next(error);
    }
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