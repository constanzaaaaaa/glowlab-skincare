# GlowLab — Backend Control 3 (Spring Boot)

Backend REST de la rama `control-3-spring-rest-jwt` (DSY1104). Implementación según el Anexo 1 de Control 3: Spring Boot, cinco entidades JPA relacionadas, MySQL, CRUD, Swagger, Spring Security y JWT.

## Requisitos de desarrollo

- Java **21**
- Maven **3.9+** (comando `mvn`)
- Docker Desktop con `docker compose` (para MySQL; las pruebas con H2 no lo necesitan)
- Node.js y npm para el frontend React

## 1. Preparar MySQL en PowerShell

Dentro de `glowlab-skincare/backend`:

```powershell
docker compose up -d
```

El `docker-compose.yml` usa MySQL 8.4 y credenciales **solo de desarrollo local**. No reutilizar estas credenciales ni `ddl-auto=update` en producción.

## 2. Configurar JWT y cuentas de demostración de roles

En la misma terminal PowerShell:

```powershell
$bytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$rng.Dispose()
$env:JWT_SECRET_BASE64 = [Convert]::ToBase64String($bytes)
$env:ADMIN_EMAIL = "admin@gmail.com"
$env:ADMIN_PASSWORD = "CAMBIA_ESTA_CLAVE_POR_UNA_PRIVADA_Y_SEGURA"
$env:VENDEDOR_EMAIL = "vendedor@gmail.com"
$env:VENDEDOR_PASSWORD = "OTRA_CLAVE_PRIVADA_Y_SEGURA"
```

Cambia esos valores antes de iniciar. No guardes claves en GitHub. Las cuentas administrativas se crean **solo si** no existen en MySQL. Los clientes pueden registrarse desde React.

## 3. Iniciar backend

```powershell
mvn spring-boot:run
```

API: `http://localhost:8080/api/v1`

Swagger: `http://localhost:8080/swagger-ui.html`

Si Maven o Docker no están instalados, instálalos antes. No confundas `mvn` del backend con `npm.cmd` del frontend.

## 4. Iniciar React con la API

Abre **otra** terminal:

```powershell
cd frontend
Copy-Item .env.example .env
npm.cmd install
npm.cmd run dev
```

La terminal debe estar dentro de `frontend`. La página queda en `http://localhost:5173`. Es necesario reiniciar Vite después de modificar `.env`.

**Sin `VITE_API_BASE_URL`**, React continúa en modo local del Control 2. Para mostrar el Control 3 se debe configurar el backend.

## 5. Ejecutar pruebas

```powershell
cd backend
mvn test
```

Las pruebas Spring Boot del perfil `test` utilizan H2 en memoria, sin necesitar Docker. Se incluyen pruebas de JWT y una prueba REST de registro, sesión y acceso. **No hay un resultado aprobado verificado todavía**: ejecútalas en tu computador.

En React, desde `frontend`:

```powershell
npm.cmd test
```

## Endpoints principales

| Método | Ruta | Permisos |
|---|---|---|
| POST | `/api/v1/auth/registro` | Público (crea cliente) |
| POST | `/api/v1/auth/login` | Público |
| POST | `/api/v1/auth/refresh` | Cookie refresh válida |
| POST | `/api/v1/auth/logout` | Autenticado |
| GET | `/api/v1/auth/me` | Autenticado |
| PUT | `/api/v1/auth/perfil` | Autenticado |
| GET | `/api/v1/categorias` | Público |
| POST, PUT, DELETE | `/api/v1/categorias` | Administrador |
| GET | `/api/v1/productos` | Público |
| GET | `/api/v1/productos/{codigo}` | Público |
| POST, PUT, DELETE | `/api/v1/productos` | Administrador |
| GET, POST, PUT, DELETE | `/api/v1/usuarios` | Administrador |
| POST | `/api/v1/boletas` | Cliente o administrador |
| GET | `/api/v1/boletas/mis` | Cliente o administrador |
| GET | `/api/v1/boletas` | Vendedor o administrador |
| GET | `/api/v1/boletas/{id}` | Vendedor o administrador |

El CRUD conserva la integridad: una categoría con productos y un producto con detalles de boleta no se eliminan. El total de una boleta se calcula en el backend y el stock se descuenta dentro de una transacción.

## Modelo de datos del Anexo 1

`USUARIO (1) -> BOLETA (N) -> DETALLE_BOLETA (N) -> PRODUCTO (1) -> CATEGORIA (1)`

Las entidades Java se encuentran en `src/main/java/cl/glowlab/control3/model/`.
Los repositorios JPA se encuentran en `repo/`, la lógica de negocio en `service/`, los endpoints en `api/` y la seguridad en `security/`.

## JWT, sesión y roles

- Las claves se almacenan cifradas con **BCrypt** en MySQL.
- JWT de acceso con expiración de 30 minutos; JWT de renovación con expiración de 7 días.
- Cookies `HttpOnly`, `SameSite=Strict`; `Secure` controlado con `COOKIE_SECURE=true` cuando se despliegue con HTTPS.
- React utiliza `credentials: "include"` para enviar cookies, reconsulta `/auth/me` tras recargar y solicita `/auth/refresh` si expira el acceso.
- Los endpoints sensibles tienen validación de rol **en Spring Security**, no solo en la interfaz.
- **Advertencia:** es un entorno académico local. Antes de producción faltan medidas como CSRF formal, rotación/revocación centralizada de refresh tokens, HTTPS real y migraciones versionadas de esquema.

## Nota sobre pedidos y pagos

La boleta registra productos y despacho, verifica el stock y guarda el total en la base de datos. **No efectúa cobros bancarios ni envíos reales**, porque la pauta exige API, BD y seguridad, no pasarela de pago.

## Estado de implementación

La estructura, endpoints y pruebas están incorporados al repositorio. Falta **verificar compilación, tests y conexión real con MySQL** en un equipo que tenga Maven y Docker. Después deberán realizarse las evidencias con capturas, ERS, cobertura, documentación de APIs, manual y video requeridos por la rúbrica.
