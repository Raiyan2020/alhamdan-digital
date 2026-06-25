"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Image from "next/image";
import { imageFallbacks, resolveImageSrc } from "@/lib/media/image-url";

type AdminLoginMobileVisualProps = {
  logoSrc: string;
  logoAlt: string;
  animationSrc: string;
};

export function AdminLoginMobileVisual({
  logoSrc,
  logoAlt,
  animationSrc,
}: AdminLoginMobileVisualProps) {
  return (
    <div className="mb-8 flex flex-col items-center gap-5 lg:hidden">
      <Image
        src={resolveImageSrc(logoSrc, imageFallbacks.headerLogo)}
        alt={logoAlt}
        width={180}
        height={162}
        className="h-32 w-auto object-contain"
        priority
      />
      <div className="h-44 w-full max-w-[280px]">
        <DotLottieReact src={animationSrc} loop autoplay className="h-full w-full" />
      </div>
    </div>
  );
}
