# Wallet

App de finanzas personales hecha con **Ionic + Angular** que permite llevar el control de ahorros, inversiones y deudas desde la web o como app Android (Capacitor).

## Funcionalidades

- **Autenticación**: registro (`/sign-in`) e inicio de sesión (`/log-in`) con token guardado en sesión y enviado por un interceptor HTTP. Las rutas privadas están protegidas con un `AuthGuard`.
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
│   ├── components/   # bar-chart, dynamic-modal, form, notification, slides
│   ├── guards/       # AuthGuard
│   ├── home/         # pantalla de inicio
│   ├── login/        # inicio de sesión
│   ├── signin/       # registro
│   ├── tab1/         # Ahorros
│   ├── tab2/         # Inversiones
│   ├── tab3/         # Deudas
│   ├── tabs/         # navegación por pestañas y menú de cuenta
│   ├── pipes/        # pipe de ordenamiento
│   └── services/     # ahorros, inversiones, deudas, auth y auth-interceptor
├── environments/     # configuración de la URL de la API
└── interfaces/       # modelos tipados
android/              # proyecto nativo de Capacitor
```

## Backend

La app consume una API REST configurada en `src/environments/environment.ts` (por defecto `http://localhost:3000`). El backend correspondiente está en [project-backend](https://github.com/cochoaguilo/project-backend) y expone los endpoints `/usuarios`, `/ahorros`, `/inversiones`, `/cripto`, `/deudas` y `/externals` (cotizaciones de cripto, acciones y dólar).

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
