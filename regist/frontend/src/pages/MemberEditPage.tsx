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
    <>
      <h1 className="page-title">会員情報（編集）</h1>

      <div className="notice">
        <p className="notice__text">登録内容を確認してください。</p>
        <ul className="notice__list">
          <li>編集内容の保存はこの画面で行います。</li>
          <li>入力内容が不明な場合は前の画面に戻れます。</li>
        </ul>
      </div>

      <div className="help-text">
        <Link to="/signup">戻る（会員登録）</Link>
      </div>

      {err ? (
        <div className="form-error-summary is-visible">{err}</div>
      ) : !data ? (
        <div className="help-text">読み込み中...</div>
      ) : (
        <div className="signup-form">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </>
  );
}
