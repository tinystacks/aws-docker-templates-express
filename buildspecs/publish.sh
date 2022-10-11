#!/bin/bash

arch_type=$1
debug=$2

if [[ -z "$arch_type" ]];
  then
    echo "No architecture type specified!"
    echo "exiting..."
    exit 1
fi

region="${AWS_REGION:-us-east-1}";
echo "getting caller identity"
callerIdentity=$(aws sts get-caller-identity);
accountId=$(jq -r .Account <<< $callerIdentity);
## TODO: use this once our custom alias is approved
# ecrEndpoint="public.ecr.aws/tinystacks/";
ecrEndpoint="public.ecr.aws/m7b0o7h1";
echo "getting version"
version=$(cat version);
echo "getting name"
appName=$(cat name);
echo "getting commit sha"
commitSha=$(git rev-parse HEAD);
ecrImageUrl="${ecrEndpoint}/${appName}"

echo "logging in to docker and ecr-public"
# docker login -u AWS -p $(aws ecr get-login-password --region $region) $ecrEndpoint;
aws ecr-public get-login-password --region $region | docker login --username AWS --password-stdin public.ecr.aws

# # We don't need to do this for our public ECR but if we want to test in out own accounts we may want to reintroduce this
# # Create the ECR repo if it doesn't exist yet
# echo "creating ecr repo if it doesn't exist"
# aws ecr create-repository --repository-name $appName 2> /dev/null

platform=linux/x86_64
if [[ $arch_type == arm* ]];
  then platform=linux/arm64
fi
if [[ $debug == y ]];
  then
    echo "running $arch_type docker build in debug mode"
    docker build --progress=plain --no-cache --build-arg CACHEBUST="$(date)" --build-arg ARCH="$arch_type" --platform "$platform" -t "$appName:latest-$arch_type" . || exit 1
  else
    echo "running $arch_type docker build"
    docker build --build-arg ARCH="$arch_type" --platform "$platform" -t "$appName:latest-$arch_type" . || exit 1
fi

echo "tagging $arch_type docker images"
docker image tag "$appName:latest-$arch_type" "$ecrImageUrl:latest-$arch_type"
docker image tag "$appName:latest-$arch_type" "$ecrImageUrl:$version-$arch_type"
docker image tag "$appName:latest-$arch_type" "$ecrImageUrl:$commitSha-$arch_type"

echo "pushing docker images"
docker push $ecrImageUrl --all-tags;