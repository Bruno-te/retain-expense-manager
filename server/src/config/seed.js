import Category from "../models/Category.js";

const DEFAULT_CATEGORIES = ["Food", "Transport", "Housing", "Entertainment", "Health"];

export const seedCategories = async () => {
  const existing = await Category.findOne({ isDefault: true });
  if (!existing) {
    await Category.create({ name: "Uncategorized", isDefault: true });
    console.log("Seeded default category: Uncategorized");
  }

  for (const name of DEFAULT_CATEGORIES) {
    await Category.updateOne({ name }, { $setOnInsert: { name } }, { upsert: true });
  }
};
