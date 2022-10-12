import fs from 'fs';
import path from 'path';
import { Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import {
  Project,
  BuildSpec,
  Source,
  FilterGroup,
  EventAction,
  LinuxBuildImage,
  ComputeType
} from 'aws-cdk-lib/aws-codebuild';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class CdkStack extends Stack {
  constructor (scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // // Already exists in main TS account
    // const ghCreds = new GitHubSourceCredentials(this, 'code-build-git-hub-creds', {
    //   accessToken: SecretValue.secretsManager('github-ts-install-pat')
    // });
    // ghCreds.applyRemovalPolicy(RemovalPolicy.DESTROY);

    const accountId = Stack.of(this).account;
    const appName = fs.readFileSync(path.resolve(__dirname, '../../name')).toString();

    const x86CodebuildProject = new Project(this, 'x86-codebuild-project', {
      projectName: `${id}-publish-x86`,
      buildSpec: BuildSpec.fromSourceFilename('./buildspecs/publish.yml'),
      environment: {
        buildImage: LinuxBuildImage.AMAZON_LINUX_2_3,
        privileged: true,
        computeType: ComputeType.SMALL,
        environmentVariables: {
          ARCH: { value: 'x86' }
        }
      },
      logging: {
        cloudWatch: {
          logGroup: new LogGroup(this, 'x86-codebuild-logs', {
            logGroupName: `${id}-x86-codebuild-logs`,
            retention: RetentionDays.TWO_WEEKS,
            removalPolicy: RemovalPolicy.DESTROY
          })
        }
      },
      source: Source.gitHub({
        owner: 'tinystacks',
        repo: 'aws-docker-templates-express',
        branchOrRef: 'main',
        webhook: true,
        webhookFilters: [
          FilterGroup
            .inEventOf(EventAction.PUSH)
            .andBranchIs('main')
        ]
      })
    });

    x86CodebuildProject.addToRolePolicy(new PolicyStatement({
      actions: [
        'ecr-public:BatchGet*',
        'ecr-public:Get*',
        'ecr-public:Describe*',
        'ecr-public:List*',
        'sts:GetServiceBearerToken'
      ],
      resources: ['*']
    }));
    x86CodebuildProject.addToRolePolicy(new PolicyStatement({
      actions: [
        'ecr-public:BatchCheckLayerAvailability',
        'ecr-public:CompleteLayerUpload',
        'ecr-public:DescribeImageTags',
        'ecr-public:DescribeImages',
        'ecr-public:GetRepositoryPolicy',
        'ecr-public:InitiateLayerUpload',
        'ecr-public:ListImages',
        'ecr-public:PutImage',
        'ecr-public:UploadLayerPart'
      ],
      resources: [`arn:aws:ecr-public::${accountId}:repository/${appName}`]
    }));
    x86CodebuildProject.addToRolePolicy(new PolicyStatement({
      actions: [
        'sts:GetCallerIdentity'
      ],
      resources: ['*']
    }));
    
    const armCodebuildProject = new Project(this, 'arm-codebuild-project', {
      projectName: `${id}-publish-arm`,
      buildSpec: BuildSpec.fromSourceFilename('./buildspecs/publish.yml'),
      environment: {
        buildImage: LinuxBuildImage.AMAZON_LINUX_2_ARM_2,
        privileged: true,
        computeType: ComputeType.SMALL,
        environmentVariables: {
          ARCH: { value: 'arm' }
        }
      },
      logging: {
        cloudWatch: {
          logGroup: new LogGroup(this, 'arm-codebuild-logs', {
            logGroupName: `${id}-arm-codebuild-logs`,
            retention: RetentionDays.TWO_WEEKS,
            removalPolicy: RemovalPolicy.DESTROY
          })
        }
      },
      source: Source.gitHub({
        owner: 'tinystacks',
        repo: 'aws-docker-templates-express',
        branchOrRef: 'main',
        webhook: true,
        webhookFilters: [
          FilterGroup
            .inEventOf(EventAction.PUSH)
            .andBranchIs('main')
        ]
      })
    });

    armCodebuildProject.addToRolePolicy(new PolicyStatement({
      actions: [
        'ecr-public:BatchGet*',
        'ecr-public:Get*',
        'ecr-public:Describe*',
        'ecr-public:List*',
        'sts:GetServiceBearerToken'
      ],
      resources: ['*']
    }));
    armCodebuildProject.addToRolePolicy(new PolicyStatement({
      actions: [
        'ecr-public:BatchCheckLayerAvailability',
        'ecr-public:CompleteLayerUpload',
        'ecr-public:DescribeImageTags',
        'ecr-public:DescribeImages',
        'ecr-public:GetRepositoryPolicy',
        'ecr-public:InitiateLayerUpload',
        'ecr-public:ListImages',
        'ecr-public:PutImage',
        'ecr-public:UploadLayerPart'
      ],
      resources: [`arn:aws:ecr-public::${accountId}:repository/${appName}`]
    }));
    armCodebuildProject.addToRolePolicy(new PolicyStatement({
      actions: [
        'sts:GetCallerIdentity'
      ],
      resources: ['*']
    }));
  }
}