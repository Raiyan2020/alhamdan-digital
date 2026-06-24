import Image from "next/image";
import { Check } from "lucide-react";

const products = [
  {
    number: "01/",
    title: "مشروع “ بو حمدان ”",
    body: "منصة متخصصة في عرض وبيع السيارات بطريقة احترافية وسهلة الاستخدام، تساعد البائعين والمشترين على الوصول إلى خياراتهم بسرعة ووضوح.",
    offers: ["عرض السيارات", "بحث متقدم", "تفاصيل واضحة", "تجربة سلسة"],
    audience: ["معارض السيارات", "الأفراد", "المشترين"],
    image: "/figma/services-phone.webp",
    imageSide: "left",
  },
  {
    number: "02/",
    title: "مشروع “ Nafas ”",
    body: "منصة رياضية وصحية تهدف إلى تشجيع النشاط البدني وتعزيز أسلوب الحياة الصحي من خلال برامج تحفيزية وعروض متخصصة.",
    offers: ["الوصول للمدربين", "لعروض الرياضية", "تشجيع", "متابعة النشاط"],
    audience: ["النوادي الرياضية", "المدربون", "الأفراد"],
    image: "/figma/market-visual.webp",
    imageSide: "right",
  },
  {
    number: "03/",
    title: "مشروع “ Did Deed ”",
    body: "تطبيق مخصص لطلب خدمات النقل والتاكسي، يركز على سهولة الاستخدام وسرعة الوصول إلى الخدمة.",
    offers: ["طلب الرحلات", "تتبع الرحلة", "سهولة الحجز", "تجربة استخدام بسيطة"],
    audience: ["المستخدمون اليوميون", "السائقون", "شركات النقل"],
    image: "/figma/hero-visual.webp",
    imageSide: "left",
  },
  {
    number: "04/",
    title: "مشروع “ Road 80 ”",
    body: "منصة عقارية حديثة تتيح عرض العقارات للبيع والإيجار بطريقة منظمة تساعد المستخدمين على استكشاف الخيارات واتخاذ القرار المناسب.",
    offers: ["البحث عن العقارات", "مقارنة الخيارات", "إدارة الإعلانات", "التفاصيل"],
    audience: ["لمكاتب العقارية", "الشركات العقارية", "المستثمرين"],
    image: "/figma/hero-visual.webp",
    imageSide: "right",
  },
] as const;

function FeaturePills({ items, compact = false }: { items: readonly string[]; compact?: boolean }) {
  return (
    <div className={`grid gap-4 ${compact ? "grid-cols-2" : "grid-cols-4"}`}>
      {items.map((item) => (
        <span
          key={item}
          className="flex h-11 items-center justify-center gap-2 rounded-full bg-[#f3f3f3] px-4 text-center text-sm font-bold text-[#0d0d0d]"
        >
          {item}
          <Check className="h-5 w-5 rounded-full bg-[#012561] p-1 text-white" />
        </span>
      ))}
    </div>
  );
}

function StoreButtons({ desktop = false }: { desktop?: boolean }) {
  return (
    <div className={`flex gap-4 ${desktop ? "justify-end" : "justify-center sm:justify-end"}`} dir="ltr">
      {["App Store", "Google Play"].map((store) => (
        <div
          key={store}
          className="flex h-12 w-36 items-center justify-center rounded-xl bg-black text-left text-white"
        >
          <span className="text-sm leading-tight">
            <small className="block text-[9px] text-white/70">احصل عليه على</small>
            {store}
          </span>
        </div>
      ))}
    </div>
  );
}

function DesktopProduct({
  product,
  top,
}: {
  product: (typeof products)[number];
  top: number;
}) {
  const visual =
    product.imageSide === "left" ? (
      <Image
        src={product.image}
        alt=""
        width={603}
        height={600}
        loading="eager"
        className="absolute left-20 top-[93px] h-[600px] w-[520px] object-contain"
      />
    ) : (
      <Image
        src={product.image}
        alt=""
        width={603}
        height={600}
        loading="eager"
        className="absolute left-[837px] top-[88px] h-[600px] w-[603px] object-contain"
      />
    );

  const textLeft = product.imageSide === "left" ? "left-[732px]" : "left-20";

  return (
    <section className="absolute left-0 h-[785px] w-[1440px]" style={{ top }}>
      {visual}
      <div className={`absolute ${textLeft} top-[79px] w-[628px] text-right`}>
        <p className="text-[40px] font-medium leading-[56px]">{product.number}</p>
        <h2 className="mt-4 text-[48px] font-semibold leading-[68px]">
          {product.title}
        </h2>
        <p className="mt-8 text-[24px] font-medium leading-9 text-[#4e4e4e]">
          {product.body}
        </p>
        <h3 className="mt-9 text-[28px] font-medium">ماذا يقدم ؟</h3>
        <div className="mt-6">
          <FeaturePills items={product.offers} />
        </div>
        <h3 className="mt-8 text-[28px] font-medium">من هي الفئة المستهدفة ؟</h3>
        <div className="mt-6 grid grid-cols-3 gap-4">
          {product.audience.map((item) => (
            <span
              key={item}
              className="flex h-11 items-center justify-center gap-2 rounded-full bg-[#f3f3f3] px-4 text-center text-sm font-bold"
            >
              {item}
              <Check className="h-5 w-5 rounded-full bg-[#012561] p-1 text-white" />
            </span>
          ))}
        </div>
        <h3 className="mt-8 text-[24px] font-bold">حمّل التطبيق واطلب الآن</h3>
        <div className="mt-5">
          <StoreButtons desktop />
        </div>
      </div>
    </section>
  );
}

