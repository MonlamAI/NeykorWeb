"use server";
import axios, { AxiosError } from "axios";
import { auth } from "@/auth";
import { apiWriteHeaders, assertCmsAdmin } from "@/lib/cmsAuth";

interface Statue {
  id: string;
  image: string;
  translations: Array<{
    languageCode: string;
    name: string;
    description: string;
    description_audio: string;
  }>;
}

const API_BASE_URL = process.env.API_URL;
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    accept: "application/json",
    "Content-Type": "application/json",
  },
});

const handleApiError = (error: unknown, endpoint: string) => {
  if (error instanceof AxiosError) {
    console.error(`API Error (${endpoint}):`, error.response?.data || error.message);
    throw new Error(`Failed to fetch ${endpoint}: ${error.message}`);
  }
  throw error;
};

async function fetchData<T>(endpoint: string): Promise<T> {
  try {
    const response = await axiosInstance.get<T>(endpoint);
    return response.data;
  } catch (error) {
    handleApiError(error, endpoint);
    throw error;
  }
}

export const getStatues = () => fetchData<Statue[]>("/statue");

export const getStatuesDetail = (id: string) => fetchData<Statue>(`/statue/${id}`);

export const getFestival = () => fetchData("/festival");

export const getFestivalDetail = (id: string) => fetchData(`/festival/${id}`);

export const getGonpa = () => fetchData("/gonpa");

export const getGonpaDetail = (id: string) => fetchData(`/gonpa/${id}`);

export const getSite = () => fetchData("/pilgrim");

export const getSiteDetail = (id: string) => fetchData(`/pilgrim/${id}`);

export const getGonpaTypes = () => fetchData("/gonpa/types");

export async function getUser() {
  await assertCmsAdmin();
  try {
    const response = await axios.get(`${API_BASE_URL}/user`, {
      headers: apiWriteHeaders(),
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "users");
  }
}

export async function getRole(email: string) {
  const session = await auth();
  if (!session?.user?.email) {
    return;
  }
  const lookupEmail = session.user.email === email ? email : session.user.email;
  try {
    const response = await axios.get(
      `${API_BASE_URL}/user/${encodeURIComponent(lookupEmail)}`,
      { headers: apiWriteHeaders() }
    );
    return response.data.role;
  } catch (error) {
    handleApiError(error, `user role for ${lookupEmail}`);
  }
}
