import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="text-center py-5">
    <h1 className="h3">Page not found</h1>
    <Link to="/">Back to the dashboard</Link>
  </div>
);

export default NotFoundPage;
