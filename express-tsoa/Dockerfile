FROM node:18.9.0-alpine3.15@sha256:c943e7d6af86c1b06d82b0ed070fed714652ac8a10e2184ae619eb5249a70947 as build
ENV NODE_ENV=production

# Copy configs
COPY package.json tsconfig.json tsoa.json ./


# Install ALL packages
RUN yarn install

# Copy source code
COPY src src

# Build the artifact
RUN yarn build

#######################
#### Runner
#######################

FROM node:18.9.0-alpine3.15@sha256:c943e7d6af86c1b06d82b0ed070fed714652ac8a10e2184ae619eb5249a70947
ENV NODE_ENV=production

RUN apk add dumb-init

WORKDIR /opt/service

# Copy configs
COPY --chown=node:node package.json tsconfig.json /opt/service/

# Install PRODUCTION packages
RUN yarn install

# Getting the transpiled code
COPY --chown=node:node --from=build dist /opt/service/dist
COPY --chown=node:node --from=build public /opt/service/public

# Exposing the port
EXPOSE 3030

# Running as a dedicated user
USER node
CMD ["dumb-init", "node", "dist/server.js"]