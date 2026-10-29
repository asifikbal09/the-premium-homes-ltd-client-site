import Image from "next/image";

const BANDS = 8;

/**
 * The second photo opens over the first on hover, in horizontal bands that each grow downward
 * from their top edge, top band first (the same shutter as the section reveals), and folds back
 * on mouse-out. Each band is a clipped window onto the full-frame photo, so the picture is one
 * continuous image; the browser decodes it once and reuses it for every band.
 */
export function HoverShutter({
  src,
  sizes = "(min-width: 768px) 50vw, 100vw",
  armed = true,
}: {
  src: string;
  sizes?: string;
  /** Mount the bands only once the pointer has entered the section, so nothing is loaded or painted before. */
  armed?: boolean;
}) {
  if (!armed) return null;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {Array.from({ length: BANDS }, (_, i) => (
        <div
          key={i}
          className="absolute inset-x-0 overflow-hidden [clip-path:inset(0_0_100%_0)] transition-[clip-path] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[clip-path:inset(0_0_0_0)]"
          style={{
            top: `${(i * 100) / BANDS}%`,
            height: `calc(${100 / BANDS}% + 1px)`,
            transitionDelay: `${i * 45}ms`,
          }}
        >
          <div
            className="absolute inset-x-0"
            // The band is 1px taller than an eighth to hide seams; offset by the true eighth so the bands line up.
            style={{
              top: `calc(${-i} * (100% - 1px))`,
              height: `calc(${BANDS} * (100% - 1px))`,
            }}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes={sizes}
              className="object-cover"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
