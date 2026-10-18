import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => (
  <>
    <Navbar />
    <main className="container py-4">
      <Outlet />
    </main>
  </>
);

export default Layout;
