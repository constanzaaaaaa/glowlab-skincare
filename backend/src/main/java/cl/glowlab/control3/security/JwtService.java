package cl.glowlab.control3.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.time.*;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
    private final SecretKey key;
    public JwtService(@Value("${app.jwt.secret-base64}") String secreto) {
        if(secreto == null || secreto.isBlank())
            throw new IllegalArgumentException("Debes configurar JWT_SECRET_BASE64 con al menos 32 bytes aleatorios.");
        byte[] bytes;
        try { bytes=Decoders.BASE64.decode(secreto); }
        catch(Exception e) { throw new IllegalArgumentException("JWT_SECRET_BASE64 debe estar en Base64.",e); }
        if(bytes.length<32) throw new IllegalArgumentException("JWT_SECRET_BASE64 necesita al menos 32 bytes.");
        key=Keys.hmacShaKeyFor(bytes);
    }
    public String crear(String correo, String tipo) {
        Duration duracion="refresh".equals(tipo)?Duration.ofDays(7):Duration.ofMinutes(30);
        Instant ahora=Instant.now();
        return Jwts.builder()
            .subject(correo)
            .claim("tipo",tipo)
            .issuedAt(Date.from(ahora))
            .expiration(Date.from(ahora.plus(duracion)))
            .signWith(key,Jwts.SIG.HS256)
            .compact();
    }
    public String validar(String token,String tipo) {
        Claims claims=Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
        if(!tipo.equals(claims.get("tipo",String.class))) throw new JwtException("Tipo de token incorrecto.");
        return claims.getSubject();
    }
}
