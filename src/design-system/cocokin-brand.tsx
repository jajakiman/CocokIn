import Image from "next/image";

type BrandVariant = "mark" | "wordmark" | "full";

const brandAssets = {
  mark: {
    src: "/brand/cocokin/logo-mark.webp",
    width: 419,
    height: 494,
  },
  wordmark: {
    src: "/brand/cocokin/logo-wordmark.webp",
    width: 934,
    height: 241,
  },
  full: {
    src: "/brand/cocokin/logo-full.webp",
    width: 2089,
    height: 753,
  },
} as const;

type CocokInBrandProps = {
  className?: string;
  decorative?: boolean;
  priority?: boolean;
  variant: BrandVariant;
};

export function CocokInBrand({
  className,
  decorative = false,
  priority = false,
  variant,
}: CocokInBrandProps) {
  const asset = brandAssets[variant];

  return (
    <Image
      alt={decorative ? "" : "CocokIn"}
      className={className}
      height={asset.height}
      priority={priority}
      src={asset.src}
      unoptimized
      width={asset.width}
    />
  );
}
