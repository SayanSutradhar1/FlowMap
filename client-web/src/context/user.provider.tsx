import { fetchUserByCookies } from "@/services/auth.service";
import type { UserType } from "@/utils/types";
import { useCallback, useEffect, useState } from "react";
import { UserContext } from "./user.context";

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const user = (await fetchUserByCookies()) as unknown as UserType | null;

      if (user) {
        setUser(user);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <UserContext.Provider value={{ user, loading }}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
