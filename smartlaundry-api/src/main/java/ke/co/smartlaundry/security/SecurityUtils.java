package ke.co.smartlaundry.security;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
public class SecurityUtils {

    private static JwtUtil jwtUtil;

    public SecurityUtils(JwtUtil jwtUtil) {
        SecurityUtils.jwtUtil = jwtUtil;
    }

    public static Long getCurrentUserId() {
        String token = extractToken();
        if (token == null) return null;
        return jwtUtil.extractUserId(token);
    }

    public static String getCurrentUserEmail() {
        String token = extractToken();
        if (token == null) return null;
        return jwtUtil.extractEmail(token);
    }

    public static String getCurrentUserRole() {
        String token = extractToken();
        if (token == null) return null;
        return jwtUtil.extractRole(token);
    }

    private static String extractToken() {
        ServletRequestAttributes attr =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attr == null) return null;

        HttpServletRequest request = attr.getRequest();
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        return authHeader.substring(7);
    }
}
