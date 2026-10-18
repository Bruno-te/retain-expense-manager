import User from "../models/User.js";
import Expense from "../models/Expense.js";
import Category from "../models/Category.js";
import { currentMonth, monthRange } from "../utils/month.js";

const round2 = (value) => Math.round(value * 100) / 100;

export const getInsights = async (req, res) => {
  try {
    const { start, end } = monthRange(currentMonth());

    const [
      totalUsers,
      totalExpenses,
      valueResult,
      expensesThisMonth,
      categories,
      usage,
      recentExpenses,
      recentUsers,
    ] = await Promise.all([
      User.countDocuments(),
      Expense.countDocuments(),
      Expense.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
      Expense.countDocuments({ createdAt: { $gte: start, $lt: end } }),
      Category.find(),
      Expense.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
            total: { $sum: "$amount" },
          },
        },
      ]),
      Expense.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user", "name email")
        .populate("category", "name"),
      User.find().sort({ createdAt: -1 }).limit(5).select("name email role createdAt"),
    ]);

    // Merge usage into the full category list so unused categories show with 0
    const usageById = new Map(usage.map((u) => [String(u._id), u]));
    const stats = categories.map((c) => {
      const u = usageById.get(String(c._id));
      return {
        categoryId: c._id,
        name: c.name,
        count: u ? u.count : 0,
        total: round2(u ? u.total : 0),
      };
    });

    const byUsageDesc = [...stats].sort(
      (a, b) => b.count - a.count || a.name.localeCompare(b.name)
    );
    const byUsageAsc = [...stats].sort(
      (a, b) => a.count - b.count || a.name.localeCompare(b.name)
    );

    res.json({
      totalUsers,
      totalExpenses,
      totalExpenseValue: round2(valueResult[0]?.total || 0),
      expensesThisMonth,
      spendingPerCategory: [...stats].sort((a, b) => b.total - a.total),
      topCategories: byUsageDesc.slice(0, 5),
      bottomCategories: byUsageAsc.slice(0, 5),
      recentExpenses,
      recentUsers,
    });
  } catch (error) {
    console.error("Admin insights error:", error.message);
    res.status(500).json({ message: "Could not load insights" });
  }
};
