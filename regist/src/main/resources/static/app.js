// src/main/resources/static/app.js
(() => {
  "use strict";

  const ICON_HIDE =
    'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24"><path d="m644 628-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660 556q0 20-4 37.5T644 628Zm128 126-58-56q38-29 67.5-63.5T832 556q-50-101-143.5-160.5T480 336q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920 556q-23 59-60.5 109.5T772 754Zm20 246L624 834q-35 11-70.5 16.5T480 856q-151 0-269-83.5T40 556q21-53 53-98.5t73-81.5L56 264l56-56 736 736-56 56ZM222 432q-29 26-53 57t-41 67q50 101 143.5 160.5T480 776q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300 556q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/></svg>';
  const ICON_SHOW =
    'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24"><path d="M480 736q75 0 127.5-52.5T660 556q0-75-52.5-127.5T480 376q-75 0-127.5 52.5T300 556q0 75 52.5 127.5T480 736Zm0-72q-45 0-76.5-31.5T372 556q0-45 31.5-76.5T480 448q45 0 76.5 31.5T588 556q0 45-31.5 76.5T480 664Zm0 192q-146 0-266-81.5T40 556q54-137 174-218.5T480 256q146 0 266 81.5T920 556q-54 137-174 218.5T480 856Zm0-300Zm0 220q113 0 207.5-59.5T832 556q-50-101-144.5-160.5T480 336q-113 0-207.5 59.5T128 556q50 101 144.5 160.5T480 776Z"/></svg>';

  const qs = (id) => document.getElementById(id);

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  // ------------------------------
  // Password toggle: both fields switch together (元コード準拠)
  // ------------------------------
  function bindPasswordTogglePair() {
    const passEl = qs("passWord");
    const confirmEl = qs("resultPassword");
    const btn1 = qs("passwordToggle");
    const btn2 = qs("passwordToggle2");

    if (!passEl || !confirmEl || !btn1 || !btn2) return;

    const ensureImg = (btn) => {
      let img = btn.querySelector("img");
      if (!img) {
        img = document.createElement("img");
        btn.appendChild(img);
      }
      img.className = "pw-visibility__img";
      img.alt = "";
      img.setAttribute("aria-hidden", "true");
      img.draggable = false;
      return img;
    };

    const img1 = ensureImg(btn1);
    const img2 = ensureImg(btn2);

    const sync = () => {
      const visible = passEl.type === "text";
      const icon = visible ? ICON_SHOW : ICON_HIDE;
      img1.src = icon;
      img2.src = icon;

      btn1.classList.toggle("is-visible", visible);
      btn2.classList.toggle("is-visible", visible);

      btn1.setAttribute("aria-pressed", visible ? "true" : "false");
      btn2.setAttribute("aria-pressed", visible ? "true" : "false");
      btn1.setAttribute("aria-label", visible ? "パスワードを隠す" : "パスワードを表示");
      btn2.setAttribute("aria-label", visible ? "パスワード確認用を隠す" : "パスワード確認用を表示");
    };

    const setVisible = (visible) => {
      passEl.type = visible ? "text" : "password";
      confirmEl.type = visible ? "text" : "password";
      sync();
    };

    const toggle = () => setVisible(passEl.type === "password");

    // 旧ハンドラが残っても勝つ（保険）
    const clickHandler = (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      toggle();
    };

    btn1.addEventListener("click", clickHandler, { capture: true });
    btn2.addEventListener("click", clickHandler, { capture: true });

    setVisible(false);
  }

  // ------------------------------
  // Password rules + error messages (元コード準拠)
  // ------------------------------
  function bindPasswordValidation() {
    const form = qs("signupForm");
    const pw = qs("passWord");
    const confirm = qs("resultPassword");
    if (!pw || !confirm) return;

    const numEl = qs("numberCheck");
    const alphaEl = qs("charCheck");
    const symEl = qs("codeCheck");

    const pwErrWrap = qs("pwErrPassword");
    const pwReqMsg = qs("requiredErrorMessageByPassWord");

    const confirmErrWrap = qs("pwErrConfirm");
    const confirmReqMsg = qs("requiredErrorMessageByResultPassword");

    const confirmFieldErr = document.querySelector('.field-error[data-error-for="passwordConfirm"]');

    const reNum = /[0-9]/;
    const reAlpha = /[A-Za-z]/;
    const reSym = /[-!"#$%&'()*+,.\/\/:;<=>?@\[\]^_`{|}~]/;

    // ★追加：登録ボタンを押した後だけ「必須エラー（赤い三角＋文言）」を表示する
    let submitted = false;

    const setStatus = (el, ok) => {
      if (!el) return;
      el.textContent = ok ? "○" : "×";
      el.classList.toggle("is-ok", ok);
    };

    const showReq = (wrap, msgEl, show) => {
      if (wrap) wrap.classList.toggle("is-visible", show);
      if (msgEl) {
        // signup.html のインラインJSが style.display を直接書き換えるため、
        // こちらも style を上書きして確実に制御する。
        msgEl.style.display = show ? "inline" : "none";
        msgEl.classList.toggle("is-hidden", !show);
      }
    };

    const setConfirmMismatch = (message) => {
      if (confirmFieldErr) confirmFieldErr.textContent = message || "";
      confirm.setCustomValidity(message || "");
    };

    const updateRules = () => {
      const v = (pw.value || "").toString();
      setStatus(numEl, reNum.test(v));
      setStatus(alphaEl, reAlpha.test(v));
      setStatus(symEl, reSym.test(v));
    };

    const validateRequired = () => {
      // 送信前は必須エラーを一切出さない（初期表示や入力途中の常時表示を防ぐ）
      if (!submitted) {
        showReq(pwErrWrap, pwReqMsg, false);
        showReq(confirmErrWrap, confirmReqMsg, false);
        return;
      }
      showReq(pwErrWrap, pwReqMsg, (pw.value || "").trim() === "");
      showReq(confirmErrWrap, confirmReqMsg, (confirm.value || "").trim() === "");
    };

    const validateMatch = () => {
      if ((pw.value || "").trim() === "" || (confirm.value || "").trim() === "") {
        setConfirmMismatch("");
        return;
      }
      if (pw.value !== confirm.value) {
        setConfirmMismatch("パスワードが一致しません。");
      } else {
        setConfirmMismatch("");
      }
    };

    const runAll = () => {
      updateRules();
      validateRequired();
      validateMatch();
    };

    // ★重要：signup.html 内のインラインJSが password のエラー表示を勝手に出すため、
    // capture で先に止めてこちらの処理だけ動かす。
    const stopAndRun = (e) => {
      e.stopImmediatePropagation();
      runAll();
    };
    pw.addEventListener("input", stopAndRun, { capture: true });
    confirm.addEventListener("input", stopAndRun, { capture: true });
    pw.addEventListener("blur", stopAndRun, { capture: true });
    confirm.addEventListener("blur", stopAndRun, { capture: true });

    bindPasswordValidation._runAll = runAll;
    bindPasswordValidation._setSubmitted = (v) => {
      submitted = !!v;
      runAll();
    };

    // HTMLの required に合わせて name=password / name=passwordConfirm で送る必要があるため、
    // inputに name が無い場合でも submit で FormData に乗るよう、hidden を同期する
    const ensureHidden = (name) => {
      let el = form ? form.querySelector(`input[type="hidden"][name="${CSS.escape(name)}"]`) : null;
      if (!form) return null;
      if (!el) {
        el = document.createElement("input");
        el.type = "hidden";
        el.name = name;
        form.appendChild(el);
      }
      return el;
    };
    const syncHidden = () => {
      const h1 = ensureHidden("password");
      const h2 = ensureHidden("passwordConfirm");
      if (h1) h1.value = (pw.value || "").toString();
      if (h2) h2.value = (confirm.value || "").toString();
    };

    pw.addEventListener("input", syncHidden, { capture: true });
    confirm.addEventListener("input", syncHidden, { capture: true });
    pw.addEventListener("blur", syncHidden, { capture: true });
    confirm.addEventListener("blur", syncHidden, { capture: true });

    // 初期表示でインラインJSが出したエラーを確実に消す
    runAll();
    syncHidden();
  }

  // ------------------------------
  // Remaining required counter (radio groups = 1)
  // ------------------------------
  function bindRequiredRemaining() {
    const form = qs("signupForm");
    const out = qs("requiredRemaining");
    if (!form || !out) return;

    const isVisible = (el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);

    const update = () => {
      const required = Array.from(
        form.querySelectorAll("input[required], select[required], textarea[required]")
      ).filter((el) => !el.disabled && isVisible(el));

      const radioNames = new Set();
      let remaining = 0;

      required.forEach((el) => {
        const t = (el.type || "").toLowerCase();
        if (t === "radio") {
          if (el.name) radioNames.add(el.name);
          return;
        }
        if (t === "checkbox") {
          if (!el.checked) remaining++;
          return;
        }
        if ((el.value || "").trim() === "") remaining++;
      });

      radioNames.forEach((name) => {
        const checked = form.querySelector(`input[type="radio"][name="${CSS.escape(name)}"]:checked`);
        if (!checked) remaining++;
      });

      out.textContent = String(remaining);
    };

    form.addEventListener("input", update);
    form.addEventListener("change", update);
    update();
  }

  // ------------------------------
  // Submit -> POST /api/members
  //   - 400時にポップアップ（alert）も出す
  //   - 値収集は FormData を正にして、prefill(hiddens) と整合
  // ------------------------------
  function bindSubmitToApi() {
    const form = qs("signupForm");
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');

    const clearErrors = () => {
      const summary = qs("formErrorSummary");
      if (summary) {
        summary.innerHTML = "";
        summary.classList.remove("is-visible");
      }
      document.querySelectorAll(".field-error[data-error-for]").forEach((el) => (el.textContent = ""));
      document.querySelectorAll(".input-error").forEach((el) => el.classList.remove("input-error"));
    };

    // ------------------------------
    // クライアント側 必須エラー（ブラウザ標準のツールチップは使わない）
    // ------------------------------
    const setFieldError = (name, message) => {
      const box = document.querySelector(`.field-error[data-error-for="${CSS.escape(name)}"]`);
      if (box) box.textContent = message;

      const input = form.querySelector(`[name="${CSS.escape(name)}"]`);
      if (input) input.classList.add("input-error");
    };

    const focusFirstInvalid = () => {
      const first = form.querySelector(".input-error");
      if (first && typeof first.focus === "function") first.focus();
    };

    const requiredMessage = (name) => {
      const map = {
        lastNameKanji: "姓を入力してください。",
        firstNameKanji: "名を入力してください。",
        lastNameKana: "セイを入力してください。",
        firstNameKana: "メイを入力してください。",
        birthYear: "生年（西暦）を入力してください。",
        birthMonth: "生月を選択してください。",
        birthDay: "生日を選択してください。",
        gender: "性別を選択してください。",
        email: "メールアドレスを入力してください。",
        zip1: "郵便番号（上3桁）を入力してください。",
        zip2: "郵便番号（下4桁）を入力してください。",
        prefecture: "都道府県を選択してください。",
        addressLine1: "市区町村・番地を入力してください。",
        tel1: "電話番号（市外局番）を入力してください。",
        tel2: "電話番号（市内局番）を入力してください。",
        tel3: "電話番号（番号）を入力してください。",
        newsletter: "お知らせメールの受け取り有無を選択してください。",
        password: "パスワードを入力してください。",
        passwordConfirm: "パスワード確認用を入力してください。",
      };
      return map[name] || "必須項目です。";
    };

    const showRequiredErrors = () => {
      // ここでは「未入力」のみを出す（形式不正などはサーバ or 個別バリデーションで）
      const required = Array.from(form.querySelectorAll("[required]")).filter((el) => !el.disabled);
      const seenRadio = new Set();
      let hasError = false;

      required.forEach((el) => {
        const name = (el.getAttribute("name") || "").trim();
        if (!name) return;

        // password 系は pwErr（赤い三角）側で出す
        if (name === "password" || name === "passwordConfirm") return;

        // ブラウザ標準の文言を潰す（reportValidity を呼ばないが、念のため）
        el.setCustomValidity("");

        const t = (el.type || "").toLowerCase();
        if (t === "radio") {
          if (seenRadio.has(name)) return;
          seenRadio.add(name);
          const checked = form.querySelector(`input[type="radio"][name="${CSS.escape(name)}"]:checked`);
          if (!checked) {
            setFieldError(name, requiredMessage(name));
            hasError = true;
          }
          return;
        }

        if (t === "checkbox") {
          if (!el.checked) {
            setFieldError(name, requiredMessage(name));
            hasError = true;
          }
          return;
        }

        if ((el.value || "").toString().trim() === "") {
          setFieldError(name, requiredMessage(name));
          hasError = true;
        }
      });

      // サマリ表示（あれば）
      if (hasError) {
        const summary = qs("formErrorSummary");
        if (summary) {
          const items = [];
          document.querySelectorAll(".field-error[data-error-for]").forEach((box) => {
            const msg = (box.textContent || "").trim();
            if (msg) items.push(msg);
          });
          summary.innerHTML = "";
          const ul = document.createElement("ul");
          items.forEach((m) => {
            const li = document.createElement("li");
            li.textContent = m;
            ul.appendChild(li);
          });
          summary.appendChild(ul);
          summary.classList.add("is-visible");
          if (typeof summary.scrollIntoView === "function") {
            summary.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }

        focusFirstInvalid();
      }

      return hasError;
    };

    const cssEscapeAttr = (s) => String(s).replaceAll('"', '\\"');

    const renderErrors = (err, status) => {
      clearErrors();

      const summary = qs("formErrorSummary");
      const fieldErrors = err?.fieldErrors ?? [];
      const messages = [];

      if (Array.isArray(fieldErrors) && fieldErrors.length) {
        fieldErrors.forEach((fe) => {
          const field = String(fe?.field ?? "");
          const message = String(fe?.message ?? "");
          if (!field) return;

          const msgBox = document.querySelector(`[data-error-for="${CSS.escape(field)}"]`);
          if (msgBox) msgBox.textContent = message;

          const input = document.querySelector(`[name="${CSS.escape(field)}"]`);
          if (input) input.classList.add("input-error");

          messages.push(`${field}: ${message}`);
        });

        const first = String(fieldErrors[0]?.field ?? "");
        if (first) {
          const input = document.querySelector(`[name="${CSS.escape(first)}"]`);
          if (input && typeof input.focus === "function") input.focus();
        }
      } else {
        const msg = String(err?.message ?? `登録に失敗しました（HTTP ${status}）`);
        messages.push(msg);
      }

      if (summary) {
        const ul = document.createElement("ul");
        messages.forEach((m) => {
          const li = document.createElement("li");
          li.textContent = m;
          ul.appendChild(li);
        });
        summary.appendChild(ul);
        summary.classList.add("is-visible");
        if (typeof summary.scrollIntoView === "function") {
          summary.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }

      // ★ユーザー要望：ポップアップも出す（400時でも）
      alert(messages.join("\n"));
    };

    const safeJson = async (res) => {
      try {
        return await res.json();
      } catch {
        return null;
      }
    };

    const collectFormData = (formEl) => {
      const fd = new FormData(formEl);
      const v = (name) => (fd.get(name) ?? "").toString().trim();

      return {
        name: {
          lastKanji: v("lastNameKanji"),
          firstKanji: v("firstNameKanji"),
          lastKana: v("lastNameKana"),
          firstKana: v("firstNameKana"),
        },
        birthDate: { year: v("birthYear"), month: v("birthMonth"), day: v("birthDay") },
        gender: v("gender"),
        email: v("email"),
        address: {
          zip1: v("zip1"),
          zip2: v("zip2"),
          prefecture: v("prefecture"),
          line1: v("addressLine1"),
          line2: v("addressLine2"),
        },
        phone: { tel1: v("tel1"), tel2: v("tel2"), tel3: v("tel3") },
        newsletter: v("newsletter"),
        password: v("password"),
        passwordConfirm: v("passwordConfirm"),
      };
    };

    const onSubmit = async (e) => {
      if (e?.preventDefault) e.preventDefault();
      clearErrors();

      // ★登録ボタン押下後だけ、パスワード必須エラー（赤い三角＋文言）を出す
      bindPasswordValidation._setSubmitted?.(true);
      bindPasswordValidation._runAll?.();

      // ★未入力の必須項目は「自作メッセージ」で出す（ブラウザ標準の警告は出さない）
      if (showRequiredErrors()) return;

      // ★一致しない等 setCustomValidity のエラー判定（ブラウザ標準ツールチップは出さず停止）
      if (!form.checkValidity()) return;

      const payload = collectFormData(form);

      if (submitBtn) submitBtn.disabled = true;
      try {
        const res = await fetch("/api/members", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await safeJson(res);
          const id = data?.id;
          alert("登録しました");
          if (!id) {
            alert("登録は成功しましたが、IDが取得できません。");
            return;
          }
          location.href = `/member/${encodeURIComponent(id)}/edit`;
          return;
        }

        const err = await safeJson(res);
        renderErrors(err, res.status);
      } catch {
        renderErrors({ message: "通信に失敗しました。" }, 0);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    };

    form.addEventListener("submit", onSubmit);

    const btn = qs("registerButton");
    if (btn) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        onSubmit(e);
      });
    }
  }

  onReady(() => {
    bindPasswordTogglePair();
    bindPasswordValidation();
    bindRequiredRemaining();
    bindSubmitToApi();
  });
})();