function DesktopAboutPage() {
  return (
    <div
      dir="ltr"
      data-figma-canvas
      className="relative mx-auto hidden h-[3840px] w-[1440px] overflow-visible bg-[#fcfcfc] text-[#0d0d0d] min-[1440px]:block"
    >
      <section className="absolute left-20 top-[274px] h-[338px] w-[1280px] text-center">
        <h1 className="text-[56px] font-medium leading-[72px]">منتجاتنا الرقمية</h1>
        <p className="mx-auto mt-8 w-[922px] text-[28px] font-medium leading-[42px] text-[#777]">
          في Al Hamdan Digital لا نكتفي بتقديم الخدمات التقنية، بل نمتلك ونطوّر مجموعة من المنتجات الرقمية التي تخدم قطاعات حيوية مختلفة، مما يمنحنا خبرة عملية حقيقية
          <br />
          في بناء وإدارة المنتجات الرقمية.
        </p>
        <button className="mt-8 h-[76px] rounded-2xl bg-[#012561] px-10 text-[24px] leading-9 text-white">
          استكشفنا
        </button>
      </section>
      <DesktopProduct product={products[0]} top={663} />
      <DesktopProduct product={products[1]} top={1448} />
      <DesktopProduct product={products[2]} top={2268} />
      <DesktopProduct product={products[3]} top={3053} />
    </div>
  );
}

function ResponsiveAboutPage() {
  return (
    <div className="bg-[#fcfcfc] text-[#0d0d0d] min-[1440px]:hidden">
      <section className="px-5 py-14 text-center">
        <h1 className="text-4xl font-medium leading-tight">منتجاتنا الرقمية</h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-[#666]">
          في Al Hamdan Digital لا نكتفي بتقديم الخدمات التقنية، بل نمتلك ونطوّر مجموعة من المنتجات الرقمية التي تخدم قطاعات حيوية مختلفة، مما يمنحنا خبرة عملية حقيقية في بناء وإدارة المنتجات الرقمية.
        </p>
        <button className="mt-8 h-14 rounded-2xl bg-[#012561] px-8 text-lg text-white">
          استكشفنا
        </button>
      </section>
      <div className="grid gap-12 px-5 pb-12">
        {products.map((product) => (
          <article key={product.title} className="mx-auto grid w-full max-w-7xl gap-8 md:grid-cols-2 md:items-center">
            <Image
              src={product.image}
              alt=""
              width={603}
              height={600}
              loading="eager"
              className={product.imageSide === "right" ? "mx-auto h-auto w-full object-contain md:order-2" : "mx-auto h-auto w-full object-contain"}
            />
            <div className="text-right">
              <p className="text-3xl font-medium text-[#012561]">{product.number}</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight">
                {product.title}
              </h2>
              <p className="mt-5 text-lg leading-8 text-[#4e4e4e]">
                {product.body}
              </p>
              <h3 className="mt-7 text-2xl font-medium">ماذا يقدم ؟</h3>
              <div className="mt-4">
                <FeaturePills items={product.offers} compact />
              </div>
              <h3 className="mt-7 text-2xl font-medium">من هي الفئة المستهدفة ؟</h3>
              <div className="mt-4">
                <FeaturePills items={product.audience} compact />
              </div>
              <h3 className="mt-7 text-xl font-bold">حمّل التطبيق واطلب الآن</h3>
              <div className="mt-4">
                <StoreButtons />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function AboutPage() {
  return (
    <main dir="rtl" className="min-h-screen overflow-x-auto bg-[#fcfcfc] font-sans">
      <ResponsiveAboutPage />
      <DesktopAboutPage />
    </main>
  );
}
