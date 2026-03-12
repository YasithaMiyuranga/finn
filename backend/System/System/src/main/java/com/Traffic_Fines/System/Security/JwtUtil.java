package com.Traffic_Fines.System.Security;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;
    @Value("${jwt.expiration}")
    private long validityInMilliseconds ;

    public String createToken(Map<String, Object> details) {

        String email = Objects.toString(details.get("email"), null);
        String role = Objects.toString(details.get("role"), null);

        Claims claims = Jwts.claims();
        claims.setSubject(email);
        claims.put("role","ROLE_"+role.toUpperCase());          // with role base
        Date now = new Date();
        Date validity = new Date(now.getTime() + validityInMilliseconds);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    public Map<String,Object> getClaims(String token) {
        Claims claims = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();

        Map<String,Object> result = new HashMap<>();
        result.put("email",claims.getSubject());
        result.put("role",claims.get("role", String.class));                    // with role base
        return result;
    }


    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}

