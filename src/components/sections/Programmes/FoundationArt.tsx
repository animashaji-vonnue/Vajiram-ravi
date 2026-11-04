import Image from "next/image";

/**
 * The foundation course's illustration (design 3596:4127): line drawings of books, an open book, a domed
 * building and a pencil on a parchment ground, layered as in the design. Positions are in the 444 × 232
 * picture area; the pencil is turned 24°.
 */
const LAYERS = [
  { src: "dome", left: 196, top: 26, width: 152, height: 152 },
  { src: "ground", left: 35, top: 193.25, width: 377, height: 1.5 },
  { src: "building", left: 185.2, top: 48.2, width: 186.6, height: 131.6 },
  { src: "books", left: 59.6, top: 131.1, width: 148.3, height: 59.8 },
  { src: "open-book", left: 71.15, top: 95.9, width: 116.7, height: 42.9398 },
  { src: "outline", left: 33.23, top: 43.25, width: 361.54, height: 150.5 },
];

export default function FoundationArt() {
  return (
    <div className="absolute inset-0 bg-parchment">
      <Image src="/images/programmes/foundation/base.svg" alt="" width={444} height={232} className="absolute inset-0" />
      {LAYERS.map((layer) => (
        <Image
          key={layer.src}
          src={`/images/programmes/foundation/${layer.src}.svg`}
          alt=""
          width={layer.width}
          height={layer.height}
          className="absolute max-w-none"
          style={{ left: layer.left, top: layer.top }}
        />
      ))}
      <span className="absolute top-[160.8px] left-[318.9px] h-[43px] w-[8px] rotate-24">
        <Image
          src="/images/programmes/foundation/pencil.svg"
          alt=""
          width={10.4125}
          height={45.2652}
          className="absolute top-[-0.7px] left-[-1.21px] max-w-none"
        />
      </span>
    </div>
  );
}
