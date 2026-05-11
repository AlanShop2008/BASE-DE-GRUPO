# ALAN BOT

Bot desarrollado en **Node.js**.

---

# 📦 Instalación

Sigue estos pasos para instalar correctamente el proyecto en tu **VPS (Ubuntu / Debian)**.

---

# 1️⃣ Eliminar versiones antiguas de Node.js

Primero elimina cualquier versión anterior para evitar conflictos.

```bash
sudo apt remove nodejs -y
sudo apt autoremove -y
```

---

# 2️⃣ Instalar Node.js 20

Agregar el repositorio oficial de **NodeSource**:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
```

Instalar Node.js:

```bash
sudo apt install -y nodejs
```

Verificar instalación:

```bash
node -v
npm -v
```

---

# 3️⃣ Instalar dependencias del proyecto

Dentro de la carpeta del proyecto ejecuta:

```bash
npm install chokidar yargs lodash chalk cfonts syntax-error node-cache pino @hapi/boom lowdb google-libphonenumber
```

---

# 4️⃣ Ejecutar el bot

```bash
node index.js
```

---

# ⚙️ Recomendado (Mantener el bot 24/7)

Instalar **PM2**:

```bash
npm install -g pm2
```

Iniciar el bot:

```bash
pm2 start index.js
```

Guardar procesos:

```bash
pm2 save
```

Activar inicio automático:

```bash
pm2 startup
```

---

# 🧑‍💻 Desarrollador

**ALANSHOP DEVELOPER**
