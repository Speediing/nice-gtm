export function BrandLockup({
  size = "md",
}: {
  size?: "sm" | "md" | "lg";
}) {
  return (
    <div className={`brand-lockup brand-lockup-${size}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/nice-wordmark.svg"
        alt="NiCE"
        className="brand-nice"
        width="77"
        height="28"
      />
      <span className="brand-times" aria-hidden>
        ×
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/spacexai.svg"
        alt="SpaceXAI"
        className="brand-sxai"
        width="129"
        height="16"
      />
    </div>
  );
}
