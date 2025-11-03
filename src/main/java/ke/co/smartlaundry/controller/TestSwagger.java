package ke.co.smartlaundry.controller;

import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Profile({"dev", "local", "test"})
public class TestSwagger {
    @GetMapping("/hello")
    public String hello() {
        return "Hello Swagger World";
    }
}
