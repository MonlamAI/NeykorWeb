'use client';
import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { usePathname } from 'next/navigation';
import { Download } from 'lucide-react';
import { downloadSvgAsPng } from '@/lib/utils';

const DynamicQRCode = ({ size = 128, bgColor = "#ffffff", fgColor = "#000000" }) => {
  const pathname = usePathname();
  const url = typeof window !== 'undefined' ? window.location.origin + pathname : '';
  const qrRef = useRef(null);

  const handleDownload = () => {
    if (!qrRef.current) return;
    const svgElement = qrRef.current.querySelector('svg');
    downloadSvgAsPng(svgElement, 'qrcode.png', bgColor);
  };

  return (
    <div className="flex flex-col items-center gap-2 p-4">
      <div ref={qrRef}>
        <QRCodeSVG
          value={url}
          size={size}
          bgColor={bgColor}
          fgColor={fgColor}
          level="L"
        />
      </div>
      <button 
        onClick={handleDownload} 
        className="flex items-center gap-2 px-3 py-2 mt-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Download size={16} />
        Download QR Code
      </button>
    </div>
  );
};

export default DynamicQRCode;