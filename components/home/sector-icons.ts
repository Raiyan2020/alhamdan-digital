import type { LucideIcon } from "lucide-react";
import {
  BrainCircuit,
  Building2,
  Car,
  Dumbbell,
  Globe2,
  Lightbulb,
  Rocket,
  Store,
  Truck,
  Users,
} from "lucide-react";

export const sectorIconMap = {
  building2: Building2,
  car: Car,
  truck: Truck,
  dumbbell: Dumbbell,
  rocket: Rocket,
  store: Store,
  globe2: Globe2,
} as const satisfies Record<string, LucideIcon>;

export type SectorIconKey = keyof typeof sectorIconMap;

export const aboutCardIconMap = {
  brain: BrainCircuit,
  rocket: Rocket,
  users: Users,
  lightbulb: Lightbulb,
} as const satisfies Record<string, LucideIcon>;

export type AboutCardIconKey = keyof typeof aboutCardIconMap;
