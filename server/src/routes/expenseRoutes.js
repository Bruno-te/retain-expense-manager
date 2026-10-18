import { Router } from "express";
import {
  listExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/", listExpenses);
router.post("/", createExpense);
router.get("/:id", getExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;
