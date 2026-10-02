'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface PostContentProps {
  content: string;
}

export default function PostContent({ content }: PostContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [zoomedImage, setZoomedImage] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    const handleImageClick = (event: MouseEvent) => {
      if (event.target instanceof HTMLImageElement) {
        setZoomedImage({ src: event.target.src, alt: event.target.alt });
      }
    };
    element.addEventListener('click', handleImageClick);
    return () => element.removeEventListener('click', handleImageClick);
  }, []);

  useEffect(() => {
    if (zoomedImage) dialogRef.current?.showModal();
  }, [zoomedImage]);

  return (
    <>
      <div ref={contentRef} className="prose" dangerouslySetInnerHTML={{ __html: content }} />
      <dialog
        ref={dialogRef}
        className="fixed inset-0 m-auto max-h-[95vh] max-w-[95vw] overflow-visible border-0 bg-transparent p-4 backdrop:bg-black/90"
        aria-label="Enlarged image"
        onClose={() => setZoomedImage(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
      >
        {zoomedImage && (
          <Image
            src={zoomedImage.src}
            alt={zoomedImage.alt}
            width={1600}
            height={1000}
            unoptimized
            className="h-auto max-h-[90vh] w-auto max-w-full object-contain"
          />
        )}
        <button
          type="button"
          autoFocus
          className="absolute right-2 top-2 text-4xl leading-none text-white hover:opacity-80"
          onClick={() => dialogRef.current?.close()}
          aria-label="Close image zoom"
        >
          ×
        </button>
      </dialog>
    </>
  );
}
