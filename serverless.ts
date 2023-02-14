import hello from '@functions/hello';

const serverlessConfiguration = {
  service: 'sample-step-functions',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-step-functions'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  functions: { hello },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  stepFunctions: {
    stateMachines: {
      hellostepfunc1: {
        events: [{
          http: {
            path: 'gofunction',
            method: 'POST',
            cors: {
              origin: "*",
              headers: [
                "Content-Type",
                "X-Amz-Date",
                "Authorization",
                "X-Api-Key",
                "X-Amz-Security-Token",
                "X-Amz-User-Agent"
              ]
            }
          }
        }],
        name: 'myStateMachine',
        definition: {
          StartAt: 'HelloWorld1',
          States: {
            HelloWorld1: {
              Type: 'Task',
              Resource: {
                'Fn::GetAtt': ['hello', 'Arn']
              },
              End: true
            }
          }
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
