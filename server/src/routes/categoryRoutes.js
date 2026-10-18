import { Router } from "express";
import { listCategories } from "../controllers/categoryController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/", protect, listCategories);

export default router;
