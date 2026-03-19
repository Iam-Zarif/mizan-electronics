import Image from "next/image";

type BrandLogoProps = {
  size?: number;
  className?: string;
};

export default function BrandLogo({ size = 36, className = "" }: BrandLogoProps) {
  return (
    <Image
      src="/mizan.png"
      alt="Mizan AC Servicing"
      width={size}
      height={size}
      className={`h-auto w-auto ${className}`}
      priority={size >= 48}
    />
  );
}
