import { useState } from "react";
import { useCategories } from "../hooks/useCategories";
import {
  createCategoryRequest,
  deleteCategoryRequest,
  updateCategoryRequest,
} from "../api/categoryApi";
import { ApiError } from "../api/client";
import ConfirmDialog from "./ConfirmDialog";
import type { Category } from "../types";

const CategoryManager = () => {
  const { categories, error: loadError, reload } = useCategories();

  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [pending, setPending] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [notice, setNotice] = useState<string | null>(null);

  const messageFrom = (err: unknown, fallback: string) =>
    err instanceof ApiError ? err.message : fallback;

  const handleCreate = async () => {
    if (!newName.trim()) {
      setCreateError("Category name is required");
      return;
    }
    setCreating(true);
    setCreateError(null);
    try {
      await createCategoryRequest(newName.trim());
      setNewName("");
      setNotice(`Category "${newName.trim()}" created.`);
      reload();
    } catch (err) {
      setCreateError(messageFrom(err, "Could not create category"));
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category._id);
    setEditName(category.name);
    setEditError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditError(null);
  };

  const handleSave = async () => {
    if (!editingId) return;
    if (!editName.trim()) {
      setEditError("Category name is required");
      return;
    }
    setSaving(true);
    setEditError(null);
    try {
      await updateCategoryRequest(editingId, editName.trim());
      setEditingId(null);
      setNotice("Category renamed.");
      reload();
    } catch (err) {
      setEditError(messageFrom(err, "Could not rename category"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!pending) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const result = await deleteCategoryRequest(pending._id);
      const moved = result.reassignedExpenses;
      setNotice(
        `Category "${pending.name}" deleted. ${moved} ${
          moved === 1 ? "expense was" : "expenses were"
        } moved to Uncategorized.`
      );
      setPending(null);
      reload();
    } catch (err) {
      setDeleteError(messageFrom(err, "Could not delete category"));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {notice && (
        <div className="alert alert-success d-flex justify-content-between align-items-center">
          <span>{notice}</span>
          <button
            type="button"
            className="btn-close"
            aria-label="Dismiss"
            onClick={() => setNotice(null)}
          ></button>
        </div>
      )}
      {loadError && <div className="alert alert-danger">{loadError}</div>}

      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <h2 className="h5 mb-3">Add a category</h2>
          {createError && (
            <div className="alert alert-danger py-2" role="alert">
              {createError}
            </div>
          )}
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Category name"
              aria-label="New category name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
              }}
            />
            <button
              className="btn btn-primary"
              onClick={handleCreate}
              disabled={creating}
            >
              {creating ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>
                  <td>
                    {editingId === category._id ? (
                      <>
                        <input
                          type="text"
                          className="form-control"
                          aria-label="Category name"
                          value={editName}
                          autoFocus
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSave();
                            if (e.key === "Escape") cancelEdit();
                          }}
                        />
                        {editError && (
                          <div className="small text-danger mt-1">{editError}</div>
                        )}
                      </>
                    ) : (
                      <>
                        {category.name}
                        {category.isDefault && (
                          <span className="badge text-bg-info ms-2">Default</span>
                        )}
                      </>
                    )}
                  </td>
                  <td className="text-end text-nowrap">
                    {category.isDefault ? (
                      <span className="small text-muted">Protected</span>
                    ) : editingId === category._id ? (
                      <>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={handleSave}
                          disabled={saving}
                        >
                          {saving ? "Saving..." : "Save"}
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={cancelEdit}
                          disabled={saving}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => startEdit(category)}
                        >
                          Rename
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => {
                            setPending(category);
                            setDeleteError(null);
                          }}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pending && (
        <ConfirmDialog
          title="Delete category"
          message={`Delete "${pending.name}"? Any expenses in it will be moved to "Uncategorized".`}
          confirmLabel="Delete"
          busy={deleting}
          error={deleteError}
          onConfirm={handleDelete}
          onCancel={() => setPending(null)}
        />
      )}
    </>
  );
};

export default CategoryManager;
