import type { SlideConfig } from "./CinematicScroll";

/**
 * story.webp transparent bounds (measured precisely):
 *   Left trim: 19.0%,  Right trim: 19.0%
 *   Top trim:  19.7%,  Bottom trim: 22.5%
 *
 * Strategy: crop transparent edges with negative margins so the
 * rendered container matches the visible oval, then flowers position
 * relative to the real frame edges.
 */
export function createCoupleStorySlide(): SlideConfig {
  return {
    id: "couple-story",
    refCount: 3,
    exitOrder: [
      { refIndex: 1, type: "flower" },
      { refIndex: 2, type: "flower" },
      { refIndex: 0, type: "frame" },
    ],
    enterOrder: [
      { refIndex: 0, type: "frame" },
      { refIndex: 1, type: "flower" },
      { refIndex: 2, type: "flower" },
    ],
    render: (refs) => (
      <div ref={refs[0]} className="absolute inset-0 z-30 flex flex-col items-center justify-center">
        {/* 
          Outer wrapper: we scale up the image to fill the width we WANT (85% of viewport),
          then clip the transparent padding using negative margins.
          
          Logic:
          - We want the visible oval to be ~85% container width
          - The oval occupies 62% of the image width (100 - 19 - 19 = 62%)
          - So the raw image needs to be: 85 / 0.62 ≈ 137% wide
          - Negative horizontal margin: 19% of 137% ≈ -26% each side to crop
          - Top margin: -19.7% of 137% ≈ -27%
          - Bottom margin: -22.5% of 137% ≈ -31%
        */}
        <div
          className="relative origin-center animate-float"
          style={{
            width: "100%",
            marginTop: "-5%",
            marginBottom: "-5%",
          }}
        >
          {/* Frame image — raw size, let it be 100% of the outer div */}
          <img
            src="/assets/frame/story_11zon.webp"
            alt=""
            onError={(e) => { e.currentTarget.src = "/assets/frame/story.webp"; }}
            className="h-auto w-full animate-frame-pulse drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
          />

          {/*
            Text overlay — now `inset-0` is relative to the FULL image (including transparent).
            The visible white oval inner area starts after the lace border:
            - Horizontal padding: ~25% (19% transparent + ~6% lace width)
            - Vertical: top ~24%, bottom ~28%
          */}
        
          {/* 
            Flowers — positioned relative to the full image coordinate space.
            To place at the top-left CORNER of the visible oval (at ~19% from left, 19.7% from top):
            we offset flowers so they overlap that corner.
          */}
          <div
            ref={refs[1]}
            className="absolute z-10 pointer-events-none"
            style={{ top: "10%", left: "-20%", width: "82%", aspectRatio: "1" }}
          >
            <img 
              src="/assets/flowers/flower-new-3.webp"
              alt="" 
              onError={(e) => { e.currentTarget.src = "/assets/flowers/flower-new-3.webp"; }}
              className="absolute inset-0 h-full w-full object-contain animate-zoom-in-out" 
            />
          </div>
          <div
            ref={refs[2]}
            className="absolute z-10 pointer-events-none"
            style={{ bottom: "12%", right: "-20%", width: "82%", aspectRatio: "1" }}
          >
            <img 
              src="/assets/flowers/flower-new-3.webp"
              alt="" 
              onError={(e) => { e.currentTarget.src = "/assets/flowers/flower-new-3.webp"; }}
              className="absolute inset-0 h-full w-full object-contain animate-zoom-in-out-delayed" 
            />
          </div>
        </div>
      </div>
    ),
  };
}
