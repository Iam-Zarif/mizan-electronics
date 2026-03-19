type BrandLogoProps = {
  size?: number;
  className?: string;
};

export default function BrandLogo({ size = 48, className = "" }: BrandLogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/mizan.png"
      alt="Mizan AC Servicing"
      width={size}
      height={size}
      className={className}
      style={{ width: "auto", height: `${size}px` }}
    />
  );
}
