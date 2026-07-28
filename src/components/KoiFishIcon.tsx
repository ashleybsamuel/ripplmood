import React, { useEffect, useState } from "react";
import koiImgSrc from "../assets/images/koi_fish_user_crop_1784740849165.jpg";

interface KoiFishIconProps {
  className?: string;
}

export const KoiFishIcon: React.FC<KoiFishIconProps> = ({ className = "w-full h-full" }) => {
  const [transparentDataUrl, setTransparentDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = koiImgSrc;
    img.onload = () => {
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = w;
      tempCanvas.height = h;
      const ctx = tempCanvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      let minX = w, minY = h, maxX = 0, maxY = 0;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const brightness = (r + g + b) / 3;

          // Black/dark background removal
          if (brightness < 35) {
            data[idx + 3] = 0; // 100% transparent
          } else {
            const alpha = Math.min(255, (brightness - 20) * 4);
            data[idx + 3] = alpha;

            // Recolor line art to warm cream/rose gold
            data[idx] = 248;
            data[idx + 1] = 236;
            data[idx + 2] = 232;

            if (alpha > 30) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);

      // Tight bounding box crop
      if (maxX > minX && maxY > minY) {
        const cropWidth = maxX - minX + 1;
        const cropHeight = maxY - minY + 1;

        const cropCanvas = document.createElement("canvas");
        const pad = 8;
        cropCanvas.width = cropWidth + pad * 2;
        cropCanvas.height = cropHeight + pad * 2;
        const cropCtx = cropCanvas.getContext("2d");

        if (cropCtx) {
          cropCtx.drawImage(
            tempCanvas,
            minX, minY, cropWidth, cropHeight,
            pad, pad, cropWidth, cropHeight
          );

          // Rotate 90 degrees clockwise so canvas dimensions and aspect ratio match
          const rotCanvas = document.createElement("canvas");
          rotCanvas.width = cropCanvas.height;
          rotCanvas.height = cropCanvas.width;
          const rotCtx = rotCanvas.getContext("2d");
          if (rotCtx) {
            rotCtx.translate(rotCanvas.width / 2, rotCanvas.height / 2);
            rotCtx.rotate((90 * Math.PI) / 180);
            rotCtx.drawImage(cropCanvas, -cropCanvas.width / 2, -cropCanvas.height / 2);
            setTransparentDataUrl(rotCanvas.toDataURL("image/png"));
            return;
          }

          setTransparentDataUrl(cropCanvas.toDataURL("image/png"));
          return;
        }
      }

      setTransparentDataUrl(tempCanvas.toDataURL("image/png"));
    };
  }, []);

  if (!transparentDataUrl) {
    return <div className={`${className} bg-transparent`} />;
  }

  return (
    <img
      src={transparentDataUrl}
      alt="Japanese Koi Fish"
      referrerPolicy="no-referrer"
      className={`${className} object-contain filter drop-shadow-[0_0_12px_rgba(248,236,232,0.4)] hover:scale-105 transition-transform duration-500`}
    />
  );
};

