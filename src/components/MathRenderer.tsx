import { InlineMath, BlockMath } from "react-katex";

export default function MathRenderer({
  children,
  isBlock = false,
}: {
  children: string;
  isBlock?: boolean;
}) {
  if (isBlock) {
    return <BlockMath math={children} />;
  }
  return <InlineMath math={children} />;
}
