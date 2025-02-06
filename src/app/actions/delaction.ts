'use server'
import axios from "axios";

export async function deleteSacred(statueId: string) {
    try {
      const response = await axios.delete(
        `https://gompa-tour-api.onrender.com/statue/${statueId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data || error.message);
        throw new Error(`Failed to delete statue: ${error.message}`);
      }
      throw error;
    }
  }

  export async function deletepilgrim(statueId: string) {
    try {
      const response = await axios.delete(
        `https://gompa-tour-api.onrender.com/pilgrim/${statueId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data || error.message);
        throw new Error(`Failed to delete statue: ${error.message}`);
      }
      throw error;
    }
  }

  export async function deleteuser(email: string) {
    try {
      const response = await axios.delete(
        `https://gompa-tour-api.onrender.com/user/${email}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data || error.message);
        throw new Error(`Failed to delete statue: ${error.message}`);
      }
      throw error;
    }
  }