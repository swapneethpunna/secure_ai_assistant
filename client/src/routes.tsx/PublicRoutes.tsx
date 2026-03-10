import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const token = localStorage.getItem("token");

  // If logged in, redirect away from public pages to home
  return token ? <Navigate to="/home" replace /> : <Outlet />;
};

export default PublicRoute;