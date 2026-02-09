// frontend/src/components/forms/SignupForm/parts/RequiredBadge.tsx
type Props = { kind: "section" | "field" | "optional" };

export function RequiredBadge({ kind }: Props) {
  if (kind === "section") {
    return (
      <span className="ml-2 inline-flex items-center rounded-md bg-danger px-2 py-0.5 text-xs text-white">
        必須
      </span>
    );
  }
  if (kind === "field") {
    return <span className="ml-1 text-danger">*</span>;
  }
  return (
    <span className="ml-2 inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-muted-fg">
      任意
    </span>
  );
}
