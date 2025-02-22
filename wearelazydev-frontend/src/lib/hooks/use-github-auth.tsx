import { useState, useEffect } from "react";
import { UseGithubAuthReturn } from "@/utils/types";
import { toast } from "sonner";

const CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;

export const useGithubAuth = (onLogout?: () => void): UseGithubAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const codeParam = localStorage.getItem("code");
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      setIsAuthenticated(true);
    }

    if (codeParam && !accessToken) {
      const getAccessToken = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_ZK_BACKEND_GET_ACCESS_TOKEN}?code=${codeParam}`,
            {
              method: "GET",
            }
          );
          const data = await response.json();

          if (data.access_token) {
            localStorage.setItem("accessToken", data.access_token);
            setIsAuthenticated(true);

            window.history.replaceState(
              {},
              document.title,
              window.location.pathname
            );
          }
        } catch (error) {
          console.error("Error getting access token:", error);
        }
      };

      getAccessToken();
    }
  }, []);

  const loginWithGithub = () => {
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`
    );
    toast.success("Login GitHub Successfully");
    
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);
    onLogout?.();
    toast.success("Logout GitHub Successfully");
  };

  return {
    isAuthenticated,
    loginWithGithub,
    logout,
  };
};
