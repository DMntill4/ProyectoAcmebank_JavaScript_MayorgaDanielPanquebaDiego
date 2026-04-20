# ProyectoAcmebank_JavaScript

## Descripción
Aplicación web del Banco Acme para la autogestión de cuentas bancarias. Desarrollada con HTML, CSS y JavaScript vanilla, utilizando LocalStorage para la persistencia de datos.

## Instrucciones de instalación y ejecución

1. Clonar el repositorio :D
```bash
git clone https://github.com/DMntill4/ProyectoAcmebank_JavaScript_MayorgaDanielPanquebaDiego.git
```

2. Abrir el proyecto con **Live Server** en VS Code:
   - Instalar la extensión "Live Server" en VS Code
   - Clic derecho sobre `index.html` → "Open with Live Server"
   - La aplicación se abrirá en `http://127.0.0.1:5500`

> **Nota:** Es necesario usar un servidor local (Live Server) porque la app usa localStorage y navegación entre páginas HTML.

## Estructura del proyecto

```
ProyectoAcmebank_JavaScript/
├── index.html          # Página de inicio de sesión
├── registro.html       # Formulario de registro
├── recuperar.html      # Recuperación de contraseña
├── dashboard.html      # Dashboard principal
├── css/
│   └── styles.css      # Estilos globales
├── js/
│   ├── utils.js        # Funciones utilitarias compartidas
│   ├── auth.js         # Lógica de inicio de sesión
│   ├── registro.js     # Lógica de registro
│   ├── recuperar.js    # Lógica de recuperación de contraseña
│   └── dashboard.js    # Lógica del dashboard y operaciones bancarias
└── README.md
```

## Funcionalidades completadas

### Autenticación
- [x] Inicio de sesión con tipo ID, número y contraseña
- [x] Validación en tiempo real de campos
- [x] Redirección al dashboard tras login exitoso
- [x] Mensajes de error claros

### Registro
- [x] Formulario completo con todos los campos requeridos
- [x] Validación de todos los campos obligatorios
- [x] Validación de formato de email
- [x] Validación de contraseña (mínimo 8 caracteres)
- [x] Confirmación de contraseña
- [x] Generación automática de número de cuenta
- [x] Resumen de cuenta creada

### Recuperación de contraseña
- [x] Verificación de identidad (tipo ID + número + email)
- [x] Formulario de nueva contraseña
- [x] Actualización de contraseña en localStorage

### Dashboard
- [x] Resumen de cuenta con tarjeta estilizada
- [x] Menú lateral de navegación
- [x] Resumen de las últimas 10 transacciones
- [x] Consignación electrónica
- [x] Retiro de dinero (con validación de saldo)
- [x] Pago de servicios públicos (Energía, Agua, Gas, Internet)
- [x] Certificado bancario imprimible
- [x] Cierre de sesión

### Diseño
- [x] Diseño responsive (móvil, tablet, desktop)
- [x] Google Fonts (Outfit + DM Sans)
- [x] Paleta bancaria (azul, blanco, gris)
- [x] Mensajes de error y éxito visibles
- [x] Animaciones suaves

## Tecnologías utilizadas
- HTML5
- CSS3 (Grid, Flexbox, Media Queries, Animaciones)
- JavaScript ES6+ (async, arrow functions, template literals, spread operator, destructuring)
- LocalStorage / SessionStorage para persistencia
- Google Fonts

## Estructura de datos (LocalStorage)

```json
{
  "acmebank_usuarios": [
    {
      "tipoId": "CC",
      "numId": "0987654321",
      "nombres": "Daniel",
      "apellidos": "Mayorga",
      "genero": "M",
      "telefono": "3001234567",
      "email": "daniel@email.com",
      "direccion": "Calle 123",
      "ciudad": "Bogotá",
      "password": "12345678",
      "numeroCuenta": "4012345678",
      "fechaCreacion": "2025-04-09T...",
      "saldo": 50000,
      "transacciones": [
        {
          "fecha": "2025-04-09T...",
          "referencia": "REF-A3B7C2D1",
          "tipo": "Consignación",
          "concepto": "Consignación por canal electrónico",
          "valor": 500000
        }
      ]
    }
  ]
}
```


