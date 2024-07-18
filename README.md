<p align="center">
  <h3 align="center">
    Fastify && RabbitMQ
  </h3>
</p>

# Table Of Contents

- [About](#about)
- [Quick Installation](#quick-installation)
  - [Install](#install)
  - [Development](#development)
- [License](#license)

# About

Quick start sample project for RabbitMQ, it works in plug and play logic with all the necessary requirements to use rabbitMQ ready. With this example, you can quickly put your own project into production.

# Quick Installation

## Docker Container Start

```bash
$ docker run -d --hostname my-rabbit --name some-rabbit -p 5672:5672 -p 15672:15672 -e RABBITMQ_DEFAULT_USER=user -e RABBITMQ_DEFAULT_PASS=password rabbitmq:3-management
```

### Install

```bash
$ npm install
```

or

```bash
$ yarn install
```

or

```bash
$ pnpm install
```

### Development

```bash
$ npm dev
```

or

```bash
$ yarn dev
```

or

```bash
$ pnpm dev
```

# License

Distributed under the MIT License. See [LICENSE](./blob/main/LICENSE) for more information.
