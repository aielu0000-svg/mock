(function () {
  "use strict";

  // 受け取りキー（遷移元が sessionStorage に入れる）
  var KEY = "signupPrefill";

  function $(id) { return document.getElementById(id); }
  var form = $("signupForm");
  if (!form) return;

  function safeJsonParse(raw) {
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  function readFromSession() {
    var raw = sessionStorage.getItem(KEY);
    if (!raw) return {};
    var obj = safeJsonParse(raw);
    return obj && typeof obj === "object" ? obj : {};
  }

  function readFromQuery() {
    var params = new URLSearchParams(location.search);
    var obj = {};
    params.forEach(function (v, k) { obj[k] = v; });
    return obj;
  }

  function mergeData() {
    // query を優先（上書き）
    var a = readFromSession();
    var b = readFromQuery();
    var out = {};
    Object.keys(a).forEach(function (k) { out[k] = a[k]; });
    Object.keys(b).forEach(function (k) { out[k] = b[k]; });
    return out;
  }

  function ensureHidden(name, value) {
    if (!name) return;
    var sel = 'input[type="hidden"][name="' + CSS.escape(name) + '"]';
    var h = form.querySelector(sel);
    if (!h) {
      h = document.createElement("input");
      h.type = "hidden";
      h.name = name;
      form.appendChild(h);
    }
    h.value = value == null ? "" : String(value);
  }

  function lockCommon(el) {
    el.disabled = true; // 「非活性」の要件
    el.setAttribute("aria-disabled", "true");
    el.setAttribute("data-locked", "true");
  }

  function setAndLockInput(id, value, hiddenName) {
    var el = $(id);
    if (!el) return;
    el.value = value == null ? "" : String(value);
    lockCommon(el);
    ensureHidden(hiddenName || el.name, el.value);
  }

  function setAndLockSelect(id, value, hiddenName) {
    var el = $(id);
    if (!el) return;

    var v = value == null ? "" : String(value);

    // value一致 → なければ表示テキスト一致
    var hasValue = false;
    for (var i = 0; i < el.options.length; i++) {
      if (el.options[i].value === v) { hasValue = true; break; }
    }
    if (hasValue) {
      el.value = v;
    } else {
      for (var j = 0; j < el.options.length; j++) {
        if ((el.options[j].textContent || "").trim() === v) {
          el.value = el.options[j].value;
          break;
        }
      }
    }

    lockCommon(el);
    ensureHidden(hiddenName || el.name, el.value);
  }

  function normalizeYMD(data) {
    // birthdate: YYYY-MM-DD / YYYYMMDD / YYYY/MM/DD
    var bd = (data.birthdate || "").toString().trim();
    if (bd) {
      var m = bd.match(/^(\d{4})[-\/]?(\d{2})[-\/]?(\d{2})$/);
      if (m) return { y: m[1], m: m[2], d: m[3] };
    }
    var y = (data.birthYear || "").toString().trim();
    var mo = (data.birthMonth || "").toString().trim();
    var d = (data.birthDay || "").toString().trim();
    if (y && mo && d) return { y: y, m: mo, d: d };
    return null;
  }

  function normalizeZip(data) {
    var zip = (data.zip || "").toString().trim();
    if (zip) {
      var m = zip.match(/^(\d{3})-?(\d{4})$/);
      if (m) return { z1: m[1], z2: m[2] };
    }
    var z1 = (data.zip1 || "").toString().trim();
    var z2 = (data.zip2 || "").toString().trim();
    if (z1 && z2) return { z1: z1, z2: z2 };
    return null;
  }

  function normalizePhone(data) {
    var p = (data.phone || "").toString().trim();
    if (p) {
      var m = p.match(/^(\d{2,5})-?(\d{1,5})-?(\d{4})$/);
      if (m) return { t1: m[1], t2: m[2], t3: m[3] };
    }
    var t1 = (data.tel1 || "").toString().trim();
    var t2 = (data.tel2 || "").toString().trim();
    var t3 = (data.tel3 || "").toString().trim();
    if (t1 && t2 && t3) return { t1: t1, t2: t2, t3: t3 };
    return null;
  }

  function normalizeGender(v) {
    var s = (v == null ? "" : String(v)).trim().toLowerCase();
    if (!s) return "";
    if (s === "male" || s === "m" || s === "1" || s === "man") return "male";
    if (s === "female" || s === "f" || s === "2" || s === "woman") return "female";
    return s;
  }

  function lockGender(value) {
    var g = normalizeGender(value);
    if (!g) return;

    var man = $("sexMan");
    var woman = $("sexWoman");

    if (man) {
      man.checked = g === "male";
      lockCommon(man);
    }
    if (woman) {
      woman.checked = g === "female";
      lockCommon(woman);
    }
    // ラジオは disabled で送信されないので hidden で担保
    ensureHidden("gender", g);
  }

  function lockPostalSearchButton() {
    var btn = $("postalBtn");
    if (!btn) return;
    btn.disabled = true;
    btn.setAttribute("aria-disabled", "true");
    btn.setAttribute("data-locked", "true");
  }

  function applyPrefill(data) {
    // 名前（漢字）
    if (data.lastNameKanji != null) setAndLockInput("familyName", data.lastNameKanji, "lastNameKanji");
    if (data.firstNameKanji != null) setAndLockInput("firstName", data.firstNameKanji, "firstNameKanji");

    // 名前（カナ）
    if (data.lastNameKana != null) setAndLockInput("familyNameKana", data.lastNameKana, "lastNameKana");
    if (data.firstNameKana != null) setAndLockInput("firstNameKana", data.firstNameKana, "firstNameKana");

    // 生年月日
    var ymd = normalizeYMD(data);
    if (ymd) {
      setAndLockInput("birthYear", ymd.y, "birthYear");
      setAndLockSelect("birthMonth", ymd.m, "birthMonth");
      setAndLockSelect("birthDay", ymd.d, "birthDay");
    }

    // 性別
    if (data.gender != null) lockGender(data.gender);

    // メール
    if (data.email != null) setAndLockInput("email", data.email, "email");

    // 郵便番号
    var zip = normalizeZip(data);
    if (zip) {
      setAndLockInput("upperPostalCode", zip.z1, "zip1");
      setAndLockInput("lowerPostalCode", zip.z2, "zip2");
      lockPostalSearchButton();
    }

    // 都道府県（select は value が一致しなくてもテキスト一致で選択）
    if (data.prefecture != null) setAndLockSelect("prefectures", data.prefecture, "prefecture");

    // 市区町村・番地
    if (data.addressLine1 != null) setAndLockInput("city", data.addressLine1, "addressLine1");

    // アパート・マンション（任意だが渡ってきたらロック）
    if (data.addressLine2 != null) setAndLockInput("apartment", data.addressLine2, "addressLine2");

    // 電話番号
    var tel = normalizePhone(data);
    if (tel) {
      setAndLockInput("areaCode", tel.t1, "tel1");
      setAndLockInput("telephoneCode", tel.t2, "tel2");
      setAndLockInput("circuitNumber", tel.t3, "tel3");
    }

    // newsletter / password / passwordConfirm は「活性」のまま（何もしない）
  }

  var data = mergeData();
  var hasAny = Object.keys(data).some(function (k) {
    var v = data[k];
    return v != null && String(v).trim() !== "";
  });

  if (hasAny) {
    applyPrefill(data);

    // 一度使ったら消す（戻る→進む等の誤反映を防ぐ）
    sessionStorage.removeItem(KEY);
  }
})();