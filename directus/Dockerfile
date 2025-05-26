FROM --platform=linux/amd64 directus/directus:11.4.1 as base
USER root

RUN apk add --no-cache curl

# setup backend
WORKDIR /directus
RUN corepack enable
RUN rm node_modules/.modules.yaml
RUN pnpm install ...


COPY ./ap-southeast-1-bundle.pem  ./ap-southeast-1-bundle.pem 
COPY ./snapshots ./snapshots

# setup nginx 
WORKDIR /

RUN apk add --no-cache nginx
RUN mkdir -p /var/lib/nginx/tmp /var/log/nginx /run/nginx && \
    chown -R node:node /var/lib/nginx /var/log/nginx /run/nginx

COPY nginx.prod.conf /etc/nginx/http.d/default.conf

COPY ./ecosystem.config.js ecosystem.config.js
COPY ./entrypoint.sh entrypoint.sh

RUN chown node:node ecosystem.config.js
RUN chown node:node entrypoint.sh

RUN npm install pm2 -g


# setup permissions
RUN chown -R node:node /directus

USER node 
RUN chmod +x /entrypoint.sh


EXPOSE 8000

ENTRYPOINT /entrypoint.sh

