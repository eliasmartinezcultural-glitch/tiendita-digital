# Tiendita Digital — Ocarina Producciones

Vidriera comercial y catálogo de productos digitales, con foco inicial en San Patricio del Chañar y posibilidad de alcance regional.

## Qué incluye esta versión
- Sitio público adaptable a celulares.
- Catálogo y publicidad leídos desde Supabase.
- Panel privado en `admin.html` para crear, editar, publicar y eliminar productos y anuncios.
- Carga de imágenes de productos a Supabase Storage.
- Inicio de sesión con Supabase Auth.
- Row Level Security: visitantes solo ven contenido publicado; solo administradores autorizados pueden modificar datos.
- Catálogo local de respaldo si Supabase todavía no está configurado.

## Paso 1 — Preparar Supabase
1. Abrir el proyecto en Supabase.
2. Ir a **SQL Editor**.
3. Abrir `supabase/schema.sql` en GitHub.
4. Copiar el archivo completo, pegarlo en una consulta nueva y ejecutar.
5. Ir a **Project Settings > API** y copiar Project URL y anon/publishable key.
6. Completar esos dos valores en `js/supabase-config.js`.

La clave pública anon/publishable está diseñada para el navegador y su acceso queda limitado por RLS. Nunca pegar `service_role`, secret key ni contraseñas en el repositorio.

## Paso 2 — Crear tu cuenta administradora
1. En Supabase, entrar a **Authentication > Users**.
2. Crear un usuario con tu correo y una contraseña segura. No habilitar el registro público.
3. Copiar el UUID/ID de ese usuario.
4. Volver a **SQL Editor** y ejecutar esta consulta, reemplazando el texto por tu UUID:

```sql
insert into public.admin_users(user_id)
values ('PEGAR-AQUI-EL-UUID-DEL-USUARIO');
```

Solo los UUID incluidos en `admin_users` tienen permisos administrativos. No compartir la contraseña.

## Paso 3 — Entrar al panel
Abrir `admin.html` en el sitio publicado. Ingresar con el correo y contraseña creados en Supabase.

Desde el panel se puede:
- Crear productos, editar su información y publicar/despublicar.
- Subir imágenes JPG, PNG o WebP de hasta 5 MB.
- Crear anuncios principales y secundarios.
- Activar o pausar anuncios y definir fechas de vigencia.

## Paso 4 — Contacto
Editar `js/config.js` y completar el número de WhatsApp en `whatsapp`, con código de país y solo números (Argentina: 549 + característica + número). Revisar también los mensajes predeterminados.

## Límites actuales
Esta versión es un catálogo con consultas y publicidad. Todavía no procesa pagos, no administra pedidos, no entrega descargas privadas y no liquida dinero a vendedores. No anunciar productos como disponibles hasta que existan los archivos finales, precios y condiciones.

Para vender archivos digitales, no guardar los archivos pagos en el bucket público `product-images`. La próxima etapa debe implementar pagos y descargas protegidas con URLs firmadas, junto con términos, privacidad y política de reembolso.

## Archivos
- `index.html`: tienda pública.
- `admin.html`: panel privado.
- `css/styles.css`, `css/admin.css`: estilos.
- `js/config.js`: WhatsApp y catálogo de respaldo.
- `js/app.js`: renderizado público.
- `js/supabase-config.js`: Project URL y clave pública.
- `js/supabase.js`: lectura del catálogo y anuncios.
- `js/admin.js`: autenticación y administración.
- `supabase/schema.sql`: tablas, bucket y políticas de seguridad.
