import { GET, POST } from "@/utils/api";
import type { UserType } from "@/utils/types";
import { toast } from "sonner";

const credentialLogin = async (email: string, password: string) => {
  if (!email || !password) {
    toast.error("Email and password are required");
    return null;
  }

  try {
    const response = await POST("/auth/signin", {
      email,
      password,
    });

    if (!response.success) {
      toast.error(response.error || response.message || "Something went wrong");
      return null;
    }

    return response;
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
    return null;
  }
};

const fetchUserByCookies = async () => {
  try {
    const response = await GET<UserType>(`/auth/get`);

    if (!response.success) {
      toast.error(response.error || response.message || "Something went wrong");
      return null;
    }

    return response.data;
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
    return null;
  }
};

const signout = async () => {
  try {
    const response = await POST("/auth/signout", null);

    if (response.success) {
      toast.success("User Signed out successfully....");
    } else {
      toast.error(response.message || "Something went wrong");
    }
  } catch (error) {
    console.log(error);
    toast.error((error as Error).message);
  }
};

export { credentialLogin, fetchUserByCookies, signout };
