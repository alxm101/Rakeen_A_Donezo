import axios from "axios";
import supabase from "./lib/supabase";

const getAxiosClient = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;

  const instance = axios.create({
    baseURL: "http://localhost:8080",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

 
  instance.interceptors.response.use(
    (res) => res,
    async (err) => {
      if (err?.response?.status === 401) {
        await supabase.auth.signOut();
        window.location.href = "/login";
      }
      return Promise.reject(err);
    }
  );

  return instance;
};

export default getAxiosClient;
