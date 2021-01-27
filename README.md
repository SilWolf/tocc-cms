# tocc-cms

TOCC CMS built with Strapi

# Table of Contents

- [Prerequisite](#prerequisite)
- [First time setup](#first-time-setup)
- [Development](#development)
- [Tech stack](#tech-stack)
- [Deployment](#deployment)
- [Road Map](#road-map)

## Prerequisite

- Node 12+
- Docker 19.03.0+
- Yarn
- [AWS CLI](https://aws.amazon.com/tw/cli/)

## First time setup

1. `cp .env.demo .env`
2. `yarn`
3. `yarn docker:up` to create MongoDB instance and S3 instance on Docker.
4. (skip if you already have one)`aws configure` to create a fake & dummy AWS credentials.
5. `aws --endpoint-url=http://localhost:4566 s3 mb s3://tocc-cms-strapi-bucket` to create a s3 bucket
6. `yarn docker:stop`

## Development

1. `yarn docker:start` to start Docker containers
2. (Optional) `yarn strapi:restore` (:warning: \*1)
3. `yarn dev`
4. When your development is done, `yarn docker:stop`

(:warning: \*1) **BE CAUTION WHEN DOING IT as IT MAY OVERRIDE YOUR WORKS!**  
Since [Strapi stores plugin configuration on database](https://strapi.io/documentation/developer-docs/latest/getting-started/troubleshooting.html#can-i-store-my-content-manager-layout-configurations-in-the-model-settings), whenever there is a change, you need to restore it manually.  
Do it when you find there is a update on `./.strapi/config.json`, else you can skip this step.

## Git Hooks

### pre-commit

The terminal will `strapi config:dump -f ./.strapi/config.json && git add ./.strapi/config.json` once, to download latest Strapi plugin config and push it.

### commit-msg

The terminal will check your commit message with [CommitLint](https://github.com/conventional-changelog/commitlint). Make sure you are following syntax.

## Cleanup

- `yarn docker:down` to remove Docker containers entirely.

## Tech stack

- [Strapi](https://strapi.io/)

## Deployment

```
yarn build
```

## Road Map

:white_check_mark: Setup  
:white_check_mark: AWS S3 Integration  
:white_check_mark: Strapi plugin configuration semi-auto dump/restore  
:white_circle: data seeding
