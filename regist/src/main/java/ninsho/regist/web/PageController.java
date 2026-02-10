package ninsho.regist.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {
    @GetMapping({"/", "/signup", "/member/{id}/edit"})
    public String spaEntry() {
        return "forward:/spa/index.html";
    }
}
