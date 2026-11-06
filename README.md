# API REST – Tienda de Electrodomésticos

API construida con **Node.js**, **Express** y **MySQL** para administrar una tienda de electrodomésticos: categorías, marcas, proveedores, productos, clientes, ventas y el detalle de cada venta.

La base de datos está desplegada en **Clever Cloud** y la API en **Render**.

- URL pública de la API: `https://api-electrodomesticos.onrender.com`
- Repositorio: `https://github.com/juancontr/api-electrodomesticos`

## Estructura del proyecto

Sigue la estructura de modelo, controlador y ruta indicada por el docente:

```
api-electrodomesticos/
├── src/
│   ├── config/
│   │   └── dbConfig.js            # conexión a MySQL (lee las variables de entorno)
│   ├── models/                    # consultas SQL de cada tabla
│   ├── controllers/               # validación, manejo de errores y respuestas JSON
│   └── routes/                    # endpoints de cada tabla
├── index.js                       # servidor Express
├── .env.example                   # plantilla de variables de entorno
├── .gitignore
└── package.json
```

Cada tabla tiene sus tres archivos: `productoModel.js`, `productoController.js` y `productoRoutes.js` (y así para las demás).

## Requisitos

- Node.js 20.6 o superior (versión LTS)
- Una base de datos MySQL con el script `electrodomesticos.sql` ejecutado

## Instalación y ejecución en local

```bash
git clone https://github.com/juancontr/api-electrodomesticos.git
cd api-electrodomesticos
npm install
```

Copia `.env.example` con el nombre `.env` y llena los datos de conexión. Luego:

```bash
npm run dev
```

La API queda en `http://localhost:3000`. En la consola debe aparecer `Conexion MYSQL exitosa`.

## Variables de entorno

| Variable | Descripción |
| --- | --- |
| `DB_HOST` | Host de MySQL (Clever Cloud) |
| `DB_PORT` | Puerto de MySQL (normalmente 3306) |
| `DB_USER` | Usuario de la base de datos |
| `DB_PASSWORD` | Contraseña de la base de datos |
| `DB_NAME` | Nombre de la base de datos |
| `PORT` | Puerto del servidor (Render lo asigna solo) |

El archivo `.env` no se sube al repositorio: está incluido en `.gitignore`.

## Despliegue en Render

1. New → Web Service → conectar este repositorio.
2. Build Command: `npm install`
3. Start Command: `npm start`
4. En **Environment** agregar `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` y `DB_NAME`.

## Endpoints

Todas las respuestas son JSON. Los recursos son:

| Recurso | Ruta base |
| --- | --- |
| Categorías | `/api/categorias` |
| Marcas | `/api/marcas` |
| Proveedores | `/api/proveedores` |
| Productos | `/api/productos` |
| Clientes | `/api/clientes` |
| Ventas | `/api/ventas` |
| Detalle de ventas | `/api/detalle-ventas` |

Cada recurso tiene las mismas cinco operaciones:

| Método | Ruta | Acción | Respuesta correcta |
| --- | --- | --- | --- |
| GET | `/api/{recurso}` | Listar todos | 200 |
| GET | `/api/{recurso}/:id` | Obtener uno por id | 200 |
| POST | `/api/{recurso}` | Crear (datos en el body) | 201 |
| PUT | `/api/{recurso}/:id` | Actualizar (todos los campos en el body) | 200 |
| DELETE | `/api/{recurso}/:id` | Eliminar | 200 |

`GET /` muestra la lista de recursos disponibles.

### Campos del body por recurso

| Recurso | Campos (* obligatorio) |
| --- | --- |
| categorias | `nombre`*, `descripcion` |
| marcas | `nombre`*, `pais_origen`* |
| proveedores | `nit`*, `razon_social`*, `telefono`*, `correo`*, `ciudad`* |
| productos | `codigo_sku`*, `nombre`*, `precio`*, `stock`*, `garantia_meses`*, `id_categoria`*, `id_marca`*, `id_proveedor` |
| clientes | `documento`*, `nombres`*, `apellidos`*, `correo`*, `telefono`*, `direccion`*, `ciudad`*, `fecha_registro`* (AAAA-MM-DD) |
| ventas | `numero_factura`*, `id_cliente`*, `fecha_venta`* (AAAA-MM-DD HH:MM:SS), `metodo_pago`* (Efectivo, Tarjeta debito, Tarjeta credito, Transferencia), `estado` (Pagada, Pendiente, Anulada; por defecto Pagada) |
| detalle-ventas | `id_venta`*, `id_producto`*, `cantidad`*, `precio_unitario`* |

Los listados de productos, ventas y detalle de ventas incluyen datos de las tablas relacionadas (nombre de la categoría, la marca, el proveedor, el cliente, el total de la factura y el subtotal).

### Ejemplo: crear un producto

```http
POST /api/productos
Content-Type: application/json

{
  "codigo_sku": "LIC-OST-014",
  "nombre": "Licuadora de alta potencia 1200 W",
  "precio": 329900,
  "stock": 12,
  "garantia_meses": 12,
  "id_categoria": 7,
  "id_marca": 7,
  "id_proveedor": 5
}
```

Respuesta `201`:

```json
{ "message": "Producto creado correctamente", "data": { "idInsertado": 14 } }
```

## Manejo de errores

| Código | Cuándo ocurre | Ejemplo de respuesta |
| --- | --- | --- |
| 400 | Datos inválidos, campos vacíos, id no numérico o JSON mal escrito | `{ "error": "Datos inválidos", "detalles": ["El campo precio debe ser un número mayor que 0"] }` |
| 404 | El registro o la ruta no existe | `{ "error": "Producto no encontrado" }` |
| 409 | Valor repetido en un campo UNIQUE | `{ "error": "Ya existe un registro con ese valor (restricción UNIQUE)" }` |
| 409 | Llave foránea inexistente o registro que otras tablas usan | `{ "error": "No se puede eliminar porque otros registros dependen de este (llave foránea)" }` |
| 500 | Error del servidor o de conexión | `{ "error": "Error en el servidor" }` |

## Problemas comunes

- **`ER_NOT_SUPPORTED_AUTH_MODE`** al conectar: el paquete `mysql` no soporta el método de autenticación de esa instancia de MySQL 8. Ejecuta `npm i mysql2` y en `src/config/dbConfig.js` cambia `require('mysql')` por `require('mysql2')`. El resto del código no cambia.
- **La primera petición en Render tarda casi un minuto**: el plan gratuito apaga el servicio cuando no se usa. Basta con abrir la URL y esperar.
