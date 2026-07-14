'use client';

import { useEffect, useRef, useState } from 'react';

const DEFAULT_FALLBACK = '/images/local-guide-hero.webp';

interface SafeImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  imageClassName?: string;
  fallbackSrc?: string;
  loading?: 'eager' | 'lazy';
  onLoadError?: (src: string) => void;
}

export default function SafeImage({
  src,
  alt,
  className = '',
  imageClassName = '',
  fallbackSrc = DEFAULT_FALLBACK,
  loading = 'lazy',
  onLoadError,
}: SafeImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
    setLoaded(false);
    setFailed(false);
  }, [src, fallbackSrc]);

  useEffect(() => {
    const image = imgRef.current;
    if (!image) return;

    const markLoaded = () => {
      if (image.naturalWidth > 0) {
        setFailed(false);
        setLoaded(true);
      }
    };

    const markFailed = () => {
      setLoaded(false);
      setFailed(true);
    };

    if (image.complete) {
      if (image.naturalWidth > 0) markLoaded();
      else markFailed();
    }

    image.addEventListener('load', markLoaded);
    image.addEventListener('error', markFailed);

    const frame = window.requestAnimationFrame(() => {
      if (image.complete && image.naturalWidth > 0) markLoaded();
    });

    return () => {
      window.cancelAnimationFrame(frame);
      image.removeEventListener('load', markLoaded);
      image.removeEventListener('error', markFailed);
    };
  }, [currentSrc]);

  const handleError = () => {
    if (currentSrc !== fallbackSrc) {
      onLoadError?.(currentSrc);
      setLoaded(false);
      setFailed(false);
      setCurrentSrc(fallbackSrc);
    }
  };

  return (
    <span className={`safe-image ${loaded ? 'safe-image-loaded' : ''} ${className}`}>
      <span className="safe-image-skeleton" aria-hidden="true" />
      {/* Native image is intentional: runtime source swapping provides a reliable local fallback. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        loading={loading}
        className={`${imageClassName} ${failed ? 'safe-image-failed' : ''}`}
        onLoad={(event) => {
          if (event.currentTarget.naturalWidth > 0) {
            setFailed(false);
            setLoaded(true);
          }
        }}
        onError={handleError}
      />
    </span>
  );
}
