'use client';

import { useEffect, useRef, useState } from 'react';

interface PostContentProps {
  content: string;
}

export default function PostContent({ content }: PostContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [zoomedImage, setZoomedImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  useEffect(() => {
    if (contentRef.current) {
      const images = contentRef.current.querySelectorAll('img');
      images.forEach((img) => {
        img.classList.add('cursor-pointer', 'transition-opacity', 'hover:opacity-80');
        img.addEventListener('click', () => {
          setZoomedImage({
            src: img.src,
            alt: img.alt || '',
          });
        });
      });
    }
  }, [content]);

  const closeZoom = () => {
    setZoomedImage(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeZoom();
    }
  };

  return (
    <>
      <div
        ref={contentRef}
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 cursor-pointer animate-fadeIn"
          onClick={closeZoom}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
        >
          <div className="relative max-w-[95vw] max-h-[95vh] p-4">
            <img
              src={zoomedImage.src}
              alt={zoomedImage.alt}
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button
              className="absolute top-2 right-2 text-white text-4xl leading-none hover:opacity-80 transition-opacity"
              onClick={closeZoom}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
