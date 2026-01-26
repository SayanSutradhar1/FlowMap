import { useUserContext } from "@/context/user.context";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ redirectTo = "/login" }: { redirectTo?: string }) => {
  const { user, loading } = useUserContext();

  console.log({ user, loading });

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  return user?.id ? <Outlet /> : <Navigate to={redirectTo} />;
};

export default ProtectedRoute;
