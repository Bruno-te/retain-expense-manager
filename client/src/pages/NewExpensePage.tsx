import { useNavigate } from "react-router-dom";
import ExpenseForm from "../components/ExpenseForm";
import { createExpenseRequest } from "../api/expenseApi";
import type { ExpenseInput } from "../types";

const NewExpensePage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (input: ExpenseInput) => {
    await createExpenseRequest(input);
    navigate("/expenses");
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-8">
        <h1 className="h3 mb-3">Add expense</h1>
        <div className="card shadow-sm">
          <div className="card-body">
            <ExpenseForm submitLabel="Add expense" onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewExpensePage;
