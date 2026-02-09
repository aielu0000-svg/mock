// frontend/src/components/forms/SignupForm/parts/RequiredBadge.tsx
type Props = { kind: "section" | "field" | "optional" };

export function RequiredBadge({ kind }: Props) {
  if (kind === "section") {
    return <span className="section-required">必須</span>;
  }
  if (kind === "field") {
    return <span className="required-asterisk">*</span>;
  }
  return (
    <span className="badge badge--optional">任意</span>
  );
}
