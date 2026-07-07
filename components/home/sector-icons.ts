import type { LucideIcon } from "lucide-react";
import {
  BrainCircuit,
  Building2,
  Car,
  Dumbbell,
  Globe2,
  Lightbulb,
  Rocket,
  Shield,
  Store,
  Truck,
  Users,
} from "lucide-react";

export const sectorIconMap = {
  building2: Building2,
  car: Car,
  truck: Truck,
  dumbbell: Shield, // Map health dumbbell key directly to Shield icon to match design
  rocket: Rocket,
  store: Store,
  globe2: Globe2,
} as const satisfies Record<string, LucideIcon>;

export type SectorIconKey = keyof typeof sectorIconMap;

export function getSectorIcon(id?: string, fallbackIcon?: SectorIconKey): LucideIcon {
  if (id === "companies") return Building2;
  if (id === "cars") return Car;
  if (id === "realestate") return Building2;
  if (id === "transport") return Truck;
  if (id === "health") return Shield;
  if (id === "startups") return Rocket;
  if (id === "commerce") return Store;
  if (id === "any") return Globe2;

  // Fallback to mapped icon name
  if (fallbackIcon && sectorIconMap[fallbackIcon]) {
    return sectorIconMap[fallbackIcon];
  }
  return Building2;
}

export const aboutCardIconMap = {
  brain: BrainCircuit,
  rocket: Rocket,
  users: Users,
  lightbulb: Lightbulb,
} as const satisfies Record<string, LucideIcon>;

export type AboutCardIconKey = keyof typeof aboutCardIconMap;
