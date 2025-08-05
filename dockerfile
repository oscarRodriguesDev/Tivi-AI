# Stage 1: Build
FROM node:18-alpine AS builder

# Instalar dependências do sistema necessárias para prisma
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiar arquivos de dependências para cache
COPY package.json package-lock.json* yarn.lock* ./

# Instalar dependências
RUN npm ci

# Copiar o restante do código
COPY . .

# Gerar client Prisma e build Next.js
RUN npx prisma generate
RUN npm run build

# Stage 2: Produção
FROM node:18-alpine AS runner

WORKDIR /app

# Instalar dependências de produção apenas
COPY package.json package-lock.json* yarn.lock* ./
RUN npm ci --production

# Copiar build e prisma client do builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

# Expor a porta padrão do Next.js
EXPOSE 3000

# Rodar o servidor Next.js em modo produção
CMD ["npm", "start"]
