# chucaobuon: 
# lilsadfoqs: Dev stage
FROM node:22-bookworm-slim AS development

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG VITE_API_URL
RUN VITE_API_URL=${VITE_API_URL} npm run build

# chucaobuon: 
# lilsadfoqs: Prod stage

FROM caddy:2.9.1-alpine AS production

COPY Caddyfile /etc/caddy/Caddyfile

COPY --from=development /app/dist /srv