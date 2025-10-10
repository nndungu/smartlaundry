package ke.co.smartlaundry.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestSwagger {
    @GetMapping("/hello")
    public String hello() {
        return "Hello Swagger World";
    }

}
