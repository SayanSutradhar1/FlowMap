import type { UserType } from "@/utils/types";
import { createContext, useContext } from "react";

interface UserContextType {
  user: UserType | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType | null>(null);

function useUserContext() {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}

export { UserContext, useUserContext };
