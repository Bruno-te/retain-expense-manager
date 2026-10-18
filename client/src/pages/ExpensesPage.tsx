import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchExpenses } from "../store/expensesSlice";
import FilterBar from "../components/FilterBar";
import ExpenseTable from "../components/ExpenseTable";
import Pagination from "../components/Pagination";

const SEARCH_DEBOUNCE_MS = 300;

const ExpensesPage = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);

  // Whenever any filter, sort or page changes, refetch. The short delay means
  // typing in the search box sends one request when the user pauses, not one
  // per keystroke, and the cleanup cancels the timer if another change arrives.
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchExpenses());
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [dispatch, filters]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Expenses</h1>
        <Link to="/expenses/new" className="btn btn-primary">
          Add expense
        </Link>
      </div>
      <FilterBar />
      <ExpenseTable />
      <Pagination />
    </>
  );
};

export default ExpensesPage;
