import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMember } from '../api/getMember';
import { MemberView } from '../api/members.types';
import { AppShell } from '../../../shared/components/layout/AppShell';

const PREFILL_KEY = (window as Window & { SIGNUP_PREFILL_KEY?: string }).SIGNUP_PREFILL_KEY ?? 'signupPrefill';

export function MemberEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [view, setView] = useState<MemberView | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!id) return;
    setHasError(false);
    getMember(id)
      .then(setView)
      .catch(() => {
        setHasError(true);
        setView(null);
      });
  }, [id]);

  const display = useMemo(() => {
    if (!view) return null;

    const nameKanji = `${view.name.lastKanji} ${view.name.firstKanji}`.trim();
    const nameKana = `${view.name.lastKana} ${view.name.firstKana}`.trim();
    const birth = [view.birthDate.year, view.birthDate.month, view.birthDate.day].filter(Boolean).join('-');
    const zip = `${view.address.zip1}-${view.address.zip2}`.replace(/^-|-$/g, '');
    const addr = [view.address.prefecture, view.address.line1, view.address.line2].filter(Boolean).join(' ');
    const tel = [view.phone.tel1, view.phone.tel2, view.phone.tel3].filter(Boolean).join('-');

    return { nameKanji, nameKana, birth, zip, addr, tel };
  }, [view]);

  const onBackToSignup = () => {
    if (!view) return;
    sessionStorage.setItem(PREFILL_KEY, JSON.stringify(toSignupPrefill(view)));
    navigate('/signup');
  };

  return (
    <AppShell>
      <h1 className="page-title">登録情報の編集（モック）</h1>
      <p className="help-text">
        この画面は、登録直後に <code>/api/members/{'{id}'}</code> を取得して表示しています（DBなし・メモリ保持）。
      </p>

      {!id && <p className="help-text">IDが取得できませんでした。URLをご確認ください。</p>}
      {hasError && <p className="help-text">登録情報が見つかりません（サーバ再起動後など）。</p>}
      {!display && !hasError && <p className="help-text">読み込み中...</p>}

      {display && view && (
        <section className="member-section">
          <h2 className="section-title">登録内容</h2>
          <dl className="member-dl">
            <dt>氏名（漢字）</dt><dd>{display.nameKanji}</dd>
            <dt>氏名（カナ）</dt><dd>{display.nameKana}</dd>
            <dt>生年月日</dt><dd>{display.birth}</dd>
            <dt>性別</dt><dd>{view.gender}</dd>
            <dt>メール</dt><dd>{view.email}</dd>
            <dt>郵便番号</dt><dd>{display.zip}</dd>
            <dt>住所</dt><dd>{display.addr}</dd>
            <dt>電話</dt><dd>{display.tel}</dd>
            <dt>お知らせメール</dt><dd>{view.newsletter}</dd>
          </dl>

          <div className="form-actions">
            <button type="button" id="goSignupPrefill" className="button button--primary" onClick={onBackToSignup}>
              会員情報入力へ（基本情報は固定表示）
            </button>
            <p className="help-text">
              ※モック用：sessionStorage にデータを入れて /signup へ遷移します。パスワード・お知らせメールは編集可能です。
            </p>
          </div>
        </section>
      )}
    </AppShell>
  );
}

function toSignupPrefill(d: MemberView) {
  const out: Record<string, string> = {};

  out.lastNameKanji = d.name.lastKanji ?? '';
  out.firstNameKanji = d.name.firstKanji ?? '';
  out.lastNameKana = d.name.lastKana ?? '';
  out.firstNameKana = d.name.firstKana ?? '';

  const y = d.birthDate.year;
  const m = d.birthDate.month;
  const day = d.birthDate.day;
  if (y && m && day) {
    out.birthdate = `${pad4(y)}-${pad2(m)}-${pad2(day)}`;
  }

  out.gender = d.gender ?? '';
  out.email = d.email ?? '';
  out.zip1 = d.address.zip1 ?? '';
  out.zip2 = d.address.zip2 ?? '';
  out.prefecture = d.address.prefecture ?? '';
  out.addressLine1 = d.address.line1 ?? '';
  out.addressLine2 = d.address.line2 ?? '';
  out.tel1 = d.phone.tel1 ?? '';
  out.tel2 = d.phone.tel2 ?? '';
  out.tel3 = d.phone.tel3 ?? '';

  return out;
}

function pad2(v: string) {
  return v.length === 1 ? `0${v}` : v;
}

function pad4(v: string) {
  if (v.length >= 4) return v;
  return (`0000${v}`).slice(-4);
}
