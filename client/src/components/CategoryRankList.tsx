import type { CategorySpending } from "../types";

interface CategoryRankListProps {
  title: string;
  items: CategorySpending[];
}

const CategoryRankList = ({ title, items }: CategoryRankListProps) => (
  <div className="card shadow-sm h-100">
    <div className="card-body">
      <h2 className="h5 mb-3">{title}</h2>
      {items.length === 0 ? (
        <p className="text-muted mb-0">No categories yet.</p>
      ) : (
        <ol className="list-group list-group-numbered list-group-flush">
          {items.map((item) => (
            <li
              key={item.categoryId}
              className="list-group-item d-flex justify-content-between align-items-start px-0"
            >
              <div className="ms-2 me-auto">{item.name}</div>
              <span className="badge text-bg-secondary rounded-pill">
                {item.count} {item.count === 1 ? "expense" : "expenses"}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  </div>
);

export default CategoryRankList;
