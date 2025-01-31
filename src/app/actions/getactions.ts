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

export async function getfestival() {
  try {
    const response = await axios.get(
      `https://gompa-tour-api.onrender.com/festival`,
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

export async function getfestivaldetail(id: string) {
  try {
    const response = await axios.get(
      `https://gompa-tour-api.onrender.com/festival/${id}`,
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

export async function getgonpa() {
  try {
    const response = await axios.get(
      `https://gompa-tour-api.onrender.com/gonpa`,
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
export async function getgonpadetail(id: string) {
  try {
    const response = await axios.get(
      `https://gompa-tour-api.onrender.com/gonpa/${id}`,
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

export async function getsite() {
  try {
    const response = await axios.get(
      `https://gompa-tour-api.onrender.com/pilgrim`,
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

export async function getsitedetail(id: string) {
  try {
    const response = await axios.get(
      `https://gompa-tour-api.onrender.com/pilgrim/${id}`,
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
