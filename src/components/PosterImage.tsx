import { useState } from 'react';
import { Film } from 'lucide-react';

interface PosterImageProps {
  src: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

export default function PosterImage({ src, alt, className = '', fallbackClassName = '' }: PosterImageProps) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div className={`${className} ${fallbackClassName} bg-cin-border flex flex-col items-center justify-center gap-2`}>
        <Film className="w-8 h-8 text-gray-600" />
        <span className="text-[10px] text-gray-600 font-medium px-2 text-center line-clamp-2">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => setErrored(true)}
    />
  );
}
