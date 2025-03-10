# chucaobuon: 
# lilsadfoqs: Only used in Production

FROM caddy:2.9.1-builder AS builder

RUN xcaddy build \
    --with github.com/mholt/caddy-ratelimit
    

FROM caddy:2.9.1-alpine 

COPY Caddyfile /etc/caddy/Caddyfile

COPY --from=builder /usr/bin/caddy /usr/bin/caddy