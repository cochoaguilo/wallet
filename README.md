# Wallet

App de finanzas personales hecha con **Ionic + Angular** que permite llevar el control de ahorros, inversiones y deudas desde la web o como app Android (Capacitor).

## Funcionalidades

- **Autenticación**: registro (`/sign-in`) e inicio de sesión (`/log-in`) con email y contraseña o con **Google (OAuth / Google Identity Services)**, con token guardado en sesión y enviado por un interceptor HTTP. Las rutas privadas están protegidas con un `AuthGuard`.
- **Ahorros**: alta, edición y baja de ingresos y gastos, con totales por usuario.
- **Inversiones**: seguimiento de criptomonedas y acciones, con cotizaciones obtenidas en tiempo real y conversión de pesos a dólar MEP.
- **Deudas**: registro de deudas y cálculo del total adeudado.
- Gráficos de barras (Chart.js / ng2-charts), slides (Swiper) y formularios dinámicos en modales.

## Tecnologías

- Angular 21 · Ionic 8 · TypeScript
- Capacitor 6 (Android)
- Chart.js + ng2-charts, Swiper
- Karma + Jasmine para tests, ESLint
- Docker para el despliegue web

## Estructura

```
src/
├── app/
│   ├── components/   # bar-chart, dynamic-modal, form, google-button, notification, slides
│   ├── guards/       # AuthGuard
│   ├── home/         # pantalla de inicio
│   ├── login/        # inicio de sesión
│   ├── signin/       # registro
│   ├── tab1/         # Ahorros
│   ├── tab2/         # Inversiones
│   ├── tab3/         # Deudas
│   ├── tabs/         # navegación por pestañas y menú de cuenta
│   ├── pipes/        # pipe de ordenamiento
│   └── services/     # ahorros, inversiones, deudas, auth, google-auth y auth-interceptor
├── environments/     # URL de la API y Client ID de Google
└── interfaces/       # modelos tipados
android/              # proyecto nativo de Capacitor
```

## Backend

La app consume una API REST configurada en `src/environments/environment.ts` (por defecto `http://localhost:3000`). El backend correspondiente está en [project-backend](https://github.com/cochoaguilo/project-backend) y expone los endpoints `/usuarios`, `/ahorros`, `/inversiones`, `/cripto`, `/deudas` y `/externals` (cotizaciones de cripto, acciones y dólar).

## Inicio de sesión con Google

El login con Google usa [Google Identity Services](https://developers.google.com/identity/gsi/web): el botón oficial de Google devuelve un **ID token** (JWT firmado por Google) que la app envía al backend para canjearlo por el token propio de la API.

### 1. Crear el Client ID

1. En [Google Cloud Console → APIs y servicios → Credenciales](https://console.cloud.google.com/apis/credentials), configurar la pantalla de consentimiento OAuth.
2. Crear un **ID de cliente OAuth 2.0** de tipo **Aplicación web**.
3. En **Orígenes autorizados de JavaScript** agregar `http://localhost`, `http://localhost:4200` y el dominio de producción.
4. Copiar el Client ID en `googleClientId` de `src/environments/environment.ts` y `environment.prod.ts`. Si queda vacío, el botón no se muestra.

### 2. Endpoint requerido en el backend

```
POST /usuarios/google
Content-Type: application/json

{ "credential": "<ID token de Google>" }
```

El backend debe:

1. Verificar el ID token con el **mismo Client ID** (por ejemplo con `google-auth-library`: `client.verifyIdToken({ idToken: credential, audience: GOOGLE_CLIENT_ID })`), comprobando firma, `aud`, `iss` y expiración, y que `email_verified` sea `true`.
2. Buscar el usuario por `email` (o por `sub`, el ID de Google) y crearlo si no existe, usando `name` y `email` del token (sin contraseña).
3. Responder con el mismo formato que `POST /usuarios/log-in`:

```json
{
  "status": "success",
  "success": true,
  "data": {
    "access_token": "<JWT de la API>",
    "expires_in": 3600,
    "user": { "name": "Nombre", "mail": "usuario@gmail.com" }
  }
}
```

Nunca se debe confiar en el ID token sin verificarlo en el servidor.

> **Android:** Google no permite el flujo web de OAuth dentro del WebView de Capacitor, así que en la app nativa hace falta un plugin de Google Sign-In nativo (por ejemplo `@capacitor-firebase/authentication` o `@codetrix-studio/capacitor-google-auth`) que obtenga el ID token y lo envíe al mismo endpoint `POST /usuarios/google`.

## Cómo correrlo

Requisitos: Node.js 20+ y npm.

```bash
npm install
npm start          # servidor de desarrollo en http://localhost:4200
```

Otros scripts:

```bash
npm run build      # build de producción en www/
npm test           # tests unitarios con Karma
npm run lint       # linter
```

### Android

```bash
npm run build
npx cap sync android
npx cap open android   # abre el proyecto en Android Studio
```

### Docker

```bash
docker build -t wallet .
docker run -p 4200:4200 wallet
```
