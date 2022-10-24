<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

# Description(In /)
[Aws cdk workshop](https://cdkworkshop.com/20-typescript.html) the cdk worshop.
## Aws CLI settings
詳細步驟參考：
https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html#install-bundle-other
## Aws cdk install
```bash
npm install -g aws-cdk
cdk --version
```
## Aws cdk & nestjs run project
```bash
mkdir <project-name> && cd <project-name>
cdk init app --language typescript
nest new api
```
## setting bin & lib
### bin/\<project-name>.ts
```TypeScript
import * as cdk from '@aws-cdk/core';
import { CdkNestStack } from '../lib/showeasy_lambda-stack';

const app = new cdk.App();
new CdkNestStack(app, 'CdkNestStack');
```
- CdkNestStack is aws lambda's stack app name.
### lib/\<project-name>-stack.ts
```TypeScript
import * as cdk from "@aws-cdk/core";
import { Function, Code, Runtime, LayerVersion } from '@aws-cdk/aws-lambda';
import * as gateway from "@aws-cdk/aws-apigateway";

export class CdkNestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaLayer = new LayerVersion(this, "ShowEasyServerlessLayer", {
      code: Code.fromAsset("api/node_modules"),
      compatibleRuntimes: [
        Runtime.NODEJS_16_X,
      ],
      description: 'Api Handler Dependencies',
    });

    const backendLambda = new Function(this, "ServerlessBackend", {
      runtime: Runtime.NODEJS_16_X,
      code: Code.fromAsset("api/dist", {
        exclude: ['node_modules'],
      }),
      handler: "main.handler",
      layers: [lambdaLayer],
      environment: {
        NODE_PATH: "$NODE_PATH:/opt",
      },
    });
    new gateway.LambdaRestApi(this, "ServerlessEndpoint", {
      handler: backendLambda,
    });
  }
}
```
-  LayerVersion is Aws lambda's Layer, is for the application's packages.
-  Function is Aws lambda Function.
-  LambdaRestApi is Aws Api-Gateway.
-  If use webpack pack the project can only use the Function and LambdaRestApi, LayerVersion can ignore.
## Test Lambda in locally
### requiresment:
- [Install the AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install-mac.html)
- [Install Docker Desktop on Mac](https://docs.docker.com/desktop/install/mac-install/)
- setting cdk
#### test Lambda Function:
```bash
cd <project-name>
cdk synth
sam local invoke -t cdk.out/CdkNestStack.template.json
```
#### test Api Gateway:
```bash
cd <project-name>
cdk synth
sam local start-api --warm-containers EAGER -t cdk.out/CdkNestStack.template.json
```
or
```bash
cd api
npm run start:test:aws
```
## Build All to Aws
### Develop:
```bash
cd <project-name>/api
npm install
npm run deploy:dev
# this command will run deploy.sh 👆
```
### Production:
```bash
cd <project-name>/api
npm install
npm run deploy:prod
# this command will run deploy.sh 👆
```
### In deploy.sh
```bash
reldir="$( dirname -- "$0"; )";
cd "$reldir";
directory="$( pwd; )";
cd api
npm run build:prod
cd $directory
cdk synth
cdk deploy
```
- (command: cdk bootstrap) is for create all service to Aws.
- (command: cdk synth) which causes the resources defined in it to be translated into an AWS CloudFormation template.
> if need check diff from origin Aws status can use:
> ```bash
> cdk diff
> ```
# Description(In /api folder)

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## build the app

```bash
# development
$ npm run build

# for aws::lambda
$ npm run build:prod

# production mode
$ npm run build:prod
```
## webpack setting for lambda
```TypeScript
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

console.log('start build');
module.exports = {
    entry: './src/main',
    target: 'node',
    externals: ['aws-sdk'],
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: {
                    loader: 'ts-loader',
                    options: { transpileOnly: true },
                },
                exclude: /node_modules/
            }
        ]
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'commonjs'
    },
    resolve: {
        extensions: ['.js', '.ts', '.json'],
    },
    plugins: [
        new webpack.IgnorePlugin({
            checkResource(resource) {
                const lazyImports = [
                    '@nestjs/microservices',
                    '@nestjs/microservices/microservices-module',
                    'cache-manager',
                    'class-validator',
                    'class-transformer',
                ];
                if (!lazyImports.includes(resource)) {
                    return false;
                }
                try {
                    require.resolve(resource, {
                        paths: [process.cwd()],
                    });
                } catch (err) {
                    return true;
                }
                return false;
            },
        }),
        new ForkTsCheckerWebpackPlugin(),
    ],
};
```
### 參考
* [Aws cdk typescript example](https://github.com/aws-samples/aws-cdk-examples/tree/master/typescript)
* [Aws cdk typeScript workshop example](https://cdkworkshop.com/20-typescript.html)
* [Nestjs Serverless](https://docs.nestjs.com/faq/serverless)
* [Nestjs Webpack](https://docs.nestjs.com/recipes/hot-reload)