import Budget from "../models/Budget.js";
import Expense from "../models/Expense.js";
import { MONTH_PATTERN, currentMonth, monthRange } from "../utils/month.js";

const APPROACHING_THRESHOLD = 0.8;

const round2 = (value) => Math.round(value * 100) / 100;

const getBudgetStatus = (spent, limit) => {
  if (limit === null) return "no_budget";
  if (spent > limit) return "over";
  if (limit > 0 && spent >= limit * APPROACHING_THRESHOLD) return "approaching";
  return "within";
};

export const getDashboard = async (req, res) => {
  try {
    const month = req.query.month || currentMonth();
    if (!MONTH_PATTERN.test(month)) {
      return res.status(400).json({ message: "Month must be in YYYY-MM format" });
    }

    const { start, end } = monthRange(month);
    const match = { user: req.user._id, date: { $gte: start, $lt: end } };

    const [budget, totals, highest, byCategory, recent] = await Promise.all([
      Budget.findOne({ user: req.user._id, month }),
      Expense.aggregate([
        { $match: match },
        { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
      ]),
      Expense.findOne(match).sort({ amount: -1 }).populate("category", "name"),
      Expense.aggregate([
        { $match: match },
        {
          $group: {
            _id: "$category",
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: "$category" },
        {
          $project: {
            _id: 0,
            categoryId: "$_id",
            name: "$category.name",
            total: 1,
            count: 1,
          },
        },
        { $sort: { total: -1 } },
      ]),
      Expense.find(match)
        .sort({ date: -1, _id: -1 })
        .limit(5)
        .populate("category", "name"),
    ]);

    const spent = round2(totals[0]?.total || 0);
    const limit = budget ? budget.limit : null;

    res.json({
      month,
      totalSpent: spent,
      expenseCount: totals[0]?.count || 0,
      budget: limit,
      remaining: limit === null ? null : round2(limit - spent),
      status: getBudgetStatus(spent, limit),
      highestExpense: highest,
      spendingByCategory: byCategory.map((c) => ({ ...c, total: round2(c.total) })),
      recentExpenses: recent,
    });
  } catch (error) {
    console.error("Dashboard error:", error.message);
    res.status(500).json({ message: "Could not load dashboard" });
  }
};
