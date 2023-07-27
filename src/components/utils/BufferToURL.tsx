import { Image } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';

interface ImageRendererProps {
  imageBuffer: ArrayBuffer | null;
  rotunjit: boolean;
}

export const ImageRenderer: React.FC<ImageRendererProps> = ({ imageBuffer, rotunjit }) => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (imageBuffer) {
      const blob = new Blob([new Uint8Array(imageBuffer)], { type: 'image/jpg' });
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    }

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageBuffer]);

  return (
    <div>
      {rotunjit ? (
        <div style={{ width: '200px', height: '200px', borderRadius: '50%', overflow: 'hidden' }}>
          {imageUrl && <Image src={imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        </div>
      ) : (
        imageUrl && <Image src={imageUrl} style={{
          // width: '800px', height: '600px' 
          width: '100%',
          height: '100%',
        }} />
      )}
    </div >
  );
}