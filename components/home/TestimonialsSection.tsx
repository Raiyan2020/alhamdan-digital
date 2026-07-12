"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Reveal } from "@/components/motion";
import type { HomeContent } from "@/lib/i18n/home-content";

type TestimonialsSectionProps = {
  testimonials?: HomeContent["testimonials"];
};

export function TestimonialsSection({ testimonials = [] }: TestimonialsSectionProps) {
  const t = useTranslations("projects");
  const locale = useLocale();
  const isRtl = locale === "ar";

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-card-surface/40">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal variant="section-heading" className="text-center mb-12">
          <div className="flex flex-col items-center">
            <h2 className="text-[32px] sm:text-[42px] font-bold leading-tight tracking-tight text-ink">
              {isRtl ? "قالوا عنا" : "What Our Users Say"}
            </h2>
            <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-ink-muted">
              {isRtl
                ? "تجارب وقصص نجاح حقيقية من مستخدمي تطبيقاتنا"
                : "Real experiences and success stories from our app users"}
            </p>
          </div>
        </Reveal>

        <Reveal variant="fade-up" delay={150}>
          <div className="relative w-full px-0 md:px-8">
            <Carousel
              className="w-full"
              opts={{
                loop: true,
                align: "start",
                direction: isRtl ? "rtl" : "ltr",
              }}
            >
              <CarouselContent className="-ms-4">
                {testimonials.map((item) => (
                  <CarouselItem
                    key={item.id}
                    className="ps-4 basis-full md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="h-full flex flex-col justify-between rounded-3xl border border-border-soft bg-page p-6 sm:p-8 shadow-[0_16px_50px_rgba(15,23,42,0.04)] transition-all duration-300 hover:shadow-[0_24px_64px_rgba(0,106,180,0.06)] hover:-translate-y-1">
                      <div>
                        <div className="flex justify-between items-start gap-4 mb-5">
                          <Link
                            href={`/projects/${item.productSlug}`}
                            className="inline-flex items-center gap-1.5 rounded-full bg-brand/5 border border-brand/10 px-3 py-1 text-xs font-semibold text-brand transition-colors hover:bg-brand/10"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
                            {item.productName}
                          </Link>
                        </div>
                        <p className="text-[15px] leading-7 text-ink-secondary italic">
                          “{item.quote}”
                        </p>
                      </div>

                      <footer className="mt-8 flex items-center gap-3.5 border-t border-border-soft/60 pt-5">
                        {item.avatar ? (
                          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-border-soft bg-muted/20">
                            <Image
                              src={item.avatar}
                              fill
                              alt={item.name}
                              className="object-cover"
                              sizes="44px"
                            />
                          </div>
                        ) : (
                          <span className="grid h-11 w-11 place-items-center rounded-full bg-brand/10 font-bold text-brand text-sm shrink-0">
                            {item.name.slice(0, 1).toUpperCase()}
                          </span>
                        )}
                        <div className="min-w-0">
                          <strong className="block text-sm font-semibold text-ink leading-none">
                            {item.name}
                          </strong>
                          {item.role ? (
                            <span className="mt-1 block text-xs text-ink-muted truncate">
                              {item.role}
                            </span>
                          ) : null}
                        </div>
                      </footer>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {testimonials.length > 1 && (
                <>
                  <CarouselPrevious className="hidden md:inline-flex -left-4 hover:bg-brand hover:text-white" />
                  <CarouselNext className="hidden md:inline-flex -right-4 hover:bg-brand hover:text-white" />
                </>
              )}
            </Carousel>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
