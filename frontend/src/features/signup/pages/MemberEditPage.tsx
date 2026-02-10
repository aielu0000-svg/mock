import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMember } from '../api/getMember';
import { MemberView } from '../api/members.types';
import { AppShell } from '../../../shared/components/layout/AppShell';

export function MemberEditPage() {
  const { id } = useParams();
  const [view, setView] = useState<MemberView | null>(null);

  useEffect(() => {
    if (!id) return;
    getMember(id).then(setView).catch(() => setView(null));
  }, [id]);

  return (
    <AppShell>
      <h1 className="page-title">登録情報の編集（モック）</h1>
      {!view ? <p className="help-text">読み込み中...</p> : (
        <dl className="member-dl">
          <dt>氏名（漢字）</dt><dd>{view.name.lastKanji} {view.name.firstKanji}</dd>
          <dt>氏名（カナ）</dt><dd>{view.name.lastKana} {view.name.firstKana}</dd>
          <dt>メール</dt><dd>{view.email}</dd>
        </dl>
      )}
    </AppShell>
  );
}
