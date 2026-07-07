import type { ReactNode } from "react";

/** Centered content column with responsive gutters. */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`.trim()}>
      {children}
    </div>
  );
}
