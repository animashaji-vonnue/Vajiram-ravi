"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { useInView } from "@/lib/useInView";

/*
 * A soft aurora across the top of the hero, after React Bits' "Aurora": a WebGL fragment shader of
 * flowing colour bands (ribbons whose edges are displaced by simplex noise) in the palette's saffron,
 * orange and burnt, screened over the mahogany. It drifts slowly with time and leans gently toward the
 * cursor. Raw WebGL 1, no dependencies.
 */

/** Share of a device pixel it is drawn at: the light is soft, so half resolution is plenty. */
const RESOLUTION = 0.5;
/** The widest drawing buffer, in pixels, whatever the screen. */
const MAX_BUFFER_WIDTH = 1440;
/**
 * Strength of the light (it is screened over the hero): its ribbons peak at about 25–35% of the colour,
 * the haze between them about 10–15%, so it stays subtle behind the heading.
 */
const STRENGTH = 0.36;
/** The eased pointer covers about 63% of the way to the cursor in this time, ms. */
const LAG = 900;
/** Where the light rests with no cursor over the hero (x across, y down the canvas, 0 to 1). */
const REST = { x: 0.5, y: 0.35 };
/** Its fade in once the first frame is drawn, ms. */
const FADE_IN = 1600;
const FINE_POINTER = "(hover: hover) and (pointer: fine)";

const VERTEX = "attribute vec2 aPos;void main(){gl_Position=vec4(aPos,0.0,1.0);}";

const FRAGMENT = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uRes;
uniform float uTime;
// The eased pointer: x across and y down the canvas (0 to 1), z how present it is (0 to 1).
uniform vec3 uPointer;
uniform float uStrength;

// 2D simplex noise (Ashima Arts / Ian McEwan, MIT).
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

const vec3 SAFFRON = vec3(0.957, 0.769, 0.188);
const vec3 ORANGE = vec3(0.898, 0.459, 0.071);
const vec3 BURNT = vec3(0.800, 0.333, 0.000);

