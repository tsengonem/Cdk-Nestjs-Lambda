reldir="$( dirname -- "$0"; )";
cd "$reldir";
directory="$( pwd; )";
cd api
npm run build:prod
cd $directory
cdk synth
sam local start-api --warm-containers EAGER -t cdk.out/CdkNestStack-dev.template.json
