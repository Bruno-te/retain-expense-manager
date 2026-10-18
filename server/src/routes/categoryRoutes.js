import { Router } from "express";
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/", listCategories);
router.post("/", adminOnly, createCategory);
router.put("/:id", adminOnly, updateCategory);
router.delete("/:id", adminOnly, deleteCategory);

export default router;
