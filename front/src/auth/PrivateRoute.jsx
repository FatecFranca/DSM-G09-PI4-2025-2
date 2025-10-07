import { Navigate, useLocation } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const isLogged = !!localStorage.getItem("ouviot_user");
  const location = useLocation();

  if (!isLogged) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
