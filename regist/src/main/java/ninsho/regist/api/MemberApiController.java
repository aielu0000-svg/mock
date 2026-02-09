package ninsho.regist.api;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class MemberApiController {

    // DBの代わり（サーバ再起動で消える）
    private final Map<String, CreateMemberRequest> store = new ConcurrentHashMap<>();

    @PostMapping("/members")
    public ResponseEntity<CreateMemberResponse> create(@RequestBody CreateMemberRequest req) {
        List<FieldError> errors = new ArrayList<>();

        if (req == null) {
            errors.add(new FieldError("_", "リクエストが不正です"));
            return ResponseEntity.badRequest().body(CreateMemberResponse.error(errors));
        }

        // --- 必須チェック（HTMLのnameと同じキーで返す） ---
        // 基本情報
        requireText(errors, "lastNameKanji", safe(() -> req.name.lastKanji), "姓（漢字）は必須です");
        requireText(errors, "firstNameKanji", safe(() -> req.name.firstKanji), "名（漢字）は必須です");
        requireText(errors, "lastNameKana", safe(() -> req.name.lastKana), "姓（カナ）は必須です");
        requireText(errors, "firstNameKana", safe(() -> req.name.firstKana), "名（カナ）は必須です");

        requireText(errors, "birthYear", safe(() -> req.birthDate.year), "生年月日（年）は必須です");
        requireText(errors, "birthMonth", safe(() -> req.birthDate.month), "生年月日（月）は必須です");
        requireText(errors, "birthDay", safe(() -> req.birthDate.day), "生年月日（日）は必須です");

        requireText(errors, "gender", req.gender, "性別は必須です");
        requireText(errors, "email", req.email, "メールアドレスは必須です");

        // 住所
        requireText(errors, "zip1", safe(() -> req.address.zip1), "郵便番号（前半）は必須です");
        requireText(errors, "zip2", safe(() -> req.address.zip2), "郵便番号（後半）は必須です");
        requireText(errors, "prefecture", safe(() -> req.address.prefecture), "都道府県は必須です");
        requireText(errors, "addressLine1", safe(() -> req.address.line1), "市区町村・番地は必須です");
        // addressLine2 は任意

        // 連絡先
        requireText(errors, "tel1", safe(() -> req.phone.tel1), "電話番号（1）は必須です");
        requireText(errors, "tel2", safe(() -> req.phone.tel2), "電話番号（2）は必須です");
        requireText(errors, "tel3", safe(() -> req.phone.tel3), "電話番号（3）は必須です");

        requireText(errors, "newsletter", req.newsletter, "お知らせメールの選択は必須です");

        // パスワード
        requireText(errors, "password", req.password, "パスワードは必須です");
        requireText(errors, "passwordConfirm", req.passwordConfirm, "パスワード確認用は必須です");

        // パスワード一致
        if (notBlank(req.password) && notBlank(req.passwordConfirm) && !req.passwordConfirm.equals(req.password)) {
            errors.add(new FieldError("passwordConfirm", "パスワードが一致しません"));
        }

        // 形式チェック（最低限）
        if (notBlank(req.email) && !req.email.contains("@")) {
            errors.add(new FieldError("email", "メールアドレスの形式が不正です"));
        }
        if (notBlank(safe(() -> req.birthDate.year)) && !safe(() -> req.birthDate.year).matches("\\d{4}")) {
            errors.add(new FieldError("birthYear", "年は4桁の数字で入力してください"));
        }
        if (notBlank(safe(() -> req.address.zip1)) && !safe(() -> req.address.zip1).matches("\\d{3}")) {
            errors.add(new FieldError("zip1", "郵便番号（前半）は3桁の数字で入力してください"));
        }
        if (notBlank(safe(() -> req.address.zip2)) && !safe(() -> req.address.zip2).matches("\\d{4}")) {
            errors.add(new FieldError("zip2", "郵便番号（後半）は4桁の数字で入力してください"));
        }

        if (!errors.isEmpty()) {
            return ResponseEntity.badRequest().body(CreateMemberResponse.error(errors));
        }

        // --- 成功：保存してID返す ---
        String id = UUID.randomUUID().toString();
        store.put(id, req);
        return ResponseEntity.ok(CreateMemberResponse.ok(id));
    }

    @GetMapping("/members/{id}")
    public ResponseEntity<?> get(@PathVariable String id) {
        CreateMemberRequest data = store.get(id);
        if (data == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(CreateMemberView.from(data));
    }

    // ---- DTO ----

    public static class CreateMemberRequest {
        public Name name;
        public BirthDate birthDate;
        public String gender;
        public String email;
        public Address address;
        public Phone phone;
        public String newsletter;
        public String password;
        public String passwordConfirm;
    }

    public static class Name {
        public String lastKanji;
        public String firstKanji;
        public String lastKana;
        public String firstKana;
    }

    public static class BirthDate {
        public String year;
        public String month;
        public String day;
    }

    public static class Address {
        public String zip1;
        public String zip2;
        public String prefecture;
        public String line1;
        public String line2; // 任意
    }

    public static class Phone {
        public String tel1;
        public String tel2;
        public String tel3;
    }

    public static class CreateMemberResponse {
        public String id;
        public String message;
        public FieldError[] fieldErrors;

        public static CreateMemberResponse ok(String id) {
            CreateMemberResponse r = new CreateMemberResponse();
            r.id = id;
            r.message = "registered";
            return r;
        }

        public static CreateMemberResponse error(List<FieldError> errors) {
            CreateMemberResponse r = new CreateMemberResponse();
            r.message = "validation_error";
            r.fieldErrors = errors.toArray(new FieldError[0]);
            return r;
        }
    }

    public record FieldError(String field, String message) {}

    public static class CreateMemberView {
        public Name name;
        public BirthDate birthDate;
        public String gender;
        public String email;
        public Address address;
        public Phone phone;
        public String newsletter;

        public static CreateMemberView from(CreateMemberRequest req) {
            CreateMemberView v = new CreateMemberView();
            v.name = req.name;
            v.birthDate = req.birthDate;
            v.gender = req.gender;
            v.email = req.email;
            v.address = req.address;
            v.phone = req.phone;
            v.newsletter = req.newsletter;
            return v;
        }
    }

    // ---- util ----

    private static void requireText(List<FieldError> errors, String field, String value, String message) {
        if (!notBlank(value)) {
            errors.add(new FieldError(field, message));
        }
    }

    private static boolean notBlank(String s) {
        return s != null && !s.trim().isEmpty();
    }

    private static String safe(SupplierLike<String> s) {
        try {
            return s.get();
        } catch (Exception e) {
            return null;
        }
    }

    @FunctionalInterface
    private interface SupplierLike<T> {
        T get();
    }
}
