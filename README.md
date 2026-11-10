# Tiendita Digital — Ocarina Producciones

Vidriera comercial y catálogo de productos digitales, con foco inicial en San Patricio del Chañar y posibilidad de alcance regional.

## Estado
- Interfaz adaptable existente conservada.
- Integración frontend con Supabase preparada.
- Catálogo y anuncios se leen desde Supabase cuando se completa la configuración.
- Si Supabase no está configurado, la web conserva el catálogo local de respaldo.
- No incluye todavía pagos automáticos, checkout ni entrega digital protegida.

## 1. Crear la base de datos
1. Abrir el proyecto de Supabase.
2. Ir a **SQL Editor**.
3. Abrir el archivo `supabase/schema.sql` de este repositorio.
4. Copiar y ejecutar el contenido completo.

Esto crea las tablas `products` y `ads`, activa Row Level Security y configura el bucket público `product-images` para imágenes. Los archivos digitales de pago NO deben guardarse en ese bucket público.

## 2. Conectar la web
Editar `js/supabase-config.js` y completar:
- `url`: Project URL.
- `anonKey`: anon/publicable key.

Ambos valores se encuentran en **Supabase > Project Settings > API** (la ubicación exacta puede variar según la interfaz).

**Nunca utilizar la clave `service_role` ni una secret key en el navegador, HTML o GitHub.**

## 3. Cargar contenido
Desde **Supabase > Table Editor**:
- En `products`, crear productos y poner `is_published = true` para mostrarlos.
- En `ads`, crear anuncios y poner `is_active = true`.
- Para un anuncio principal usar `slot = principal`; para secundarios, `slot = secundario`.
- `starts_at` y `ends_at` permiten programar la vigencia. Se pueden dejar vacíos.

Las tablas no permiten escrituras públicas desde la web. La gestión inicial se hace desde el panel de Supabase.

## 4. WhatsApp
Editar `js/config.js` y completar `whatsapp` con el número en formato internacional, solo números (Argentina: 549 + característica + número). No incluir el signo +.

## Seguridad y límites
- RLS habilitado en las tablas.
- Los visitantes solo pueden leer productos publicados y anuncios activos/vigentes.
- No se habilitaron registros ni escrituras públicas.
- El bucket de imágenes es público; usarlo solo para imágenes que puedan verse públicamente.
- No almacenar contraseñas, claves privadas ni archivos de compradores en tablas públicas.

## Pendiente antes de vender
1. Configurar y probar Supabase con las credenciales del proyecto.
2. Cargar productos reales, precios y recursos terminados.
3. Definir cobro, política de entrega, reembolsos y contacto.
4. Implementar checkout y entrega protegida si se venderán descargas.
5. Implementar un panel de administración con autenticación si se necesita gestionar contenido sin entrar a Supabase Studio.
6. Probar enlaces, móvil, accesibilidad, permisos y comportamiento ante errores.

## Archivos
- `index.html`: interfaz.
- `css/styles.css`: diseño.
- `js/config.js`: WhatsApp y catálogo de respaldo.
- `js/app.js`: renderizado de respaldo.
- `js/supabase-config.js`: credenciales públicas del proyecto.
- `js/supabase.js`: lectura del catálogo y anuncios.
- `supabase/schema.sql`: estructura de base de datos y políticas RLS.
