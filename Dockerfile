# syntax=docker/dockerfile:1.7

# `base`: imagem e diretório base usados pelos demais stages.
FROM node:24-alpine AS base
WORKDIR /app

# `deps`: instala dependências do projeto para o build do Next.js.
FROM base AS deps
COPY package*.json ./
RUN npm ci

# `build`: compila o app e gera `.next/standalone` e assets estáticos.
FROM deps AS build
COPY . .
RUN npm run build

# `runner`: runtime enxuto com apenas artefatos necessários para produção.
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# Arquivos públicos servidos diretamente pelo Next.
COPY --from=build /app/public ./public
# Bundle standalone inclui o servidor Node + dependências mínimas.
COPY --from=build /app/.next/standalone ./
# Assets estáticos gerados no build.
COPY --from=build /app/.next/static ./.next/static
# Execução sem privilégios de root.
USER node
EXPOSE 3000
CMD ["node", "server.js"]
