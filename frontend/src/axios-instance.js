import axios from "axios";
import supabase from "./client";

const getAxiosClient = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) throw new Error("No session found");

  const token = session.access_token;

  const instance = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return instance;
};

export default getAxiosClient;
