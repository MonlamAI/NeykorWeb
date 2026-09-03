import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isHomePage = (pathname: string) => {
  return ["/", "/en", "/bod", "/hi"].includes(pathname);
};

export const localeAlias: { [key: string]: string } = {
  bod: "bo",
};

/** UI locale (en | bod | hi) → content languageCode (en | bo | hi). */
export function contentLocale(uiLocale: string): string {
  return localeAlias[uiLocale] || uiLocale;
}

export function translationForRead<T extends { languageCode: string }>(
  translations: T[] | undefined,
  uiLocale: string
): T | null {
  if (!translations?.length) return null;
  const code = contentLocale(uiLocale);
  return (
    translations.find((t) => t.languageCode === code) ||
    translations.find((t) => t.languageCode === "en") ||
    translations[0]
  );
}

function searchVariants(value: string): string[] {
  const nfc = value.normalize("NFC").toLowerCase();
  const latinFold = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  const noZw = nfc.replace(/[\u200b-\u200d\ufeff]/g, "");
  const tibCompact = noZw.replace(/[\u0F0B-\u0F14\s]/g, "");
  return Array.from(new Set([nfc, latinFold, noZw, tibCompact].filter(Boolean)));
}

function textMatchesQuery(haystack: string, query: string): boolean {
  const needles = searchVariants(query.trim());
  if (!needles.length) return true;
  const haystacks = searchVariants(haystack);
  return needles.some((needle) =>
    haystacks.some((hay) => hay.includes(needle))
  );
}

/** List search: match any locale's name or description. Display still uses translationForRead. */
export function matchesContentSearch(
  translations: Array<{ name?: string; description?: string }> | undefined,
  query: string,
  extraFields: Array<string | undefined> = []
): boolean {
  if (!query.trim()) return true;
  const fields = [
    ...(translations || []).flatMap((t) => [t.name, t.description]),
    ...extraFields,
  ];
  return fields.some((field) => field && textMatchesQuery(field, query));
}

/** The row for this UI locale, or undefined — never a fallback language. */
export function ownContentTranslation<T extends { languageCode: string }>(
  translations: T[] | undefined,
  uiLocale: string
): T | undefined {
  if (!translations?.length) return undefined;
  const code = contentLocale(uiLocale);
  return translations.find((t) => t.languageCode === code);
}

/** PUT payload for one locale. Backend upserts this row and leaves the others. */
export function contentTranslationPayload(
  uiLocale: string,
  patch: { name: string; description: string; description_audio?: string }
) {
  return {
    languageCode: contentLocale(uiLocale),
    name: patch.name,
    description: patch.description,
    description_audio: patch.description_audio || "",
  };
}

/** Write to the URL/UI locale. Never overwrites a fallback (e.g. en) row. */
export function upsertContentTranslation<T extends { languageCode: string }>(
  translations: T[],
  uiLocale: string,
  patch: Record<string, unknown>
): T[] {
  const code = contentLocale(uiLocale);
  const index = translations.findIndex((t) => t.languageCode === code);
  if (index === -1) {
    return [...translations, { languageCode: code, ...patch } as T];
  }
  return translations.map((t, i) =>
    i === index ? ({ ...t, ...patch, languageCode: code } as T) : t
  );
}

export const IMAGE_BASE_URL = process.env.IMAGE_BASE_URL;
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
  nyingma: `${IMAGE_BASE_URL}/media/images/1732078167GP205668.jpg`,
  kagyu: `${IMAGE_BASE_URL}/media/images/1731493541GP205597.jpg`,
  sakya: `${IMAGE_BASE_URL}/media/images/1732251070GP205684.jpg`,
  gelug: `${IMAGE_BASE_URL}/media/images/1731488192GP205592.jpg`,
  bhon: `${IMAGE_BASE_URL}/media/images/1731914731GP205645.jpg`,
  jonang: `${IMAGE_BASE_URL}/media/images/1731559304GP205604.jpg`,
  other: `${IMAGE_BASE_URL}/media/images/1732603251GP205716.jpg`,
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
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Himachal Pradesh",
  "Karnataka",
  "Ladakh",
  "Meghalaya",
  "Madhya Pradesh",
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

export const downloadSvgAsPng = (svgElement: SVGSVGElement, fileName = 'qrcode.png', bgColor = '#ffffff') => {
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
    if (!ctx) return;
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
