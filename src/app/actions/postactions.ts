'use server'
import axios from "axios";
import { revalidatePath } from 'next/cache';


const url=process.env.API_URL;


export async function createS3UploadUrl(formData: FormData) {
  try {
    const file = formData.get('file');
    if (!file) throw new Error('File is required');
    const apiFormData = new FormData();
    apiFormData.append('file', file);

    const response = await axios.post(
      "https://api.monlam.ai/api/v1/upload",
      apiFormData,
      {
        headers: {
          'Authorization': `Bearer ${process.env.API_ACCESS_KEY}`,
          'Accept': 'application/json',
        }
      }
    );

    if (!response.data?.file_url) {
      throw new Error('Invalid response format: missing file_url');
    }

    return response.data.file_url;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      const errorDetail = error.response?.data?.detail || error.message;
      
      if (statusCode === 403) {
        throw new Error('Authentication failed - please check your API key');
      } else if (statusCode === 413) {
        throw new Error('File size too large');
      }

      console.error("API Error:", {
        status: statusCode,
        detail: errorDetail,
        headers: error.response?.headers
      });
      
      throw new Error(`Upload failed: ${errorDetail}`);
    }
    throw error;
  }
}


export async function postfestival(data: any) {
  try {
    const response = await axios.post(
      url+`/festival`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // Revalidate the festival pages
    revalidatePath('/[locale]/Festival');
    revalidatePath('/[locale]/(mainroutes)/Festival');
    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", error.response?.data || error.message);
      throw new Error(`Failed to fetch statues: ${error.message}`);
    }
    throw error;
  }
}

export async function postStatue(data: any) {
  try {
    const response = await axios.post(
      url+"/statue",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // Revalidate the statues page
    revalidatePath('/[locale]/Statue');
    revalidatePath('/[locale]/(mainroutes)/Statue');
    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", error.response?.data || error.message);
      throw new Error(`Failed to fetch statues: ${error.message}`);
    }
    throw error;
  }
}
export async function createUser(userData: any) {
  try {
   const response= await axios.post(url+"/user", userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { success: true, data: response.data };

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("User creation failed:", {
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(`Failed to create user: ${error.message}`);
    }
    throw error;
  }
}

export async function creategonpa(data: any) {
  try {
    const response = await axios.post(
      url+"/gonpa",
      data,
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
      throw new Error(`Failed to create monastery: ${error.message}`);
    }
    throw error;
  }
}

export async function createcontact(data: any) {
  try {
    const response = await axios.post(
      url+"/contact",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return { success: true, data: response.data.id };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", error.response?.data || error.message);
      throw new Error(`Failed to fetch statues: ${error.message}`);
    }
    throw error;
  }
}

export async function createSacred(data:any){
  try {
    const response = await axios.post(
      url+"/pilgrim",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // Revalidate the sacred sites pages
    revalidatePath('/[locale]/Sacred');
    revalidatePath('/[locale]/(mainroutes)/Sacred');
    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", error.response?.data || error.message);
      throw new Error(`Failed to fetch statues: ${error.message}`);
    }
    throw error;
  }
}