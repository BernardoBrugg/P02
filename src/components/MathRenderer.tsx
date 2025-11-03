import { InlineMath, BlockMath } from "react-katex";

export default function MathRenderer({
  math,
  isBlock = false,
}: {
  math: string;
  isBlock?: boolean;
}) {
  const symbols: { [key: string]: string } = {
    "\\lambda": "λ",
    "\\mu": "μ",
    "\\rho": "ρ",
    L_q: "L<sub>q</sub>",
    W_q: "W<sub>q</sub>",
  };
  const symbol = symbols[math];
  if (symbol) {
    return <span dangerouslySetInnerHTML={{ __html: symbol }} />;
  }
  if (isBlock) {
    return <BlockMath math={math} />;
  }
  return <InlineMath math={math} />;
}
