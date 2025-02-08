import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const localeAlias: { [key: string]: string } = {
  bod: "bo",
};


export const validateFile = (file: File, type: 'image' | 'audio') => {
  const maxSize = 10 * 1024 * 1024;
  
  if (file.size > maxSize) {
    throw new Error(`File size should be less than 10MB`);
  }

  if (type === 'image') {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Please upload a valid image file (JPEG, PNG, or WebP)');
    }
  } else if (type === 'audio') {
    const allowedTypes = ['audio/mpeg', 'audio/mp3'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Please upload a valid MP3 file');
    }
  }
};

export const formatDateForInput = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; 
};

export const formatDateForDisplay = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};