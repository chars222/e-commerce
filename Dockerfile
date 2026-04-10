# ==========================================
# ETAPA 1: Construcción (Node.js)
# ==========================================
FROM node:20-alpine as builder

WORKDIR /app

# Copiamos package.json e instalamos dependencias
COPY package*.json ./
RUN npm install

# Copiamos el resto del código
COPY . .

# Recibimos la URL del backend como argumento desde el docker-compose
ARG VITE_API_URL=https://api.centralmoda.store
ENV VITE_API_URL=${VITE_API_URL}

# Construimos la versión optimizada (dist)
RUN npm run build


# ==========================================
# ETAPA 2: Servidor Web (Nginx)
# ==========================================
FROM nginx:alpine

# Copiamos la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos la carpeta "dist" que generó Vite al servidor Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]