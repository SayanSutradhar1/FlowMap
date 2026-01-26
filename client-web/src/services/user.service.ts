import { GET } from "@/utils/api";
import type { UserType } from "@/utils/types";
import { toast } from "sonner";

const fetchUserByEmail = async (email: string) => {
  if (!email) {
    toast.error("Email is required");
    return null;
  }

  // Validate email format

  try {
    const response = await GET<UserType>(`/user/get/${email}`);

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

const fetchUserById = async (id: string) => {
  try {
    const response = await GET<UserType>(`/user/get/${id}`);

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



export { fetchUserByEmail, fetchUserById };