vec3 ramp(float k) {
  k = clamp(k, 0.0, 1.0);
  return k < 0.5 ? mix(SAFFRON, ORANGE, k * 2.0) : mix(ORANGE, BURNT, k * 2.0 - 1.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  // Across in canvas heights (so the bands keep their size on wide screens); down from the hero's top.
  float x = uv.x * aspect;
  float y = 1.0 - uv.y;
  float t = uTime;

  // Near the cursor (sideways), weighted by how present it is.
  float dx = (x - uPointer.x * aspect) * 1.6;
  float pull = exp(-dx * dx) * uPointer.z;
  // The whole flow leans toward the cursor's side.
  float lean = (uPointer.x - 0.5) * 0.5 * uPointer.z;

  float n1 = snoise(vec2(x * 0.7 - lean + t * 0.035, t * 0.08));
  float n2 = snoise(vec2(x * 1.5 + lean * 0.5 - t * 0.05 + 7.3, t * 0.12 + 3.1));

  // The main band: light from the top down to a noise-displaced edge, with a bright ribbon along it;
  // near the cursor the edge reaches a little toward it.
  float edge = 0.36 + 0.13 * n1 + 0.05 * n2 + 0.1 * pull * (uPointer.y - ${REST.y.toFixed(2)});
  float body = 1.0 - smoothstep(edge - 0.12, edge + 0.18, y);
  float d1 = (y - edge) * 6.5;
  float crest = exp(-d1 * d1);
  // A fainter ribbon higher up, flowing the other way.
  float edge2 = 0.17 + 0.07 * n2 - 0.04 * n1;
  float d2 = (y - edge2) * 9.0;
  float crest2 = exp(-d2 * d2);

  float a = body * 0.32 + crest * 0.5 + crest2 * 0.22;
  // A slow swell along the bands, a touch more light toward the cursor.
  a *= 0.8 + 0.2 * snoise(vec2(x * 1.1 + t * 0.03 + 11.0, t * 0.06));
  a *= 1.0 + 0.2 * pull;
  // Gone before the foot of the canvas, so it never reaches the statue's plinth or the copy below.
  a *= 1.0 - smoothstep(0.5, 0.96, y);

  vec3 color = ramp(uv.x * 0.85 + 0.12 * n1 + 0.04);
  gl_FragColor = vec4(color * clamp(a, 0.0, 1.0) * uStrength, 1.0);
}
`;

type AuroraHandle = {
  setInView(inView: boolean): void;
  destroy(): void;
};

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
}

/** What is left of the intro curtain (layout/Preloader) before the hero's entrance, ms. */
function introLeft() {
  const root = document.documentElement;
  if (!root.classList.contains("intro")) return 0;
  return Math.max(0, (parseFloat(root.style.getPropertyValue("--intro")) || 0) - performance.now());
}

/** Starts the aurora in `host`, or returns null (and draws nothing) without WebGL. */
function startAurora(host: HTMLDivElement): AuroraHandle | null {
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: false,
    powerPreference: "low-power",
  });
  if (!gl) return null;
  const loseContext = () => gl.getExtension("WEBGL_lose_context")?.loseContext();

  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  const buffer = gl.createBuffer();
  const release = () => {
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    loseContext();
  };
  if (!vertex || !fragment || !program || !buffer) {
    release();
    return null;
  }
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    release();
    return null;
  }
  gl.useProgram(program);

  // One triangle over the whole canvas.
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, "uRes");
  const uTime = gl.getUniformLocation(program, "uTime");
  const uPointer = gl.getUniformLocation(program, "uPointer");
  gl.uniform1f(gl.getUniformLocation(program, "uStrength"), STRENGTH);
  gl.uniform2f(uRes, canvas.width, canvas.height);

  // Screened over the hero: black adds nothing. Hidden until the first frame is drawn.
  canvas.className = "block size-full opacity-0 mix-blend-screen transition-opacity ease-out";
  canvas.style.transitionDuration = `${FADE_IN}ms`;
  host.appendChild(canvas);

  const section = host.closest("section") ?? host;
  const finePointer = window.matchMedia(FINE_POINTER).matches;
  /** Seconds of drift; it only advances while the aurora runs, so it resumes where it paused. */
  let time = 12;
  let last = 0;
  let frame = 0;
  let running = false;
  let inView = false;
  let lost = false;
  const pointer = { x: REST.x, y: REST.y, z: 0 };
  const target = { x: REST.x, y: REST.y, z: 0 };
  /** The cursor's last screen position over the hero, or null. */
  let client: { x: number; y: number } | null = null;

  const fit = () => {
    const rect = host.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const scale = Math.min(RESOLUTION * (window.devicePixelRatio || 1), MAX_BUFFER_WIDTH / rect.width);
    const width = Math.max(1, Math.round(rect.width * scale));
    const height = Math.max(1, Math.round(rect.height * scale));
    if (canvas.width === width && canvas.height === height) return;
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
    gl.uniform2f(uRes, width, height);
    // Resizing clears the canvas: redraw at once if paused.
    if (!running) draw();
  };

  const draw = () => {
    gl.uniform1f(uTime, time);
    gl.uniform3f(uPointer, pointer.x, pointer.y, pointer.z);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const tick = (now: number) => {
    const dt = last ? Math.min(now - last, 50) : 16;
    last = now;
    time += dt / 1000;
    if (client) {
      // In canvas fractions, so the canvas zoom cancels out.
      const rect = host.getBoundingClientRect();
      target.x = Math.min(Math.max((client.x - rect.left) / rect.width, 0), 1);
      target.y = Math.min(Math.max((client.y - rect.top) / rect.height, 0), 1.2);
    }
    const k = 1 - Math.exp(-dt / LAG);
    pointer.x += (target.x - pointer.x) * k;
    pointer.y += (target.y - pointer.y) * k;
    pointer.z += (target.z - pointer.z) * k;
    draw();
    frame = requestAnimationFrame(tick);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    client = { x: event.clientX, y: event.clientY };
    target.z = 1;
  };
  const onPointerLeave = () => {
    client = null;
    target.x = REST.x;
    target.y = REST.y;
    target.z = 0;
  };

  // Runs only while the hero is on screen and the tab is visible; the pointer is heard only then.
  const update = () => {
    const should = inView && !lost && document.visibilityState === "visible";
    if (should === running) return;
    running = should;
    if (running) {
      last = 0;
      frame = requestAnimationFrame(tick);
      if (finePointer) {
        section.addEventListener("pointermove", onPointerMove, { passive: true });
        section.addEventListener("pointerleave", onPointerLeave);
      }
    } else {
      cancelAnimationFrame(frame);
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerleave", onPointerLeave);
      onPointerLeave();
    }
  };

  const onContextLost = () => {
    lost = true;
    update();
    canvas.style.opacity = "0";
  };
  canvas.addEventListener("webglcontextlost", onContextLost);
  document.addEventListener("visibilitychange", update);
  window.addEventListener("resize", fit);
  const resizer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(fit);
  resizer?.observe(host);

  fit();
  draw();
  // Fade in from the drawn frame, after the intro curtain when there is one.
  void getComputedStyle(canvas).opacity;
  canvas.style.transitionDelay = `${Math.round(introLeft())}ms`;
  canvas.style.opacity = "1";

  return {
    setInView(next) {
      inView = next;
      update();
    },
    destroy() {
      inView = false;
      update();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("resize", fit);
      resizer?.disconnect();
      release();
      canvas.remove();
    },
  };
}

/**
 * The aurora layer: 500px across the top of the hero, the full width of the band, behind the line art,
 * glow, statue and copy and above the background gradient. Its canvas is made on mount (a fresh one each
 * time, so a remount never meets a lost context) and drawn at half the device resolution. It runs only
 * while the hero is in view and the tab is visible, and hears the pointer (fine pointers only, on the
 * hero only) only then. With reduced motion, or without WebGL, it renders nothing and the hero's own
 * glow stays as it is. Decorative: aria-hidden, no pointer events, no layout.
 */
export default function Aurora() {
  const [ref, inView] = useInView<HTMLDivElement>({ once: false });
  const aurora = useRef<AuroraHandle | null>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host || prefersReducedMotion()) return;
    const handle = startAurora(host);
    aurora.current = handle;
    return () => {
      handle?.destroy();
      aurora.current = null;
    };
  }, [ref]);

  useEffect(() => {
    aurora.current?.setInView(inView);
  }, [inView]);

  return <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[500px]" />;
}
