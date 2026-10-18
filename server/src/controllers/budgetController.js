import Budget from "../models/Budget.js";
import { MONTH_PATTERN, currentMonth } from "../utils/month.js";

export const getBudget = async (req, res) => {
  try {
    const month = req.query.month || currentMonth();
    if (!MONTH_PATTERN.test(month)) {
      return res.status(400).json({ message: "Month must be in YYYY-MM format" });
    }
    const budget = await Budget.findOne({ user: req.user._id, month });
    res.json({ month, limit: budget ? budget.limit : null });
  } catch (error) {
    console.error("Get budget error:", error.message);
    res.status(500).json({ message: "Could not load budget" });
  }
};

export const setBudget = async (req, res) => {
  try {
    const { month, limit } = req.body;
    if (!MONTH_PATTERN.test(month || "")) {
      return res.status(400).json({ message: "Month must be in YYYY-MM format" });
    }
    if (limit === undefined || Number.isNaN(Number(limit)) || Number(limit) < 0) {
      return res.status(400).json({ message: "Limit must be 0 or greater" });
    }

    const budget = await Budget.findOneAndUpdate(
      { user: req.user._id, month },
      { limit: Number(limit) },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    res.json({ month: budget.month, limit: budget.limit });
  } catch (error) {
    console.error("Set budget error:", error.message);
    res.status(500).json({ message: "Could not save budget" });
  }
};
