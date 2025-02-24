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

export const BACKGROUND_IMAGES = {
  nyingma: "https://gompa-tour.s3.ap-south-1.amazonaws.com/media/images/1732078167GP205668.jpg",
  kagyu: "https://gompa-tour.s3.ap-south-1.amazonaws.com/media/images/1731493541GP205597.jpg",
  sakya: "https://gompa-tour.s3.ap-south-1.amazonaws.com/media/images/1732251070GP205684.jpg",
  gelug: "https://gompa-tour.s3.ap-south-1.amazonaws.com/media/images/1731488192GP205592.jpg",
  bhon: "https://gompa-tour.s3.ap-south-1.amazonaws.com/media/images/1731914731GP205645.jpg",
  remey: "https://gompa-tour.s3.ap-south-1.amazonaws.com/media/images/1732603840GP205717.jpg",
  jonang: "https://gompa-tour.s3.ap-south-1.amazonaws.com/media/images/1731559304GP205604.jpg",
  shalu: "https://gompa-tour.s3.ap-south-1.amazonaws.com/media/images/1732605178GP205720.jpg",
  bodong: "https://gompa-tour.s3.ap-south-1.amazonaws.com/media/images/1732602550GP205715.jpg",
  other: "https://gompa-tour.s3.ap-south-1.amazonaws.com/media/images/1732603251GP205716.jpg",
};

export const SECT_TRANSLATION_KEYS = {
  'NYINGMA': 'm1',
  'KAGYU': 'm2',
  'SAKYA': 'm3',
  'GELUG': 'm4',
  'BHON': 'm5',
  'REMEY': 'm6',
  'JONANG': 'm7',
  'SHALU': 'm8',
  'BODONG': 'm9',
  'OTHER': 'm10'
};