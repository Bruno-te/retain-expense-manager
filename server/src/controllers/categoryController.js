import mongoose from "mongoose";
import Category from "../models/Category.js";
import Expense from "../models/Expense.js";

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const nameExists = (name, excludeId) =>
  Category.exists({
    name: new RegExp(`^${escapeRegex(name)}$`, "i"),
    ...(excludeId && { _id: { $ne: excludeId } }),
  });

const validateName = (name) => {
  if (!name || !name.trim()) return "Category name is required";
  if (name.trim().length > 40) return "Category name must be 40 characters or less";
  return null;
};

export const listCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ categories });
  } catch (error) {
    console.error("List categories error:", error.message);
    res.status(500).json({ message: "Could not load categories" });
  }
};

export const createCategory = async (req, res) => {
  try {
    const problem = validateName(req.body.name);
    if (problem) return res.status(400).json({ message: problem });

    const name = req.body.name.trim();
    if (await nameExists(name)) {
      return res.status(409).json({ message: "A category with that name already exists" });
    }

    const category = await Category.create({ name });
    res.status(201).json({ category });
  } catch (error) {
    console.error("Create category error:", error.message);
    res.status(500).json({ message: "Could not create category" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Category not found" });
    }
    const problem = validateName(req.body.name);
    if (problem) return res.status(400).json({ message: problem });

    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    if (category.isDefault) {
      return res.status(400).json({ message: "The default category cannot be renamed" });
    }

    const name = req.body.name.trim();
    if (await nameExists(name, category._id)) {
      return res.status(409).json({ message: "A category with that name already exists" });
    }

    category.name = name;
    await category.save();
    res.json({ category });
  } catch (error) {
    console.error("Update category error:", error.message);
    res.status(500).json({ message: "Could not update category" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Category not found" });
    }

    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    if (category.isDefault) {
      return res.status(400).json({ message: "The default category cannot be deleted" });
    }

    const fallback = await Category.findOne({ isDefault: true });
    if (!fallback) {
      return res.status(500).json({ message: "Default category is missing" });
    }

    // Reassign first, delete second: a failure midway never leaves orphaned expenses
    const moved = await Expense.updateMany(
      { category: category._id },
      { category: fallback._id }
    );
    await category.deleteOne();

    res.json({
      message: "Category deleted",
      reassignedExpenses: moved.modifiedCount,
    });
  } catch (error) {
    console.error("Delete category error:", error.message);
    res.status(500).json({ message: "Could not delete category" });
  }
};
