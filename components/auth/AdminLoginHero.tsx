"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Image from "next/image";
import { imageFallbacks, resolveImageSrc } from "@/lib/media/image-url";

type AdminLoginHeroProps = {
  logoSrc: string;
  logoAlt: string;
  animationSrc: string;
};

export function AdminLoginHero({
  logoSrc,
  logoAlt,
  animationSrc,
}: AdminLoginHeroProps) {
  return (
    <div className="relative hidden min-h-full overflow-hidden lg:flex lg:w-1/2">
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-dashboard-surface via-dashboard-canvas to-dashboard-sand dark:from-dashboard-surface dark:via-dashboard-canvas dark:to-[#03396c]/30"
      />

      <div className="relative z-10 flex w-full flex-col items-center justify-center gap-10 px-10 py-16">
        <Image
          src={resolveImageSrc(logoSrc, imageFallbacks.headerLogo)}
          alt={logoAlt}
          width={220}
          height={198}
          className="h-40 w-auto object-contain drop-shadow-sm xl:h-44"
          priority
        />

        <div className="h-[min(48vh,400px)] w-[min(92%,420px)]">
          <DotLottieReact src={animationSrc} loop autoplay className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}
