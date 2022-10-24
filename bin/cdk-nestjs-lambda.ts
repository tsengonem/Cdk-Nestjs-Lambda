import { App } from "aws-cdk-lib";
import { CdkNestStack } from "../lib/cdk-nestjs-lambda-stack";
import * as dotenv from "dotenv";
import * as pathlib from "path";

dotenv.config({
    path:
        process.env?.NODE_ENV == "production"
            ? pathlib.join(__dirname, "../api/.env.production")
            : pathlib.join(__dirname, "../api/.env.develop"),
});
const app = new App();
const nestStackName = process.env.NEST_STACK as string;
new CdkNestStack(app, nestStackName);
