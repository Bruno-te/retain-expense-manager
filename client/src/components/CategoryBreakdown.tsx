import { formatAmount } from "../utils/format";
import type { CategorySpending } from "../types";

interface CategoryBreakdownProps {
  categories: CategorySpending[];
  totalSpent: number;
}

const CategoryBreakdown = ({ categories, totalSpent }: CategoryBreakdownProps) => (
  <div className="card shadow-sm h-100">
    <div className="card-body">
      <h2 className="h5 mb-3">Spending by category</h2>
      {categories.length === 0 ? (
        <p className="text-muted mb-0">No spending recorded this month.</p>
      ) : (
        categories.map((category) => {
          const percent =
            totalSpent > 0 ? Math.round((category.total / totalSpent) * 100) : 0;
          return (
            <div key={category.categoryId} className="mb-3">
              <div className="d-flex justify-content-between small mb-1">
                <span>
                  {category.name}{" "}
                  <span className="text-muted">
                    ({category.count} {category.count === 1 ? "expense" : "expenses"})
                  </span>
                </span>
                <span className="fw-semibold">{formatAmount(category.total)}</span>
              </div>
              <div
                className="progress"
                role="progressbar"
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${category.name} share of spending`}
              >
                <div className="progress-bar" style={{ width: `${percent}%` }}>
                  {percent >= 10 ? `${percent}%` : ""}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  </div>
);

export default CategoryBreakdown;
