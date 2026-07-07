import type { SVGProps } from "react";

/**
 * Small inline-SVG icon set (stroke = currentColor, 24×24). Content refers to
 * icons by string key from Contentful, so no icon font or extra request needed.
 */
export type IconName =
  | "phone"
  | "mail"
  | "facebook"
  | "map"
  | "navigate"
  | "clock"
  | "check"
  | "arrow"
  | "shield"
  | "thumbsup"
  | "pin"
  | "wrench"
  | "bath"
  | "drain"
  | "camera"
  | "snowflake"
  | "rental";

const paths: Record<IconName, React.ReactNode> = {
  phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />,
  mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 6 10-6" /></>,
  facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  map: <><path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2z" /><path d="M9 4v14M15 6v14" /></>,
  navigate: <path d="m3 11 19-9-9 19-2-8-8-2z" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  check: <path d="M20 6 9 17l-5-5" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  thumbsup: <path d="M7 10v11H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zm4 0 3-7a2 2 0 0 1 3.7 1.2L17 10h3.3a2 2 0 0 1 2 2.4l-1.4 7a2 2 0 0 1-2 1.6H7V10z" />,
  pin: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></>,
  wrench: <path d="M14.7 6.3a4 4 0 0 0 5 5l-2.6 2.6a2 2 0 0 1 0 2.8L14 20a2 2 0 0 1-2.8-2.8l3.3-3.3a4 4 0 0 1-5-5L6.1 11.6a2 2 0 0 1-2.8-2.8l3-3A2 2 0 0 1 9.1 8.6z" />,
  bath: <><path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" /><path d="M6 12V6a2 2 0 0 1 2-2c1 0 1.5.5 2 1" /><path d="M2 12h20M6 19l-1 2M18 19l1 2" /></>,
  drain: <><circle cx="12" cy="12" r="9" /><path d="M12 3v18M3 12h18M6 6l12 12M18 6 6 18" /></>,
  camera: <><path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L19 6h0a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><circle cx="12" cy="12.5" r="3.5" /></>,
  snowflake: <path d="M12 2v20M4 6l16 12M20 6 4 18M2 12h20" />,
  rental: <><rect x="2" y="7" width="20" height="12" rx="2" /><path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M12 11v4M10 13h4" /></>,
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: string;
  size?: number;
}

export function Icon({ name, size = 24, ...rest }: IconProps) {
  const node = paths[name as IconName];
  if (!node) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {node}
    </svg>
  );
}
