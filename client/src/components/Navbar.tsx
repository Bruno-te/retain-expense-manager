import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `nav-link${isActive ? " active" : ""}`;

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const close = () => setOpen(false);

  const handleLogout = () => {
    logout();
    close();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/" onClick={close}>
          Retain
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="main-nav"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse${open ? " show" : ""}`}
          id="main-nav"
        >
          <ul className="navbar-nav me-auto">
            {isAuthenticated && (
              <li className="nav-item">
                <NavLink className={linkClass} to="/" end onClick={close}>
                  Dashboard
                </NavLink>
              </li>
            )}
            {isAdmin && (
              <li className="nav-item">
                <NavLink className={linkClass} to="/admin" onClick={close}>
                  Admin
                </NavLink>
              </li>
            )}
          </ul>

          <ul className="navbar-nav ms-auto align-items-md-center">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <span className="navbar-text me-md-3">{user?.name}</span>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-light btn-sm"
                    onClick={handleLogout}
                  >
                    Log out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className={linkClass} to="/login" onClick={close}>
                    Log in
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={linkClass} to="/register" onClick={close}>
                    Sign up
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
