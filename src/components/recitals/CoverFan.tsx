"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { issues, latestIssue } from "@/data/magazine";

/*
 * The fan of covers.
 *
 * Every cover now stands on the same baseline. They share a `bottom` and pivot from
 * `bottom center`, so the rotation lifts their corners without lifting their feet — the way
 * a hand of cards sits on a table. Previously each one had its own `top`, which left the
 * bottom edge ragged.
 *
 * On load the issues are dealt one at a time, outside in, so the newest lands last and on
 * top. On scroll the move runs backwards and the fan closes into a stack. Entrance and
 * scroll sit on two nested elements, because one element cannot have `animate` and `style`
 * driving the same property.
 */

/** Slightly past 1 on the third handle, so each card overshoots a little as it lands. */
const DEAL = [0.18, 0.89, 0.32, 1.12] as [number, number, number, number];
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

/** The line every cover stands on, as a share of the box height. */
const BASELINE = "7%";

type Leaf = {
  cover: string;
  label: string;
  left: string;
  width: string;
  rotate: number;
  /** How far this card sits from the centre line, as a share of its own width. */
  from: string;
  opacity: number;
  z: number;
  delay: number;
};

const LEAVES: Leaf[] = [
  { cover: issues[4].cover, label: issues[4].label, left: "4.2%", width: "20.5%", rotate: -12, from: "173%", opacity: 0.74, z: 10, delay: 0.1 },
  { cover: issues[2].cover, label: issues[2].label, left: "19.8%", width: "22.5%", rotate: -6, from: "84%", opacity: 0.9, z: 20, delay: 0.22 },
  { cover: issues[3].cover, label: issues[3].label, left: "75.8%", width: "20.5%", rotate: 12, from: "-176%", opacity: 0.74, z: 10, delay: 0.34 },
  { cover: issues[1].cover, label: issues[1].label, left: "57.9%", width: "22.5%", rotate: 6, from: "-85%", opacity: 0.9, z: 20, delay: 0.46 },
];

/** The lit edge down the spine side of a cover, and the shadow where the next one laps it. */
const EDGE =
  "after:pointer-events-none after:absolute after:inset-y-0 after:left-0 after:w-[3px] after:bg-[linear-gradient(to_right,rgba(255,255,255,.55),rgba(255,255,255,0))] after:content-['']";

function Card({ leaf, progress, reduce }: { leaf: Leaf; progress: MotionValue<number>; reduce: boolean | null }) {
  // Closing back into a stack as the hero scrolls away.
  const x = useTransform(progress, [0, 1], ["0%", leaf.from]);
  const rotate = useTransform(progress, [0, 1], [0, -leaf.rotate]);
  const y = useTransform(progress, [0, 1], [0, 24]);

  return (
    <span className="absolute block" style={{ left: leaf.left, bottom: BASELINE, width: leaf.width, zIndex: leaf.z }}>
      <motion.span
        className="block"
        style={reduce ? { transformOrigin: "bottom center" } : { x, rotate, y, transformOrigin: "bottom center" }}
      >
        <motion.span
          className={`relative block overflow-hidden rounded-[3px] shadow-[0_16px_26px_-14px_rgba(74,42,18,.5)] ${EDGE}`}
          style={{ transformOrigin: "bottom center" }}
          initial={reduce ? false : { opacity: 0, x: leaf.from, rotate: 0, y: 104, scale: 0.9 }}
          animate={{ opacity: leaf.opacity, x: "0%", rotate: leaf.rotate, y: 0, scale: 1 }}
          transition={{ duration: 0.85, delay: leaf.delay, ease: DEAL }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={leaf.cover}
            alt=""
            width={260}
            height={336}
            decoding="async"
            className="aspect-[260/336] w-full object-cover"
          />
        </motion.span>
      </motion.span>
    </span>
  );
}

export default function CoverFan() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 25%", "end start"] });
  const centreY = useTransform(scrollYProgress, [0, 1], [0, 24]);

  // The box's width is capped by viewport height as well as width. `max-height` alone would
  // shorten the box without shrinking the covers in it, and they would spill over the masthead.
  return (
    <div ref={ref} className="relative aspect-[815/322] w-[min(860px,68vw,76vh)] shrink-0">
      {/* Contact shadow along the baseline the covers stand on. */}
      <motion.span
        className="absolute bottom-[4%] left-[13%] block h-[8%] w-[74%] rounded-[50%] bg-[#6d3a12] blur-[16px]"
        aria-hidden="true"
        initial={reduce ? false : { opacity: 0, scaleX: 0.55 }}
        animate={{ opacity: 0.34, scaleX: 1 }}
        transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
      />

      {LEAVES.map((leaf) => (
        <Card key={leaf.label} leaf={leaf} progress={scrollYProgress} reduce={reduce} />
      ))}

      {/* The newest issue is dealt last, so it lands on top of the deck. */}
      <span className="absolute left-[37.5%] z-30 block w-[25%]" style={{ bottom: BASELINE }}>
        <motion.span
          className="block"
          style={reduce ? { transformOrigin: "bottom center" } : { y: centreY, transformOrigin: "bottom center" }}
        >
          <motion.div
            style={{ transformOrigin: "bottom center" }}
            initial={reduce ? false : { opacity: 0, y: 112, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.6, ease: DEAL }}
          >
            <a href={latestIssue.pdf} className="group/cover relative block" aria-label={`Read the ${latestIssue.label} issue`}>
              {/*
               * No "Latest" flag on the hero cover. The fan already reads newest-first
               * and the standfirst says the month, so the badge was labelling something
               * the picture had said more clearly — and it sat on the masthead of the
               * cover art, which is the one part of that image worth seeing whole. The
               * archive cards keep theirs: there it marks one issue out of eighty-nine,
               * which is a job worth doing.
               */}
              <span className={`relative block overflow-hidden rounded-[3px] ${EDGE}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={latestIssue.cover}
                  alt={`${latestIssue.label} cover of The Recitals`}
                  width={260}
                  height={336}
                  decoding="async"
                  className="aspect-[260/336] w-full object-cover"
                />
              </span>
              <span
                className="pointer-events-none absolute inset-0 rounded-[3px] shadow-[0_30px_46px_-18px_rgba(74,42,18,.58)] [transition:box-shadow_.5s_var(--ease-settle)] group-hover/cover:shadow-[0_42px_60px_-20px_rgba(74,42,18,.64)]"
                aria-hidden="true"
              />
            </a>
          </motion.div>
        </motion.span>
      </span>
    </div>
  );
}
