import {
  ArrowRight,
  Banknote,
  Bath,
  Camera,
  Check,
  ChevronDown,
  Clock,
  Droplets,
  Gauge,
  Mail,
  MapPin,
  Menu,
  Navigation,
  Package,
  Phone,
  ShieldCheck,
  ShowerHead,
  Snowflake,
  Sparkles,
  Star,
  Store,
  ThumbsUp,
  Truck,
  Video,
  Waves,
  Wrench,
  X,
} from "lucide-react";

/**
 * Content refers to icons by string key (from Contentful `icon` fields); we map
 * those keys onto lucide-react icons (same aesthetic as the tryride project).
 * lucide v1 dropped brand icons, so Facebook is a small inline glyph.
 * Add a key here to expose it to editors — see docs/CONTENTFUL-MODEL.md.
 */

type IconCmp = React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;

function FacebookGlyph({ size = 24, className }: { size?: number; className?: string; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17 2H7a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h5v-7H9.5v-3H12V9.5A3.5 3.5 0 0 1 15.5 6H18v3h-2a1 1 0 0 0-1 1V12h3l-.5 3H15v7h2a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5Z" />
    </svg>
  );
}

const ICONS: Record<string, IconCmp> = {
  // contact / actions
  phone: Phone,
  mail: Mail,
  facebook: FacebookGlyph,
  map: MapPin,
  pin: MapPin,
  navigate: Navigation,
  clock: Clock,
  check: Check,
  arrow: ArrowRight,
  chevron: ChevronDown,
  menu: Menu,
  close: X,
  // trust / value
  shield: ShieldCheck,
  thumbsup: ThumbsUp,
  store: Store,
  star: Star,
  sparkles: Sparkles,
  savings: Banknote,
  gauge: Gauge,
  // services / products
  wrench: Wrench,
  bath: Bath,
  shower: ShowerHead,
  drain: Waves,
  water: Droplets,
  camera: Camera,
  video: Video,
  snowflake: Snowflake,
  rental: Truck,
  package: Package,
};

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 24, className, strokeWidth = 1.9 }: IconProps) {
  const Cmp = ICONS[name];
  if (!Cmp) return null;
  return <Cmp size={size} className={className} strokeWidth={strokeWidth} />;
}
