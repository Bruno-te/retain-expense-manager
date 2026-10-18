import { useEffect } from "react";
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
      <h1 className="h3 mb-3">Expenses</h1>
      <FilterBar />
      <ExpenseTable />
      <Pagination />
    </>
  );
};

export default ExpensesPage;
