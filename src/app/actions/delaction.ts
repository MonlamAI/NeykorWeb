'use server'
import axios from "axios";
import { apiWriteHeaders, assertCmsAdmin } from "@/lib/cmsAuth";

const url=process.env.API_URL;

export async function deleteSacred(statueId: string) {
    try {
      await assertCmsAdmin();
      const response = await axios.delete(
        url+`/statue/${statueId}`,
        { headers: apiWriteHeaders() }
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
      await assertCmsAdmin();
      const response = await axios.delete(
        url+`/pilgrim/${statueId}`,
        { headers: apiWriteHeaders() }
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
      await assertCmsAdmin();
      const response = await axios.delete(
        url+`/user/${email}`,
        { headers: apiWriteHeaders() }
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

  export async function deletegonpa(gonpaid:string)
  {
    try {
      await assertCmsAdmin();
      const response = await axios.delete(
        url+`/gonpa/${gonpaid}`,
        { headers: apiWriteHeaders() }
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

  export async function deletefest(festid:string)
  {
    try {
      await assertCmsAdmin();
      const response = await axios.delete(
        url+`/festival/${festid}`,
        { headers: apiWriteHeaders() }
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
