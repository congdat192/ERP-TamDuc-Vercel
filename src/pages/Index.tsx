import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Prevent multiple redirects
    if (hasRedirected.current) return;

    const handleRedirect = async () => {
      if (isAuthenticated && currentUser) {
        try {
          // Check employee type
          const { data: employee, error } = await supabase
            .from("employees")
            .select("is_employee_only")
            .eq("user_id", currentUser.id)
            .maybeSingle();

          if (error) throw error;

          hasRedirected.current = true;

          if (employee?.is_employee_only === true) {
            console.log("👤 [Index] Employee-only user, redirecting to /my-profile");
            navigate("/my-profile", { replace: true });
          } else {
            console.log("👨‍💼 [Index] Admin/User account, redirecting to /ERP/Dashboard");
            navigate("/ERP/Dashboard", { replace: true });
          }
        } catch (error) {
          console.error("❌ [Index] Error checking employee type:", error);
          hasRedirected.current = true;
          navigate("/ERP/Dashboard", { replace: true });
        }
      } else if (isAuthenticated === false) {
        // Only redirect to login if explicitly not authenticated
        hasRedirected.current = true;
        navigate("/login", { replace: true });
      }
    };

    handleRedirect();
  }, [navigate, currentUser, isAuthenticated]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Đang chuyển hướng...</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    </div>
  );
};

export default Index;
