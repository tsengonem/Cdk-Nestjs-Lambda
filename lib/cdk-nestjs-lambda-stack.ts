import * as lambda from "aws-cdk-lib/aws-lambda";
import * as gateway from "aws-cdk-lib/aws-apigateway";
import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as logs from "aws-cdk-lib/aws-logs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as dotenv from "dotenv";
import * as pathlib from "path";

export class CdkNestStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        console.log(process.env?.NODE_ENV);
        dotenv.config({
            path:
                process.env?.NODE_ENV == "production"
                    ? pathlib.join(__dirname, "../api/.env.production")
                    : pathlib.join(__dirname, "../api/.env.develop"),
        });
        let lambdaEnv = {
            NODE_PATH: "$NODE_PATH:/opt",
            ...dotenv.config({
                path:
                    process.env?.NODE_ENV == "production"
                        ? pathlib.join(__dirname, "../api/.env.production")
                        : pathlib.join(__dirname, "../api/.env.develop"),
            })["parsed"],
        };

        const tableName: string = process.env.DYNAMODB_TABLE as string;
        const dynamoTable = new dynamodb.Table(this, tableName, {
            tableName: tableName,
            partitionKey: {
                name: "partitionKey",
                type: dynamodb.AttributeType.STRING,
            },
            sortKey: {
                name: "sortKey",
                type: dynamodb.AttributeType.STRING,
            },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            tableClass: dynamodb.TableClass.STANDARD,
        });

        const backendLambdaName: string = process.env.LAMBDA_NAME as string;
        const backendLambda = new lambda.Function(this, backendLambdaName, {
            functionName: backendLambdaName,
            runtime: lambda.Runtime.NODEJS_16_X,
            code: lambda.Code.fromAsset("api/dist", {
                exclude: ["node_modules"],
            }),
            handler: "main.handler",
            //   layers: [lambdaLayer],
            environment: lambdaEnv,
            timeout: Duration.seconds(10),
            memorySize: 1024,
        });

        dynamoTable.grantReadWriteData(backendLambda);

        const logGroupName: string = process.env.LOG_GROUP as string;
        const logGroup = new logs.LogGroup(this, logGroupName, {
            logGroupName: logGroupName,
        });
        // const whitelistedIps = [
        // ];
        const apiResourcePolicy = new iam.PolicyDocument({
            statements: [
                new iam.PolicyStatement({
                    actions: ["execute-api:Invoke"],
                    principals: [new iam.AnyPrincipal()],
                    resources: ["execute-api:/*/*/*"],
                }),
                // new iam.PolicyStatement({
                //     effect: iam.Effect.DENY,
                //     principals: [new iam.AnyPrincipal()],
                //     actions: ["execute-api:Invoke"],
                //     resources: ["execute-api:/*/*/*"],
                //     conditions: {
                //         NotIpAddress: {
                //             "aws:SourceIp": whitelistedIps,
                //         },
                //     },
                // }),
            ],
        });

        const gatewayName: string = process.env.APIGATEWAY as string;
        const gatewayStageName: string = process.env.APIGATEWAY_STAGE as string;
        new gateway.LambdaRestApi(this, gatewayName, {
            handler: backendLambda,
            deployOptions: {
                accessLogDestination: new gateway.LogGroupLogDestination(
                    logGroup
                ),
                accessLogFormat: gateway.AccessLogFormat.clf(),
                stageName: gatewayStageName,
            },
            policy: apiResourcePolicy,
        });
    }
}
