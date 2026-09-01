# syntax=docker/dockerfile:1

########## BASE: tooling pnpm (corepack) ##########
FROM node:24-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
ARG PNPM_VERSION=11.1.1
RUN corepack enable \
  && corepack prepare pnpm@${PNPM_VERSION} --activate
WORKDIR /app

########## DEPS: instal semua dependency (termasuk dev, untuk build) ##########
FROM base AS deps
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/
RUN pnpm install --frozen-lockfile

########## BUILD: kompilasi backend (nest build) + frontend (vite build) ##########
FROM base AS build
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --from=deps --chown=node:node /app/frontend/node_modules ./frontend/node_modules
COPY nest-cli.json package.json tsconfig.json tsconfig.build.json pnpm-workspace.yaml ./
COPY src ./src
COPY frontend ./frontend
RUN pnpm run build:prod

########## PROD-DEPS: dependency runtime saja (tanpa devDependencies) ##########
FROM base AS prod-deps
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY frontend/package.json ./frontend/
RUN pnpm install --prod --frozen-lockfile

########## RUNTIME: image produksi yang kecil & non-root ##########
FROM node:24-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/public ./public
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=prod-deps --chown=node:node /app/frontend/package.json ./frontend/package.json
COPY --chown=node:node package.json ./

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then((r) => { if (!r.ok) process.exit(1); }).catch(() => process.exit(1))"

CMD ["node", "dist/main"]