(function ($) {
  $(function () {
    //------------------------------------------------
    // 画像先読み
    //------------------------------------------------
    $.preLoadImages(
      "pc/img/common/back2btn_off.gif",
      "pc/img/common/back2btn_over.gif",
      "pc/img/member_cnf_privacy/btn_post_search_off.gif",
      "pc/img/member_cnf_privacy/btn_post_search_over.gif",
      "pc/img/member_inp_privacy/btn_confirm_off.gif",
      "pc/img/member_inp_privacy/btn_confirm_over.gif"
    );

    //----------------------------------------------------------------
    // 住所検索
    //----------------------------------------------------------------
    $("#postalBtn").click(function () {
      // 郵便番号マスタ検索
      $.getJSON(
        $("#postalActionUrl").text(),
        { q1: $("#upperPostalCode").val(), q2: $("#lowerPostalCode").val() },
        function (data) {
          for (var i = 0; i < data.length; i++) {
            if (data[i].msg == null) {
              $("#prefectures").val(data[i].prefectureName);
              $("#city").val(data[i].address1);
              $("#zipConfirm").text("");
            } else {
              $("#zipConfirm").html("<br/>" + data[i].msg);
            }
          }
        }
      );
    });

    //----------------------------------------------------------------
    // 入力チェック
    //----------------------------------------------------------------
    $("#next").click(function () {
      var isSubmit = true;
      var scrollColumn = null;

      // お名前(漢字)
      if ($("#familyName").val() == "" || $("#firstName").val() == "") {
        $("#requiredErrorMessageByName").css("display", "block");
        if (isSubmit) {
          isSubmit = false;
          scrollColumn = $("#familyName");
        }
      } else {
        $("#requiredErrorMessageByName").css("display", "none");
      }

      // お名前(カナ)
      if ($("#familyNameKana").val() == "" || $("#firstNameKana").val() == "") {
        $("#requiredErrorMessageByNameKana").css("display", "block");
        if (isSubmit) {
          isSubmit = false;
          scrollColumn = $("#familyNameKana");
        }
      } else {
        $("#requiredErrorMessageByNameKana").css("display", "none");
      }

      // 生年月日(西暦)
      if ($("#birthYear").val() == "") {
        $("#requiredErrorMessageByBirth").css("display", "block");
        if (isSubmit) {
          isSubmit = false;
          scrollColumn = $("#birthYear");
        }
      } else {
        $("#requiredErrorMessageByBirth").css("display", "none");
      }

      // 性別
      if (
        $("#sexMan:checked").val() == undefined &&
        $("#sexWoman:checked").val() == undefined
      ) {
        $("#requiredErrorMessageBySex").css("display", "block");
        if (isSubmit) {
          isSubmit = false;
          scrollColumn = $("#sexTitle");
        }
      } else {
        $("#requiredErrorMessageBySex").css("display", "none");
      }

      // 住所(郵便番号)
      if ($("#upperPostalCode").val() == "" || $("#lowerPostalCode").val() == "") {
        $("#requiredErrorMessageByPostalCode").css("display", "block");
        if (isSubmit) {
          isSubmit = false;
          scrollColumn = $("#upperPostalCode");
        }
      } else {
        $("#requiredErrorMessageByPostalCode").css("display", "none");
      }

      // 住所(都道府県)
      if ($("#prefectures").val() == "選択してください") {
        $("#requiredErrorMessageByPrefectures").css("display", "block");
        if (isSubmit) {
          isSubmit = false;
          scrollColumn = $("#prefectures");
        }
      } else {
        $("#requiredErrorMessageByPrefectures").css("display", "none");
      }

      // 住所(市区町村・番地)
      if ($("#city").val() == "") {
        $("#requiredErrorMessageByCity").css("display", "block");
        if (isSubmit) {
          isSubmit = false;
          scrollColumn = $("#city");
        }
      } else {
        $("#requiredErrorMessageByCity").css("display", "none");
      }

      // 電話番号
      if (
        $("#areaCode").val() == "" ||
        $("#telephoneCode").val() == "" ||
        $("#circuitNumber").val() == ""
      ) {
        $("#requiredErrorMessageByTelephone").css("display", "block");
        if (isSubmit) {
          isSubmit = false;
          scrollColumn = $("#areaCode");
        }
      } else {
        $("#requiredErrorMessageByTelephone").css("display", "none");
      }

      // パスワード
      if ($("#passWord").val() == "") {
        $("#requiredErrorMessageByPassWord").css("display", "block");
        if (isSubmit) {
          isSubmit = false;
          scrollColumn = $("#passWord");
        }
      } else {
        $("#requiredErrorMessageByPassWord").css("display", "none");
      }

      // 確認用パスワード
      if ($("#resultPassword").val() == "") {
        $("#requiredErrorMessageByResultPassword").css("display", "block");
        if (isSubmit) {
          isSubmit = false;
          scrollColumn = $("#resultPassword");
        }
      } else {
        $("#requiredErrorMessageByResultPassword").css("display", "none");
      }

      if (!isSubmit) {
        $("html,body").animate({ scrollTop: scrollColumn.offset().top });
        return false;
      }
    });

    //------------------------------------------------
    // ローマ数字変換
    //------------------------------------------------
    $("#next").click(function () {
      var text = $("#apartment").val();
      var regex = new RegExp("[\u2160-\u216b\u2170-\u217b]", "gu");

      if (text.match(regex)) {
        var romanNumerals = new Map([
          [/Ⅰ|ⅰ/g, "１"],
          [/Ⅱ|ⅱ/g, "２"],
          [/Ⅲ|ⅲ/g, "３"],
          [/Ⅳ|ⅳ/g, "４"],
          [/Ⅴ|ⅴ/g, "５"],
          [/Ⅵ|ⅵ/g, "６"],
          [/Ⅶ|ⅶ/g, "７"],
          [/Ⅷ|ⅷ/g, "８"],
          [/Ⅸ|ⅸ/g, "９"],
          [/Ⅹ|ⅹ/g, "１０"],
          [/Ⅺ|ⅺ/g, "１１"],
          [/Ⅻ|ⅻ/g, "１２"],
        ]);

        romanNumerals.forEach(function (value, key) {
          text = text.replace(key, value);
        });
      }

      if (text.length > 25) {
        $("#isLengthOver").css("display", "block");
        $("html,body").animate({ scrollTop: $("#upperPostalCode").offset().top });
        return false;
      }

      $("#apartment").val(text);
    });

    //------------------------------------------------
    // メールアドレス大文字チェック
    //------------------------------------------------
    var text = $("#loginId").text();
    var regex = new RegExp("[A-Z]", "gu");

    if (text.match(regex)) {
      $("#shouldLowerCase").css("display", "block");
    }

    //------------------------------------------------
    // パスワード表示切替（アイコン差し替え版）
    //------------------------------------------------
    var ICON_HIDE =
      'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24"><path d="m644 628-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660 556q0 20-4 37.5T644 628Zm128 126-58-56q38-29 67.5-63.5T832 556q-50-101-143.5-160.5T480 336q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920 556q-23 59-60.5 109.5T772 754Zm20 246L624 834q-35 11-70.5 16.5T480 856q-151 0-269-83.5T40 556q21-53 53-98.5t73-81.5L56 264l56-56 736 736-56 56ZM222 432q-29 26-53 57t-41 67q50 101 143.5 160.5T480 776q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300 556q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/></svg>';

    var ICON_SHOW =
      'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24"><path d="M480 736q75 0 127.5-52.5T660 556q0-75-52.5-127.5T480 376q-75 0-127.5 52.5T300 556q0 75 52.5 127.5T480 736Zm0-72q-45 0-76.5-31.5T372 556q0-45 31.5-76.5T480 448q45 0 76.5 31.5T588 556q0 45-31.5 76.5T480 664Zm0 192q-146 0-266-81.5T40 556q54-137 174-218.5T480 256q146 0 266 81.5T920 556q-54 137-174 218.5T480 856Zm0-300Zm0 220q113 0 207.5-59.5T832 556q-50-101-144.5-160.5T480 336q-113 0-207.5 59.5T128 556q50 101 144.5 160.5T480 776Z"/></svg>';

    var $Toggle = $("[id$='Toggle']");
    var passEl = document.getElementById("passWord");
    var resultEl = document.getElementById("resultPassword");

    function ensureToggleImg($t) {
      var $img = $t.find("img");
      if ($img.length === 0) {
        $img = $("<img>", {
          alt: "",
          "aria-hidden": "true",
          draggable: "false",
        }).appendTo($t);
      }
      return $img;
    }

    function syncToggleUI() {
      if (!passEl || !resultEl) return;

      var visible = passEl.type === "text";
      $Toggle.each(function () {
        var $t = $(this);
        var $img = ensureToggleImg($t);
        $img.attr("src", visible ? ICON_SHOW : ICON_HIDE);

        // 既存クラスも維持しつつ、状態クラスを合わせる
        $t.toggleClass("visibility", visible);
        $t.toggleClass("visibility_off", !visible);

        // アクセシビリティ
        $t.attr("aria-pressed", visible ? "true" : "false");
        $t.attr("aria-label", visible ? "パスワードを隠す" : "パスワードを表示");
      });
    }

    $Toggle.off("click").on("click", function () {
      if (!passEl || !resultEl) return;

      if (passEl.type === "password") {
        passEl.type = "text";
        resultEl.type = "text";
      } else {
        passEl.type = "password";
        resultEl.type = "password";
      }
      syncToggleUI();
    });

    syncToggleUI();
  });

  // パスワード○×チェッカー
  $(document).ready(function () {
    $("#passWord").keyup(function () {
      // 数字
      if ($(this).val().match(/[0-9]/)) {
        $("#numberCheck").text("○");
        $("#numberCheck").css("color", "#000000");
      } else {
        $("#numberCheck").text("×");
        $("#numberCheck").css("color", "Red");
      }
      // 英字
      if ($(this).val().match(/[a-zA-Z]/)) {
        $("#charCheck").text("○");
        $("#charCheck").css("color", "#000000");
      } else {
        $("#charCheck").text("×");
        $("#charCheck").css("color", "Red");
      }
      // 使用可能記号
      if ($(this).val().match(/[-!"#$%&'()*+,./:;<=>?@\[\]^_`{|}~]/)) {
        $("#codeCheck").text("○");
        $("#codeCheck").css("color", "#000000");
      } else {
        $("#codeCheck").text("×");
        $("#codeCheck").css("color", "Red");
        // 使用不可記号
      }
      if (
        $(this)
          .val()
          .match(/[ \\｡｢｣､･ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝﾞﾟ\u00A5]/)
      ) {
        $("#codeCheck").text("×");
        $("#codeCheck").css("color", "Red");
      }
    });
  });
})(jQuery);
