import axios from "axios";

export async function postfestival(data: any) {
  try {
    const response = await axios.post(
      `https://gompa-tour-api.onrender.com/festival`,
      data,
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", error.response?.data || error.message);
      throw new Error(`Failed to fetch statues: ${error.message}`);
    }
    throw error;
  }
}
