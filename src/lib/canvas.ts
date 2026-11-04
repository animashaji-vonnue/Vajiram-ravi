/**
 * The homepage is designed as a fixed 1440px canvas (rebuilt 1:1 from Figma).
 * On narrower viewports the root element is zoomed down so the whole canvas fits.
 */
export const CANVAS_WIDTH = 1440;

/**
 * Routes that are not part of the fixed canvas and must render at true size.
 * The styles kit is one: zooming it would misreport every type size on the page.
 */
const UNZOOMED = /^\/kit(\/|$)/;

/** Re-fits the canvas to the current viewport and returns the zoom factor applied. */
export function fitCanvas(): number {
  const root = document.documentElement;
  root.style.zoom = "";
  if (UNZOOMED.test(window.location.pathname)) return 1;
  const viewport = root.clientWidth || window.innerWidth;
  const zoom = Math.min(1, viewport / CANVAS_WIDTH);
  if (zoom < 1) root.style.zoom = String(zoom);
  return zoom;
}

/** Inline <head> version of fitCanvas, so the very first paint is already scaled. */
export const fitCanvasScript = `(function(){var p=location.pathname;if(p==="/kit"||p.indexOf("/kit/")===0)return;var r=document.documentElement,w=r.clientWidth||innerWidth,z=Math.min(1,w/${CANVAS_WIDTH});if(z<1)r.style.zoom=String(z)})();`;

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
