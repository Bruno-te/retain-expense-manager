import { Router } from "express";
import { getBudget, setBudget } from "../controllers/budgetController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/", getBudget);
router.put("/", setBudget);

export default router;
