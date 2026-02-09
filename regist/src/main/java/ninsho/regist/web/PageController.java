package ninsho.regist.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class PageController {
    @GetMapping("/")
    public String root() {
        return "redirect:/signup";
    }


    @GetMapping("/signup")
    public String signup() {
        return "signup";
    }

    @GetMapping("/member/{id}/edit")
    public String edit(@PathVariable String id) {
        return "member-edit";
    }
}
