const express = require('express');

const authenticate = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

const reportController = require('../controllers/report.controller');

const { createReportSchema, createReportVersionSchema } = require('../validators/report.validator');
const {  createTaskSchema, updateTaskSchema } = require('../validators/task.validator');
const {  createAchievementSchema,updateAchievementSchema } = require('../validators/achievement.validator');
const {  createBlockerSchema,updateBlockerSchema } = require('../validators/blocker.validator');
const {  createReportHoursSchema,updateHourSchema } = require('../validators/hours.validator');
const { requestCorrectionSchema } = require('../validators/review.validator');
const requireRole = require('../middleware/role.middleware');

const router = express.Router();

router.post(
    '/',
    authenticate,
    validate(createReportSchema),
    reportController.createReport
);
router.get(
    '/',
    authenticate,
    reportController.getReports
);
//Get one own report
router.get( 
    '/:id', 
    authenticate, 
    reportController.getReportById );

    router.post(
    '/:id/versions',
    authenticate,
    validate(createReportVersionSchema),
    reportController.createReportVersion
);
router.post(
    '/:reportId/versions/:versionId/tasks',
    authenticate,
    validate(createTaskSchema),
    reportController.createReportTask
);
router.post(
    '/:reportId/versions/:versionId/achievements',
    authenticate,
    validate(createAchievementSchema),
    reportController.createReportAchievement
);
router.post(
    '/:reportId/versions/:versionId/blockers',
    authenticate,
    validate(createBlockerSchema),
    reportController.createReportBlocker
);
router.post(
    '/:reportId/versions/:versionId/hours',
    authenticate,
    validate(createReportHoursSchema),
    reportController.createReportHours
);
router.patch(
    '/:reportId/versions/:versionId/tasks/:taskId',
    authenticate,
    validate(updateTaskSchema),
    reportController.updateReportTask
);

router.delete(
    '/:reportId/versions/:versionId/tasks/:taskId',
    authenticate,
    reportController.deleteReportTask
);
router.patch(
    '/:reportId/versions/:versionId/achievements/:achievementId',
    authenticate,
    validate(updateAchievementSchema),
    reportController.updateReportAchievement
);

router.delete(
    '/:reportId/versions/:versionId/achievements/:achievementId',
    authenticate,
    reportController.deleteReportAchievement
);
router.patch(
    '/:reportId/versions/:versionId/blockers/:blockerId',
    authenticate,
    validate(updateBlockerSchema),
    reportController.updateReportBlocker
);

router.delete(
    '/:reportId/versions/:versionId/blockers/:blockerId',
    authenticate,
    reportController.deleteReportBlocker
);
router.patch(
    '/:reportId/versions/:versionId/hours/:hourId',
    authenticate,
    validate(updateHourSchema),
    reportController.updateReportHour
);

router.delete(
    '/:reportId/versions/:versionId/hours/:hourId',
    authenticate,
    reportController.deleteReportHour
);
router.post(
    '/:reportId/versions/:versionId/submit',
    authenticate,
    reportController.submitReportVersion
);
router.post(
    '/:reportId/versions/:versionId/request-correction',
    authenticate,
    requireRole('MANAGER', 'ADMIN'),
    validate(requestCorrectionSchema),
    reportController.requestReportCorrection
);
router.post(
    '/:reportId/correction-version',
    authenticate,
    reportController.createCorrectionVersion
);
router.post(
    '/:reportId/versions/:versionId/approve',
    authenticate,
    requireRole('MANAGER', 'ADMIN'),
    reportController.approveReport
);
router.get(
    '/:reportId/reviews',
    authenticate,
    reportController.getReportReviews
);
module.exports = router;