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
  jonang: "https://gompa-tour.s3.ap-south-1.amazonaws.com/media/images/1731559304GP205604.jpg",
  other: "https://gompa-tour.s3.ap-south-1.amazonaws.com/media/images/1732603251GP205716.jpg",
};

export const SECT_TRANSLATION_KEYS = {
  'NYINGMA': 'm1',
  'KAGYU': 'm2',
  'SAKYA': 'm3',
  'GELUG': 'm4',
  'BHON': 'm5',
  'JONANG': 'm7',
  'OTHER': 'm10'
};

export const OTHER_SECTS = ['REMEY', 'SHALU', 'BODONG', 'OTHER'];

export const STATES = [
  "Arunachal Pradesh",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Himachal Pradesh",
  "Karnataka",
  "Ladakh",
  "Meghalaya",
  "Maharashtra",
  "Odisha",
  "Sikkim",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Kathmandu",
  "Lumbini",
  "Pokhara",
  "Solokhumbu",
  "Thimphu",
  "Paro",
  "Bumthang",
  "Other"
];

export const COUNTRIES = [
  "India",
  "Nepal",
  "Bhutan",
];

export const downloadSvgAsPng = (svgElement, fileName = 'qrcode.png', bgColor = '#ffffff') => {
  if (!svgElement) return;
  
  // Create a canvas element
  const canvas = document.createElement('canvas');
  const { width, height } = svgElement.getBoundingClientRect();
  
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  // Create a Blob from the SVG
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  
  const URL = window.URL || window.webkitURL || window;
  const blobURL = URL.createObjectURL(svgBlob);
  
  // Draw the image on the canvas and download
  const image = new Image();
  image.onload = () => {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, width, height);
    
    const imgURI = canvas.toDataURL('image/png');
    
    const link = document.createElement('a');
    link.download = fileName;
    link.href = imgURI;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(blobURL);
  };
  
  image.src = blobURL;
};
