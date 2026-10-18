import { useAuth } from "../context/useAuth";

// Placeholder: the real dashboard is built in a later step
const DashboardPage = () => {
  const { user } = useAuth();
  return <h1 className="h3">Welcome, {user?.name}</h1>;
};

export default DashboardPage;
