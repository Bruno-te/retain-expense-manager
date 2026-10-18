import Category from "../models/Category.js";

export const listCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ categories });
  } catch (error) {
    console.error("List categories error:", error.message);
    res.status(500).json({ message: "Could not load categories" });
  }
};
