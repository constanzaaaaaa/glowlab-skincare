package cl.glowlab.control3.security;

import static org.junit.jupiter.api.Assertions.*;
import java.util.Base64;
import org.junit.jupiter.api.Test;

class JwtServiceTest {
    private JwtService jwt(){
        byte[] key=new byte[32];for(int i=0;i<key.length;i++)key[i]=(byte)(i+1);
        return new JwtService(Base64.getEncoder().encodeToString(key));
    }
    @Test
    void generaYVerificaTokenDeAcceso(){
        JwtService servicio=jwt();
        String token=servicio.crear("cliente@gmail.com","access");
        assertEquals("cliente@gmail.com",servicio.validar(token,"access"));
    }
    @Test
    void noPermiteUsarRefreshComoAcceso(){
        JwtService servicio=jwt();
        String token=servicio.crear("cliente@gmail.com","refresh");
        assertThrows(Exception.class,()->servicio.validar(token,"access"));
    }
    @Test
    void exigeClaveSegura(){
        assertThrows(IllegalArgumentException.class,()->new JwtService(Base64.getEncoder().encodeToString(new byte[8])));
    }
}
