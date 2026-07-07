import { Icon } from "./Icon";

/** Section heading: optional eyebrow pill + tight balanced title + subtitle. Left-aligned by default. */
export function SectionHeading({
  eyebrow,
  eyebrowIcon,
  heading,
  subheading,
  align = "left",
}: {
  eyebrow?: string;
  eyebrowIcon?: string;
  heading?: string;
  subheading?: string;
  align?: "left" | "center";
}) {
  if (!heading && !subheading && !eyebrow) return null;
  const centered = align === "center";
  return (
    <div className={`max-w-2xl ${centered ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand ${centered ? "" : ""}`}
        >
          {eyebrowIcon && <Icon name={eyebrowIcon} size={14} />}
          {eyebrow}
        </span>
      )}
      {heading && (
        <h2 className={`text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl ${eyebrow ? "mt-4" : ""}`}>
          {heading}
        </h2>
      )}
      {subheading && <p className="mt-3 text-lg leading-relaxed text-muted">{subheading}</p>}
    </div>
  );
}
