"use server";
import axios from "axios";

export async function getStatues() {
  try {
    const response = await axios.get(
      `https://gompa-tour-api.onrender.com/statue`,
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", error.response?.data || error.message);
      throw new Error(`Failed to fetch statues: ${error.message}`);
    }
    throw error;
  }
}

export async function getStatuesdetail(id: string) {
  try {
    const response = await axios.get(
      `https://gompa-tour-api.onrender.com/statue/${id}`,
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", error.response?.data || error.message);
      throw new Error(`Failed to fetch statues: ${error.message}`);
    }
    throw error;
  }
}
