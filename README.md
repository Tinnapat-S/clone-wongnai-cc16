## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Create Database

```bash
# change directory to db
$ cd db
# run commande sequence to build database postgres on docker at port 5555
$ docker-compose up --build
```

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

-   Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
-   Website - [https://nestjs.com](https://nestjs.com/)
-   Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

## Prisma

```bash
# Generate prisma
$ pnpx prisma generate

# Migrate table and create new migration version + seed
$ pnpx prisma migrate dev

# To sync database depend on schema.prisma file without creating migration version
$ pnpx prisma db push
```
