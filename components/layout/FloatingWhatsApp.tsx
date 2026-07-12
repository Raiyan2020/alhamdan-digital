"use client";

import { MessageCircle } from "lucide-react";

export function FloatingWhatsApp({ visible, number, message, label }: { visible: boolean; number: string; message: string; label: string }) {
  const normalized = number.replace(/\D/g, "");
  if (!visible || !normalized) return null;
  const href = `https://wa.me/${normalized}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
  return <a href={href} target="_blank" rel="noreferrer" aria-label={label} className="floating-whatsapp-btn fixed bottom-5 end-5 z-[60] inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-[bottom] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"><MessageCircle className="h-6 w-6" /></a>;
}
