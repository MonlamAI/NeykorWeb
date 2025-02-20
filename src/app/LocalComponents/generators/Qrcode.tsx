'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { usePathname } from 'next/navigation';

const DynamicQRCode = ({ size = 128, bgColor = "#ffffff", fgColor = "#000000" }) => {
  const pathname = usePathname();
  const url = window.location.origin + pathname;

  return (
    <div className="flex flex-col items-center gap-2 p-4">
      <QRCodeSVG
        value={url}
        size={size}
        bgColor={bgColor}
        fgColor={fgColor}
        level="L"
      />
    </div>
  );
};

export default DynamicQRCode;