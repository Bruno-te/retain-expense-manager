import mongoose from "mongoose";
import Expense, { PAYMENT_METHODS } from "../models/Expense.js";
import Category from "../models/Category.js";

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const validateBody = async (body) => {
  const { title, amount, category, date, paymentMethod } = body;
  if (!title || !title.trim()) return "Title is required";
  if (amount === undefined || Number(amount) <= 0) {
    return "Amount must be greater than 0";
  }
  if (!mongoose.isValidObjectId(category)) return "A valid category is required";
  if (!(await Category.exists({ _id: category }))) return "Category not found";
  if (!PAYMENT_METHODS.includes(paymentMethod)) return "Invalid payment method";
  if (date && Number.isNaN(new Date(date).getTime())) return "Invalid date";
  return null;
};

export const listExpenses = async (req, res) => {
  try {
    const {
      search,
      category,
      paymentMethod,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      sortBy = "date",
      order = "desc",
    } = req.query;

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);

    const filter = { user: req.user._id };

    if (search) {
      const pattern = new RegExp(escapeRegex(search), "i");
      filter.$or = [{ title: pattern }, { notes: pattern }];
    }
    if (category && mongoose.isValidObjectId(category)) {
      filter.category = category;
    }
    if (paymentMethod && PAYMENT_METHODS.includes(paymentMethod)) {
      filter.paymentMethod = paymentMethod;
    }
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }
    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = Number(minAmount);
      if (maxAmount) filter.amount.$lte = Number(maxAmount);
    }

    const sortField = sortBy === "amount" ? "amount" : "date";
    const sortDirection = order === "asc" ? 1 : -1;

    const [expenses, total] = await Promise.all([
      Expense.find(filter)
        .populate("category", "name")
        .sort({ [sortField]: sortDirection, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Expense.countDocuments(filter),
    ]);

    res.json({
      expenses,
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1),
    });
  } catch (error) {
    console.error("List expenses error:", error.message);
    res.status(500).json({ message: "Could not load expenses" });
  }
};

export const getExpense = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Expense not found" });
    }
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("category", "name");
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json({ expense });
  } catch (error) {
    console.error("Get expense error:", error.message);
    res.status(500).json({ message: "Could not load expense" });
  }
};

export const createExpense = async (req, res) => {
  try {
    const problem = await validateBody(req.body);
    if (problem) return res.status(400).json({ message: problem });

    const { title, amount, category, date, paymentMethod, notes } = req.body;
    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount,
      category,
      date: date || Date.now(),
      paymentMethod,
      notes,
    });
    await expense.populate("category", "name");
    res.status(201).json({ expense });
  } catch (error) {
    console.error("Create expense error:", error.message);
    res.status(500).json({ message: "Could not create expense" });
  }
};

export const updateExpense = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Expense not found" });
    }
    const problem = await validateBody(req.body);
    if (problem) return res.status(400).json({ message: problem });

    const { title, amount, category, date, paymentMethod, notes } = req.body;
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, amount, category, date, paymentMethod, notes },
      { new: true, runValidators: true }
    ).populate("category", "name");

    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json({ expense });
  } catch (error) {
    console.error("Update expense error:", error.message);
    res.status(500).json({ message: "Could not update expense" });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Expense not found" });
    }
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Expense deleted" });
  } catch (error) {
    console.error("Delete expense error:", error.message);
    res.status(500).json({ message: "Could not delete expense" });
  }
};
