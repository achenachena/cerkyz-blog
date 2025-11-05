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
    const handleImageClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG') {
        const img = target as HTMLImageElement;
        setZoomedImage({
          src: img.src,
          alt: img.alt || '',
        });
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      const images = contentElement.querySelectorAll('img');
      images.forEach((img) => {
        img.classList.add('cursor-pointer', 'transition-opacity', 'hover:opacity-80');
      });

      contentElement.addEventListener('click', handleImageClick);

      return () => {
        contentElement.removeEventListener('click', handleImageClick);
      };
    }
  }, [content]);

  const closeZoom = () => {
    setZoomedImage(null);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeZoom();
    }
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 cursor-pointer"
          onClick={handleOverlayClick}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
        >
          <div className="relative max-w-[95vw] max-h-[95vh] p-4" onClick={(e) => e.stopPropagation()}>
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
