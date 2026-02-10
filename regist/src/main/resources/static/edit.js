(() => {
  "use strict";

  const KEY = (typeof window !== "undefined" && window.SIGNUP_PREFILL_KEY) ? window.SIGNUP_PREFILL_KEY : "signupPrefill";

  function initMemberEditPage() {
    const path = location.pathname; // /member/{id}/edit
    const m = path.match(/^\/(?:legacy\/)?member\/([^/]+)\/edit\/?$/);
    const id = m ? decodeURIComponent(m[1]) : null;

    const root = document.getElementById("memberView");
    const btn = document.getElementById("goSignupPrefill");

    if (!root || root.dataset.memberEditInitDone === "1") return;
    root.dataset.memberEditInitDone = "1";

    if (!id) {
      root.textContent = "IDが取得できませんでした。URLをご確認ください。";
      if (btn) btn.disabled = true;
      return;
    }

    let current = null;

    if (btn) {
      btn.addEventListener("click", () => {
        if (!current) {
          alert("登録情報が読み込めていません。少し待ってから再度お試しください。");
          return;
        }
        const prefill = toSignupPrefill(current);
        sessionStorage.setItem(KEY, JSON.stringify(prefill));
        location.href = "/signup";
      });
    }

    load(id);

    async function load(memberId) {
      try {
        const res = await fetch(`/api/members/${encodeURIComponent(memberId)}`, {
          headers: { "Accept": "application/json" },
        });

        if (!res.ok) {
          root.textContent = res.status === 404
            ? "登録情報が見つかりません（サーバ再起動後など）。"
            : `取得に失敗しました（HTTP ${res.status}）`;
          if (btn) btn.disabled = true;
          return;
        }

        const data = await res.json();
        current = data;
        root.innerHTML = render(data);
        if (btn) btn.disabled = false;
      } catch (e) {
        root.textContent = "通信に失敗しました。";
        if (btn) btn.disabled = true;
      }
    }
  }

  function esc(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function render(d) {
    const nameKanji = `${d?.name?.lastKanji ?? ""} ${d?.name?.firstKanji ?? ""}`.trim();
    const nameKana = `${d?.name?.lastKana ?? ""} ${d?.name?.firstKana ?? ""}`.trim();
    const birth = [d?.birthDate?.year, d?.birthDate?.month, d?.birthDate?.day].filter(Boolean).join("-");
    const zip = `${d?.address?.zip1 ?? ""}-${d?.address?.zip2 ?? ""}`.replace(/^-|-$/g, "");
    const addr = [d?.address?.prefecture, d?.address?.line1, d?.address?.line2].filter(Boolean).join(" ");
    const tel = [d?.phone?.tel1, d?.phone?.tel2, d?.phone?.tel3].filter(Boolean).join("-");

    return `
      <dl class="member-dl">
        <dt>氏名（漢字）</dt><dd>${esc(nameKanji)}</dd>
        <dt>氏名（カナ）</dt><dd>${esc(nameKana)}</dd>
        <dt>生年月日</dt><dd>${esc(birth)}</dd>
        <dt>性別</dt><dd>${esc(d?.gender)}</dd>
        <dt>メール</dt><dd>${esc(d?.email)}</dd>
        <dt>郵便番号</dt><dd>${esc(zip)}</dd>
        <dt>住所</dt><dd>${esc(addr)}</dd>
        <dt>電話</dt><dd>${esc(tel)}</dd>
        <dt>お知らせメール</dt><dd>${esc(d?.newsletter)}</dd>
      </dl>
    `;
  }

  function toSignupPrefill(d) {
    const out = {};
    out.lastNameKanji = d?.name?.lastKanji ?? "";
    out.firstNameKanji = d?.name?.firstKanji ?? "";
    out.lastNameKana = d?.name?.lastKana ?? "";
    out.firstNameKana = d?.name?.firstKana ?? "";

    const y = d?.birthDate?.year;
    const m = d?.birthDate?.month;
    const day = d?.birthDate?.day;
    if (y && m && day) {
      out.birthdate = `${pad4(y)}-${pad2(m)}-${pad2(day)}`;
    }

    out.gender = d?.gender ?? "";
    out.email = d?.email ?? "";

    if (d?.address?.zip1 != null) out.zip1 = String(d.address.zip1);
    if (d?.address?.zip2 != null) out.zip2 = String(d.address.zip2);

    out.prefecture = d?.address?.prefecture ?? "";
    out.addressLine1 = d?.address?.line1 ?? "";
    out.addressLine2 = d?.address?.line2 ?? "";

    if (d?.phone?.tel1 != null) out.tel1 = String(d.phone.tel1);
    if (d?.phone?.tel2 != null) out.tel2 = String(d.phone.tel2);
    if (d?.phone?.tel3 != null) out.tel3 = String(d.phone.tel3);

    return out;
  }

  function pad2(v) {
    const n = String(v ?? "");
    return n.length === 1 ? `0${n}` : n;
  }

  function pad4(v) {
    const n = String(v ?? "");
    if (n.length >= 4) return n;
    return ("0000" + n).slice(-4);
  }

  window.initMemberEditPage = initMemberEditPage;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMemberEditPage, { once: true });
  } else {
    initMemberEditPage();
  }
})();
