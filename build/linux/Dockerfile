FROM portainer/base@sha256:4227b7cb62ac7de12d9193325418506f790286fbb47bf918d1f3dfe956029359 AS production

LABEL org.opencontainers.image.title="Portainer CE zh-CN (Unofficial)" \
  org.opencontainers.image.description="Unofficial Simplified Chinese modification of Portainer CE, maintained by the community." \
  org.opencontainers.image.vendor="luochen88/portainer-ce-zh contributors" \
  org.opencontainers.image.source="https://github.com/luochen88/portainer-ce-zh" \
  org.opencontainers.image.url="https://github.com/luochen88/portainer-ce-zh" \
  org.opencontainers.image.licenses="Zlib" \
  org.opencontainers.image.documentation="https://github.com/luochen88/portainer-ce-zh/blob/zh-cn/README.md"

COPY dist/mustache-templates /mustache-templates/
COPY LICENSE /licenses/LICENSE
COPY ATTRIBUTIONS.md /licenses/ATTRIBUTIONS.md
COPY dist/portainer /
COPY dist/public /public/

COPY build/docker-extension /

# storybook exists only in portainerci builds
COPY dist/storybook* /storybook/

VOLUME /data
WORKDIR /

EXPOSE 9000
EXPOSE 9443
EXPOSE 8000

ARG GIT_COMMIT=unspecified
ARG BUILD_DATE=unspecified
LABEL git_commit=$GIT_COMMIT \
  org.opencontainers.image.revision=$GIT_COMMIT \
  org.opencontainers.image.created=$BUILD_DATE \
  io.portainer.server="true"

ENTRYPOINT ["/portainer"]

