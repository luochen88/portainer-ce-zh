# 非官方 Portainer CE 简体中文修改版

这是社区维护的非官方 Portainer CE 简体中文修改版，与 Portainer.io 无隶属关系，也不由其提供支持；Portainer 原始软件版权归 Portainer.io 及原贡献者；本仓库只对修改和中文翻译负责。源码已被修改，本 fork 和镜像不得表示为官方原版。相关许可和来源请参阅 [LICENSE](LICENSE)、[ATTRIBUTIONS.md](ATTRIBUTIONS.md) 以及 [Portainer 上游仓库](https://github.com/portainer/portainer)。

中文主要由 AI 生成/辅助翻译，可能存在错译且未承诺经过人工全面校对，请以英文界面和官方文档为准。Kubernetes、Swarm、Edge Agent 等技术专名保持原文。

## 中文版使用说明

本版本默认使用简体中文，可在“用户设置”中切换 English；语言偏好仅保存在当前浏览器的 `localStorage`。GHCR 镜像提供 `linux/amd64` 与 `linux/arm64` 架构，镜像名为 `ghcr.io/luochen88/portainer-ce-zh`。`zh-cn` 是跟随分支更新的可变标签；生产部署请固定不可变标签 `zh-cn-2.45.0-<short-sha>`。

```bash
docker volume create portainer_data
docker run -d --name portainer --restart=always \
  -p 8000:8000 -p 9443:9443 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  ghcr.io/luochen88/portainer-ce-zh:zh-cn
```

等价的 Compose 配置：

```yaml
services:
  portainer:
    image: ghcr.io/luochen88/portainer-ce-zh:zh-cn
    restart: always
    ports:
      - "8000:8000"
      - "9443:9443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - portainer_data:/data
volumes:
  portainer_data:
```

本地 production 构建：

```bash
pnpm install --frozen-lockfile
make ENV=production build-client
touch dist/storybook
make ENV=production PLATFORM=linux ARCH=amd64 SKIP_GO_GET=true CONTAINER_IMAGE_TAG=zh-cn-local build-all
docker buildx build --load -t portainer-ce-zh:local -f build/linux/Dockerfile .
```

本 fork 的问题反馈地址为 <https://github.com/luochen88/portainer-ce-zh/issues>；上游 Portainer 产品问题请通过 [官方问题渠道](https://github.com/portainer/portainer/issues) 反馈。

---

<p align="center">
  <img title="portainer" src='https://github.com/portainer/portainer/blob/develop/app/assets/images/portainer-github-banner.png?raw=true' />
</p>

**Portainer Community Edition** is a lightweight service delivery platform for containerized applications that can be used to manage Docker, Swarm, Kubernetes and ACI environments. It is designed to be as simple to deploy as it is to use. The application allows you to manage all your orchestrator resources (containers, images, volumes, networks and more) through a ‘smart’ GUI and/or an extensive API.

Portainer consists of a single container that can run on any cluster. It can be deployed as a Linux container or a Windows native container.

**Portainer Business Edition** builds on the open-source base and includes a range of advanced features and functions (like RBAC and Support) that are specific to the needs of business users.

- [Compare Portainer CE and Compare Portainer BE](https://www.portainer.io/features)
- [Take3 – get 3 free nodes of Portainer Business for as long as you want them](https://www.portainer.io/take-3)
- [Portainer BE install guide](https://academy.portainer.io/install/)

## Latest Version

Portainer CE is updated regularly. We aim to do an update release every couple of months.

[![latest version](https://img.shields.io/github/v/release/portainer/portainer?color=%2344cc11&label=Latest%20release&style=for-the-badge)](https://github.com/portainer/portainer/releases/latest)

## Getting started

- [Deploy Portainer](https://docs.portainer.io/start/install-ce)
- [Documentation](https://docs.portainer.io)
- [Contribute to the project](https://docs.portainer.io/contribute/contribute)

## Features & Functions

View [this](https://www.portainer.io/features) table to see all of the Portainer CE functionality and compare to Portainer Business.

## Getting help

Portainer CE is an open source project and is supported by the community. You can buy a supported version of Portainer at portainer.io

Learn more about Portainer's community support channels [here.](https://www.portainer.io/resources/get-help/get-support)

- Issues: https://github.com/portainer/portainer/issues
- Slack (chat): [https://portainer.io/slack](https://portainer.io/slack)

You can join the Portainer Community by visiting [https://www.portainer.io/join-our-community](https://www.portainer.io/join-our-community). This will give you advance notice of events, content and other related Portainer content.

## Reporting bugs and contributing

- Want to report a bug or request a feature? Please open [an issue](https://github.com/portainer/portainer/issues/new).
- Want to help us build **_portainer_**? Follow our [contribution guidelines](https://docs.portainer.io/contribute/contribute) to build it locally and make a pull request.

## Generating API types

The frontend consumes a TypeScript API client (SDK functions and request/response types) that is generated from the Go API's Swagger annotations. Regenerate it after any API change — a new endpoint, a changed request/response shape, or a removed endpoint:

```bash
make generate-api
```

See [`openapi-ts.config.ts`](./openapi-ts.config.ts) for generator configuration and [`CONTRIBUTING.md`](./CONTRIBUTING.md#adding-api-docs) for API documentation guidance.

## Security

For information about reporting security vulnerabilities, please see our [Security Policy](SECURITY.md).

## Work for us

If you are a developer, please see the Portainer careers page at <https://apply.workable.com/portainer/>.

## Privacy

Please see [Portainer's privacy policy](https://www.portainer.io/legal/privacy-policy).

## Limitations

Portainer supports "Current - 2 docker versions only. Prior versions may operate, however these are not supported.

## Licensing

Portainer is licensed under the zlib license. See [LICENSE](./LICENSE) for reference.

Portainer also contains code from open source projects. See [ATTRIBUTIONS.md](./ATTRIBUTIONS.md) for a list.
