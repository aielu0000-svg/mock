// frontend/src/pages/MemberEditPage.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMember } from "../api/members";
import type { MemberDto } from "../api/types";

export function MemberEditPage() {
  const { id } = useParams();
  const [data, setData] = useState<MemberDto | null>(null);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    if (!id) return;
    setErr("");
    getMember(id)
      .then(setData)
      .catch(() => setErr("取得に失敗しました。"));
  }, [id]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">会員情報（編集）</h1>

      <div className="text-sm text-muted-fg">
        <Link className="underline" to="/signup">
          戻る（Signup）
        </Link>
      </div>

      {err ? (
        <div className="rounded-md border border-danger/40 bg-warn-bg p-3 text-sm text-danger">{err}</div>
      ) : !data ? (
        <div className="text-sm text-muted-fg">読み込み中...</div>
      ) : (
        <pre className="rounded-md border border-border bg-muted p-3 text-xs overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
