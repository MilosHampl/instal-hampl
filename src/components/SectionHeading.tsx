export function SectionHeading({
  heading,
  subheading,
  center = true,
}: {
  heading?: string;
  subheading?: string;
  center?: boolean;
}) {
  if (!heading && !subheading) return null;
  return (
    <div className={`mb-8 max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {heading && (
        <h2 className="text-2xl font-bold text-ink sm:text-3xl">{heading}</h2>
      )}
      {subheading && <p className="mt-3 text-muted">{subheading}</p>}
    </div>
  );
}
