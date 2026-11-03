# syntax=docker/dockerfile:1.7

FROM node:24-alpine AS base

WORKDIR /app

FROM base AS tooling

COPY package.json ./
RUN npm install --global "$(node -p 'require("./package.json").packageManager')" --no-audit --no-fund

FROM tooling AS deps

COPY pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts

FROM deps AS development

COPY . .
EXPOSE 3000
CMD ["pnpm", "run", "dev", "--hostname", "0.0.0.0"]

FROM tooling AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN --mount=type=secret,id=production_env,required=true \
    set -a && . /run/secrets/production_env && set +a && pnpm run build

FROM base AS runner

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN apk add --no-cache dumb-init \
    && addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/content ./content

USER nextjs
EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
