"use server"
import axios from "axios"
import { apiWriteHeaders, assertCmsAdmin } from "@/lib/cmsAuth"

const url=process.env.API_URL;

function throwApiError(error: unknown, fallback: string): never {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail)
          ? detail
              .map((item: { msg?: string }) => item?.msg || JSON.stringify(item))
              .join("; ")
          : error.message;
    throw new Error(message || fallback);
  }
  throw error;
}

export async function updateUser(email: string, userData:any) {
    try {
      await assertCmsAdmin();
      const response = await axios.put(
        url+`/user/${email}`,
        userData,
        { headers: apiWriteHeaders() }
      )
      return { success: true, data: response.data }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data || error.message)
        throwApiError(error, "Failed to update")
      }
      throw error
    }
  }

  export async function updatestatue(statueid: string, data:any) {
    try {
      await assertCmsAdmin();
      const response = await axios.put(
        url+`/statue/${statueid}`,
        data,
        { headers: apiWriteHeaders() }
      )
      return { success: true, data: response.data }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data || error.message)
        throwApiError(error, "Failed to update")
      }
      throw error
    }
  }

  export async function updateFestival(fesid: string, data:any) {
    try {
      await assertCmsAdmin();
      const response = await axios.put(
        url+`/festival/${fesid}`,
        data,
        { headers: apiWriteHeaders() }
      )
      return { success: true, data: response.data }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data || error.message)
        throwApiError(error, "Failed to update")
      }
      throw error
    }
  }

  export async function updategonpa(monsid: string, data:any) {
    try {
      await assertCmsAdmin();
      const response = await axios.put(
       url+ `/gonpa/${monsid}`,
        data,
        { headers: apiWriteHeaders() }
      )
      return { success: true, data: response.data }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data || error.message)
        throwApiError(error, "Failed to update")
      }
      throw error
    }
  }

  export async function updatesite(siteid: string, data:any) {
    try {
      await assertCmsAdmin();
      const response = await axios.put(
        url+`/pilgrim/${siteid}`,
        data,
        { headers: apiWriteHeaders() }
      )
      return { success: true, data: response.data }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data || error.message)
        throwApiError(error, "Failed to update")
      }
      throw error
    }
  }

  export async function updatecontact(contactid: string, data:any) {
    try {
      await assertCmsAdmin();
      const response = await axios.put(
        url+`/contact/${contactid}`,
        data,
        { headers: apiWriteHeaders() }
      )
      return { success: true, data: response.data }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data || error.message)
        throwApiError(error, "Failed to update")
      }
      throw error
    }
  }
