# Cómo tener npm disponible (Node.js)

El proyecto necesita **Node.js** para instalar dependencias y ejecutar el servidor. Si ves *"npm is not recognized"*, sigue esto:

## 1. Descargar Node.js

- Entra a: **https://nodejs.org/**
- Descarga la versión **LTS** (recomendada).
- Ejecuta el instalador.

## 2. Durante la instalación

- Acepta los valores por defecto.
- Si aparece una opción tipo **"Add to PATH"** o **"Add to environment variables"**, **márcala**.
- Finaliza la instalación.

## 3. Después de instalar

- **Cierra por completo** todas las ventanas de PowerShell y de Cursor.
- Vuelve a abrir Cursor (o una terminal nueva).
- En la carpeta del proyecto ejecuta:

```powershell
cd "c:\Users\jesus\Desktop\aletheia project 2"
npm i
npm run dev
```

O haz doble clic en **`instalar-y-ejecutar.bat`** dentro de la carpeta del proyecto (el script buscará npm y, si lo encuentra, instalará y ejecutará por ti).

## Comprobar que Node está instalado

En una terminal nueva escribe:

```powershell
node -v
npm -v
```

Si ves números de versión, Node y npm están listos.
