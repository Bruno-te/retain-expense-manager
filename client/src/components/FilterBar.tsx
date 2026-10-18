import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  resetFilters,
  setAmountRange,
  setCategory,
  setDateRange,
  setPaymentMethod,
  setSearch,
  setSort,
} from "../store/filtersSlice";
import { useCategories } from "../hooks/useCategories";
import { formatPaymentMethod } from "../utils/format";
import {
  PAYMENT_METHODS,
  type PaymentMethod,
  type SortField,
  type SortOrder,
} from "../types";

const SORT_OPTIONS = [
  { value: "date:desc", label: "Newest first" },
  { value: "date:asc", label: "Oldest first" },
  { value: "amount:desc", label: "Highest amount" },
  { value: "amount:asc", label: "Lowest amount" },
];

const FilterBar = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);
  const { categories } = useCategories();

  const handleSort = (value: string) => {
    const [sortBy, order] = value.split(":") as [SortField, SortOrder];
    dispatch(setSort({ sortBy, order }));
  };

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <div className="row g-2">
          <div className="col-12 col-md-6 col-lg-4">
            <label htmlFor="f-search" className="form-label small mb-1">
              Search
            </label>
            <input
              id="f-search"
              type="search"
              className="form-control"
              placeholder="Title or notes"
              value={filters.search}
              onChange={(e) => dispatch(setSearch(e.target.value))}
            />
          </div>

          <div className="col-6 col-md-3 col-lg-2">
            <label htmlFor="f-category" className="form-label small mb-1">
              Category
            </label>
            <select
              id="f-category"
              className="form-select"
              value={filters.category}
              onChange={(e) => dispatch(setCategory(e.target.value))}
            >
              <option value="">All</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-6 col-md-3 col-lg-2">
            <label htmlFor="f-method" className="form-label small mb-1">
              Payment method
            </label>
            <select
              id="f-method"
              className="form-select"
              value={filters.paymentMethod}
              onChange={(e) =>
                dispatch(setPaymentMethod(e.target.value as PaymentMethod | ""))
              }
            >
              <option value="">All</option>
              {PAYMENT_METHODS.map((method) => (
                <option key={method} value={method}>
                  {formatPaymentMethod(method)}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <label htmlFor="f-sort" className="form-label small mb-1">
              Sort by
            </label>
            <select
              id="f-sort"
              className="form-select"
              value={`${filters.sortBy}:${filters.order}`}
              onChange={(e) => handleSort(e.target.value)}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-6 col-md-3 col-lg-2">
            <label htmlFor="f-from" className="form-label small mb-1">
              From date
            </label>
            <input
              id="f-from"
              type="date"
              className="form-control"
              value={filters.startDate}
              onChange={(e) =>
                dispatch(
                  setDateRange({
                    startDate: e.target.value,
                    endDate: filters.endDate,
                  })
                )
              }
            />
          </div>

          <div className="col-6 col-md-3 col-lg-2">
            <label htmlFor="f-to" className="form-label small mb-1">
              To date
            </label>
            <input
              id="f-to"
              type="date"
              className="form-control"
              value={filters.endDate}
              onChange={(e) =>
                dispatch(
                  setDateRange({
                    startDate: filters.startDate,
                    endDate: e.target.value,
                  })
                )
              }
            />
          </div>

          <div className="col-6 col-md-3 col-lg-2">
            <label htmlFor="f-min" className="form-label small mb-1">
              Min amount
            </label>
            <input
              id="f-min"
              type="number"
              min="0"
              step="0.01"
              className="form-control"
              value={filters.minAmount}
              onChange={(e) =>
                dispatch(
                  setAmountRange({
                    minAmount: e.target.value,
                    maxAmount: filters.maxAmount,
                  })
                )
              }
            />
          </div>

          <div className="col-6 col-md-3 col-lg-2">
            <label htmlFor="f-max" className="form-label small mb-1">
              Max amount
            </label>
            <input
              id="f-max"
              type="number"
              min="0"
              step="0.01"
              className="form-control"
              value={filters.maxAmount}
              onChange={(e) =>
                dispatch(
                  setAmountRange({
                    minAmount: filters.minAmount,
                    maxAmount: e.target.value,
                  })
                )
              }
            />
          </div>

          <div className="col-12 col-lg-2 d-flex align-items-end">
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={() => dispatch(resetFilters())}
            >
              Clear filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
