import Image from "next/image";

export function Brand() {
  return (
    <a className="brand" href="#top" aria-label="BeSe Tech home">
      <Image
        className="brand-mark"
        src="/logo.png"
        alt=""
        width={42}
        height={42}
        priority
      />
      <span>BeSe <strong>Tech</strong></span>
    </a>
  );
}
