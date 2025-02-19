import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { usePathname } from 'next/navigation';

const DynamicQRCode = ({ size = 128, bgColor = "#ffffff", fgColor = "#000000" }) => {
  const pathname = usePathname();
  console.log('the path name',pathname)
  const [url, setUrl] = useState('');
  
  useEffect(() => {
    const fullUrl = window.location.origin + pathname;
    console.log(fullUrl)
    setUrl(fullUrl);
  }, [pathname]);

  if (!url) return null;

  return (
    <div className="flex flex-col items-center gap-2 p-4  ">
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