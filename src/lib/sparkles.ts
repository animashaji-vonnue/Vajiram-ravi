/**
 * Twinkling sparkles drawn on a canvas, after the "Good times can last forever" section on teak.io:
 * small diamonds in a few yellows pop up at random spots, grow, then shrink and fade, while new ones keep
 * appearing, so the area glitters without anything falling or flying. Colours are read from the theme's
 * tokens. The animation only runs while the canvas is on screen.
 */

/** The theme colours the sparkles come in, from pale to deep. */
const COLOURS = ["--color-gold-200", "--color-lemon", "--color-gold-600"];
/** How many sparkles twinkle at once, and the most there can be with a burst on top. */
const AMBIENT = 44;
const MAX_SPARKLES = 90;
/** A sparkle's life (seconds) and size (the diamond's side, px). */
const LIFE = [0.9, 2] as const;
const SIZE = [5, 17] as const;
/** How fast a sparkle drifts upwards while it shows (px per second). */
const RISE = 8;

type Sparkle = { x: number; y: number; size: number; colour: string; age: number; life: number };

export type Sparkles = {
  /**
   * Adds a ring of sparkles around a point, in canvas pixels: roughly on an ellipse `radiusX` by
   * `radiusY` round it, so they gather at the edges of whatever sits there rather than behind it.
   */
  burst: (x: number, y: number, amount: number, radiusX: number, radiusY: number) => void;
  destroy: () => void;
};

const random = (min: number, max: number) => min + Math.random() * (max - min);

/** Draws sparkles on `canvas`, which is sized to its own box and redrawn sharp at any zoom. */
export function createSparkles(canvas: HTMLCanvasElement): Sparkles {
  const context = canvas.getContext("2d");
  const styles = getComputedStyle(document.documentElement);
  const colours = COLOURS.map((name) => styles.getPropertyValue(name).trim()).filter(Boolean);
  let sparkles: Sparkle[] = [];
  let width = 0;
  let height = 0;
  let frame = 0;
  let last = 0;
  let visible = false;

  // The canvas works in its own CSS pixels; its backing store matches the pixels it covers on screen.
  const size = () => {
    const box = canvas.getBoundingClientRect();
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    const scale = (box.width / (width || 1)) * window.devicePixelRatio;
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    context?.setTransform(scale, 0, 0, scale, 0, 0);
  };
  size();
  window.addEventListener("resize", size);

  const add = (x: number, y: number) => {
    if (sparkles.length >= MAX_SPARKLES) return;
    sparkles.push({
      x,
      y,
      size: random(SIZE[0], SIZE[1]),
      colour: colours[Math.floor(Math.random() * colours.length)] || "#f8d040",
      age: 0,
      life: random(LIFE[0], LIFE[1]),
    });
  };

  const draw = (now: number) => {
    const seconds = Math.min(now - last, 50) / 1000;
    last = now;
    if (!context) return;
    context.clearRect(0, 0, width, height);
    // Keep the ambient twinkle topped up, a few at a time so they don't appear in step.
    if (sparkles.length < AMBIENT && Math.random() < 0.6) add(random(0, width), random(0, height));
    sparkles = sparkles.filter((sparkle) => {
      sparkle.age += seconds;
      const t = sparkle.age / sparkle.life;
      if (t >= 1) return false;
      sparkle.y -= RISE * seconds;
      // Pops up quickly, holds, then shrinks away: the size follows a sine with a fast start.
      const grow = Math.sin(Math.PI * t) ** 0.6;
      const side = sparkle.size * grow;
      context.save();
      context.globalAlpha = Math.min(1, grow * 1.15);
      context.translate(sparkle.x, sparkle.y);
      context.rotate(Math.PI / 4);
      context.fillStyle = sparkle.colour;
      context.fillRect(-side / 2, -side / 2, side, side);
      context.restore();
      return true;
    });
    frame = visible ? requestAnimationFrame(draw) : 0;
  };

  const run = () => {
    if (frame || !visible) return;
    last = performance.now();
    frame = requestAnimationFrame(draw);
  };

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) run();
  });
  observer.observe(canvas);

  return {
    burst(x, y, amount, radiusX, radiusY) {
      for (let i = 0; i < amount; i++) {
        const angle = random(0, Math.PI * 2);
        const reach = random(0.9, 1.3);
        add(x + Math.cos(angle) * radiusX * reach, y + Math.sin(angle) * radiusY * reach);
      }
      run();
    },
    destroy() {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", size);
      sparkles = [];
    },
  };
}
