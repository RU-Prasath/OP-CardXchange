import AuditLog from "../models/AuditLog.js";

/**
 * @desc    Get current user's audit logs
 * @route   GET /api/audit
 * @access  Private
 * @query   ?limit=50&page=1&action=FILE_DOWNLOAD
 */
export const getMyAuditLogs = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { user: req.user._id };
    if (req.query.action) {
      filter.action = req.query.action;
    }

    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: logs.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      logs,
    });
  } catch (error) {
    console.error("❌ GetAuditLogs Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get audit log statistics for the current user
 * @route   GET /api/audit/stats
 * @access  Private
 */
export const getAuditStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const [actionCounts, totalActions, recentActivity] = await Promise.all([
      AuditLog.aggregate([
        { $match: { user: userId } },
        { $group: { _id: "$action", count: { $sum: 1 } } },
      ]),
      AuditLog.countDocuments({ user: userId }),
      AuditLog.countDocuments({
        user: userId,
        createdAt: { $gte: last30Days },
      }),
    ]);

    const actionMap = actionCounts.reduce((acc, { _id, count }) => {
      acc[_id] = count;
      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      stats: {
        total: totalActions,
        last30Days: recentActivity,
        byAction: actionMap,
      },
    });
  } catch (error) {
    console.error("❌ GetAuditStats Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};