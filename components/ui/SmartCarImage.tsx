import Image from "next/image";

interface SmartCarImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

export default function SmartCarImage({
  src,
  alt,
  fill,
  priority,
  sizes,
  className,
}: SmartCarImageProps) {
  if (src.startsWith("data:")) {
    return (
      <img
        src={src}
        alt={alt}
        className={
          fill
            ? `absolute inset-0 h-full w-full ${className ?? ""}`
            : className
        }
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      priority={priority}
      sizes={sizes}
      className={className}
    />
  );
}
