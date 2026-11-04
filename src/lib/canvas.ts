/**
 * The homepage is designed as a fixed 1440px canvas (rebuilt 1:1 from Figma).
 * On narrower viewports the root element is zoomed down so the whole canvas fits. Wider viewports
 * keep everything at its real size; sections that should use the extra width do so themselves.
 */
export const CANVAS_WIDTH = 1440;

/**
 * Re-fits the canvas to the current viewport and returns the zoom factor applied. Also sets `--vh` and
 * `--vw`, the window's height and width in canvas pixels, which CSS uses to place things against the window (the
 * hero's opening animation starts the emblem in the middle of it).
 */
export function fitCanvas(): number {
  const root = document.documentElement;
  root.style.zoom = "";
  const viewport = root.clientWidth || window.innerWidth;
  const zoom = Math.min(1, viewport / CANVAS_WIDTH);
  if (zoom < 1) root.style.zoom = String(zoom);
  root.style.setProperty("--vh", `${window.innerHeight / zoom}px`);
  root.style.setProperty("--vw", `${viewport / zoom}px`);
  return zoom;
}

/** Inline <head> version of fitCanvas, so the very first paint is already scaled. */
export const fitCanvasScript = `(function(){var r=document.documentElement,w=r.clientWidth||innerWidth,z=Math.min(1,w/${CANVAS_WIDTH});if(z<1)r.style.zoom=String(z);r.style.setProperty("--vh",innerHeight/z+"px");r.style.setProperty("--vw",w/z+"px")})();`;

/** Current canvas zoom. Pointer deltas are divided by it so drags track the pointer exactly. */
export function getCanvasZoom(): number {
  return parseFloat(document.documentElement.style.zoom) || 1;
}

/** Distance from the viewport top to an element, in canvas pixels. */
export function canvasTop(el: HTMLElement): number {
  const rect = el.getBoundingClientRect();
  const scale = rect.width && el.offsetWidth ? rect.width / el.offsetWidth : 1;
  return rect.top / scale;
}
