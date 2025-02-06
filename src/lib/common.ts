import axiosAuth from "@/lib/axiosInterceptors";

export const loadUser = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URI;

    try {
      await axiosAuth.post(`${baseUrl}/api/v1/user`);
    } catch (error) {
      console.error(error);
    }
};