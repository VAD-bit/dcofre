# D'Cofre Muebles

Asistente web para crear presupuestos de muebles en cuatro pasos, con previsualización en tiempo real y exportación mediante impresión del navegador.

## Requisitos

- Node.js 20 o superior
- npm 10 o superior

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Validación

```bash
npm run lint
npm run build
```

## Producción

```bash
npm run start
```

El botón **Descargar PDF / Imprimir** utiliza la ventana de impresión del navegador. Selecciona **Guardar como PDF** para exportar la cotización.

## Subir a GitHub

El proyecto ya incluye `.gitignore` para no subir `node_modules`, `.next` ni archivos `.env`.

```bash
git add .
git commit -m "Preparar asistente de presupuestos"
git remote add origin https://github.com/USUARIO/REPOSITORIO.git
git push -u origin main
```

Reemplaza la URL del remoto por la de tu repositorio. No subas claves privadas ni archivos `.env`.
