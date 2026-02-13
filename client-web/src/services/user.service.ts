import type { SignUpParams } from "@/pages/Signup";
import { GET, POST } from "@/utils/api";
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

const signup = async (formData: SignUpParams) => {
  const response = await POST<{
    email: string;
  }>("/user/signup", {
    name : formData.name,
    email : formData.email,
    password : formData.password,
    state : formData.state,
    profession : formData.profession,
    age : formData.age,
  });
  return response
}


const verifyUser = async (email: string, otp: string) => {
  const response = await POST("/user/verify", {
    email,
    otp,
  });
  return response
}



export { fetchUserByEmail, fetchUserById, signup, verifyUser };
