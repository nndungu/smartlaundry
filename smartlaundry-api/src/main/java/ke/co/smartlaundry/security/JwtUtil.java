package ke.co.smartlaundry.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private Long jwtExpirationMs;

    private SecretKey key;

    @PostConstruct
    public void init() {
        if (jwtSecret == null || jwtSecret.getBytes(StandardCharsets.UTF_8).length < 32) {
            this.key = Jwts.SIG.HS256.key().build();
            System.err.println("⚠️ Weak or missing JWT secret. Generated temporary secure key for runtime.");
        } else {
            this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        }
    }

    // Simple legacy version
    public String generateToken(String email) {
        return generateToken(null, email, null);
    }

    // Main token generator (with ID & Role)
    public String generateToken(Long userId, String email, String role) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + jwtExpirationMs);

        Map<String, Object> claims = new HashMap<>();
        claims.put("jti", UUID.randomUUID().toString());
        if (userId != null) claims.put("id", userId);
        if (role != null) claims.put("role", role);

        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key)
                .compact();
    }


    // ✅ Updated validation for jjwt 0.12.x (fixes test)
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(key)     // new style signature verifier
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            System.err.println("❌ Invalid JWT: " + e.getMessage());
            return false;
        }
    }

    // ✅ Unified parser for consistency
    private JwtParser getParser() {
        return Jwts.parser()
                .verifyWith(key)
                .build();
    }

    public String extractEmail(String token) {
        return getParser()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public Long extractUserId(String token) {
        Object id = getParser()
                .parseSignedClaims(token)
                .getPayload()
                .get("id");
        return id != null ? Long.parseLong(id.toString()) : null;
    }

    public String extractRole(String token) {
        Object role = getParser()
                .parseSignedClaims(token)
                .getPayload()
                .get("role");
        return role != null ? role.toString() : null;
    }
}
