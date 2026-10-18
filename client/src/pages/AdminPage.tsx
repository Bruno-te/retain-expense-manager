import { useState } from "react";
import InsightsPanel from "../components/InsightsPanel";
import CategoryManager from "../components/CategoryManager";

type Tab = "insights" | "categories";

const AdminPage = () => {
  const [tab, setTab] = useState<Tab>("insights");

  const tabClass = (name: Tab) => `nav-link${tab === name ? " active" : ""}`;

  return (
    <>
      <h1 className="h3 mb-3">Admin dashboard</h1>

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={tabClass("insights")} onClick={() => setTab("insights")}>
            Platform insights
          </button>
        </li>
        <li className="nav-item">
          <button
            className={tabClass("categories")}
            onClick={() => setTab("categories")}
          >
            Categories
          </button>
        </li>
      </ul>

      {/* Each panel mounts only while its tab is open, so switching back to
          Platform insights always refetches fresh numbers. */}
      {tab === "insights" ? <InsightsPanel /> : <CategoryManager />}
    </>
  );
};

export default AdminPage;
