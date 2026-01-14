# 🏪 ScannerKiosk - Consulta de Precios Inteligente

**ScannerKiosk** es una aplicación web de alto rendimiento diseñada para terminales de consulta (kioscos) en puntos de venta. Permite a los clientes escanear códigos de barras o ingresar códigos de productos para obtener de forma instantánea el precio y nombre del artículo, optimizando la experiencia de compra y reduciendo la carga de trabajo del personal.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## 🚀 Características Principales

- **Búsqueda Multi-Código**: Sistema optimizado para buscar en múltiples columnas de códigos (hasta 5 variantes por producto) en la base de datos.
- **Foco Agresivo (Scanner Friendly)**: Lógica de auto-enfoque persistente diseñada específicamente para trabajar con escáneres de códigos de barras físicos que emulan teclados.
- **SpeedMode & Auto-Reset**: Una vez mostrado el precio, la aplicación cuenta con un temporizador de **10 segundos** que limpia el estado y regresa automáticamente a la pantalla de búsqueda, dejando el sistema listo para el siguiente cliente sin intervención humana.
- **Interfaz de Alto Contraste**: Diseño limpio y minimalista que prioriza la legibilidad del precio y el nombre del producto bajo diferentes condiciones de iluminación.
- **Robustez y Estabilidad**: Manejo de errores para productos no encontrados o fallos de red, con reintentos automáticos mediante el refresco de estado.

## 🛠️ Stack Tecnológico

- **Frontend**: [React 19](https://react.dev/) para una interfaz reactiva y eficiente.
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/) para garantizar la integridad de los datos y un desarrollo libre de errores de tipo.
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/) para un diseño moderno, responsivo y de carga ultrarrápida.
- **Backend & Database**: [Supabase](https://supabase.com/) como motor de base de datos en tiempo real y gestión de la API REST.
- **Iconografía**: [Lucide React](https://lucide.dev/) para indicadores visuales claros e intuitivos.

## 📊 Estructura de Datos (Supabase)

La aplicación está configurada para consumir una tabla llamada `productos` con el siguiente esquema optimizado para inventarios reales:

| Columna | Tipo | Descripción |
| :--- | :--- | :--- |
| `Producto` | `text` | Nombre comercial del artículo. |
| `Precio` | `numeric` | Precio de venta al público. |
| `Codigo` | `text` | Código de barras principal (EAN/UPC). |
| `Codigo1...4` | `text` | Códigos alternativos o secundarios. |

## ⚙️ Configuración del Entorno

Para conectar esta aplicación con tu propia instancia de Supabase, asegúrate de configurar las siguientes variables en el archivo `services/supabaseClient.ts`:

```typescript
const SUPABASE_URL = 'TU_URL_DE_SUPABASE';
const SUPABASE_ANON_KEY = 'TU_ANON_KEY_DE_SUPABASE';
```

## 📖 Cómo funciona la App

1. **Estado Inactivo (IDLE)**: La aplicación muestra un mensaje de bienvenida invitando al cliente a escanear un producto. El cursor se mantiene oculto pero activo en el campo de entrada.
2. **Escaneo**: Al detectar una entrada (del escáner o teclado), se dispara una consulta asíncrona a Supabase.
3. **Resultado**: 
   - Si existe: Se muestra una tarjeta con el nombre del producto en mayúsculas y el precio destacado en formato moneda.
   - Si no existe: Se muestra una alerta visual de "Producto no encontrado".
4. **Ciclo de Vida**: Tras 10 segundos de inactividad en la pantalla de resultado, la aplicación ejecuta un `resetScanner()` que limpia el estado y devuelve el foco al input principal para la próxima consulta.

---

Desarrollado con ❤️ para mejorar la experiencia de retail moderno.
