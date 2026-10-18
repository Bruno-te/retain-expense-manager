import { useAdminInsights } from "../hooks/useAdminInsights";
import StatCard from "./StatCard";
import CategoryRankList from "./CategoryRankList";
import { formatAmount, formatDate } from "../utils/format";

const InsightsPanel = () => {
  const { data, error, loading, reload } = useAdminInsights();

  if (error) {
    return (
      <div className="alert alert-danger d-flex justify-content-between align-items-center">
        <span>{error}</span>
        <button className="btn btn-sm btn-outline-danger" onClick={reload}>
          Retry
        </button>
      </div>
    );
  }

  if (!data || loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="row g-3 mb-3">
        <div className="col-6 col-lg-3">
          <StatCard label="Registered users" value={String(data.totalUsers)} />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard label="Expenses recorded" value={String(data.totalExpenses)} />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard
            label="Total value"
            value={formatAmount(data.totalExpenseValue)}
          />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard
            label="Recorded this month"
            value={String(data.expensesThisMonth)}
            detail="By date added"
          />
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-12 col-lg-4">
          <CategoryRankList title="Top 5 most used" items={data.topCategories} />
        </div>
        <div className="col-12 col-lg-4">
          <CategoryRankList
            title="Bottom 5 least used"
            items={data.bottomCategories}
          />
        </div>
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h2 className="h5 mb-3">Spending per category</h2>
              <ul className="list-group list-group-flush">
                {data.spendingPerCategory.map((item) => (
                  <li
                    key={item.categoryId}
                    className="list-group-item px-0 d-flex justify-content-between"
                  >
                    <span>{item.name}</span>
                    <span className="fw-semibold">{formatAmount(item.total)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-xl-7">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h2 className="h5 mb-3">Recently added expenses</h2>
              {data.recentExpenses.length === 0 ? (
                <p className="text-muted mb-0">No expenses yet.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>User</th>
                        <th>Category</th>
                        <th className="text-end">Amount</th>
                        <th>Added</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentExpenses.map((expense) => (
                        <tr key={expense._id}>
                          <td>{expense.title}</td>
                          <td>{expense.user.name}</td>
                          <td>{expense.category.name}</td>
                          <td className="text-end">{formatAmount(expense.amount)}</td>
                          <td className="text-nowrap">{formatDate(expense.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-5">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h2 className="h5 mb-3">Recently registered users</h2>
              <div className="table-responsive">
                <table className="table table-sm align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentUsers.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span
                            className={`badge ${
                              user.role === "admin" ? "text-bg-primary" : "text-bg-light border"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="text-nowrap">{formatDate(user.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InsightsPanel;
