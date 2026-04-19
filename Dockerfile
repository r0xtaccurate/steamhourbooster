FROM oven/bun:1.2.19 AS base
WORKDIR /app

FROM base AS install
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM base AS release
# Bağımlılıkları kopyala
COPY --from=install /temp/prod/node_modules node_modules

# Kaynak kodları kopyala
COPY src/ src
COPY package.json .

# KRİTİK EKSİK: config.json dosyasını kopyala
COPY config.json . 

ENTRYPOINT [ "bun", "." ]