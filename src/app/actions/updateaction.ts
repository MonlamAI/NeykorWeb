import axios from "axios"

export async function updateUser(email: string, userData:any) {
    try {
      const response = await axios.put(
        `https://gompa-tour-api.onrender.com/user/${email}`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      return { success: true, data: response.data }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data || error.message)
        throw new Error(`Failed to update user: ${error.message}`)
      }
      throw error
    }
  }