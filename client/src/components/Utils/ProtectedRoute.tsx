import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles: string[];
};

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || !role || !allowedRoles.includes(role)) {
      if (role === "admin") {
        router.push("/admin/login");
      } else {
        router.push("/login");
      }
    } else {
      setAuthorized(true);
    }
  }, [router, allowedRoles]);

  return authorized ? <>{children}</> : null;
};

export default ProtectedRoute;
