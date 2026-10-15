// Decorative gold/green band shown directly above the footer.
// The SVG is one 163×77 tile with a transparent background, tiled in 2 rows over the footer colour.
export function LifeAtTphlPatternStrip() {
  return (
    <div
      aria-hidden="true"
      className="w-full h-[104px] sm:h-[154px] bg-[#05261e] bg-repeat bg-left-top"
      style={{
        backgroundImage: "url('/image/life-at-tphl/Group%202147229298.svg')",
        backgroundSize: "auto 50%",
      }}
    />
  );
}
