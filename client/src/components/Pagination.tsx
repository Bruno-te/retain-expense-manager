import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setPage } from "../store/filtersSlice";

const WINDOW = 2;

const Pagination = () => {
  const dispatch = useAppDispatch();
  const { page, limit } = useAppSelector((state) => state.filters);
  const { total, totalPages } = useAppSelector((state) => state.expenses);

  if (total === 0) return null;

  const first = Math.max(1, page - WINDOW);
  const last = Math.min(totalPages, page + WINDOW);
  const pages: number[] = [];
  for (let n = first; n <= last; n++) pages.push(n);

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 mt-3">
      <span className="text-muted small">
        Showing {start}-{end} of {total}
      </span>
      <nav aria-label="Expense pages">
        <ul className="pagination mb-0">
          <li className={`page-item${page === 1 ? " disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => dispatch(setPage(page - 1))}
            >
              Previous
            </button>
          </li>
          {pages.map((n) => (
            <li key={n} className={`page-item${n === page ? " active" : ""}`}>
              <button className="page-link" onClick={() => dispatch(setPage(n))}>
                {n}
              </button>
            </li>
          ))}
          <li className={`page-item${page >= totalPages ? " disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => dispatch(setPage(page + 1))}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
