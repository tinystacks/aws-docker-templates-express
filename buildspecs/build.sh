version=$(cat version);
appName=$(cat name);
arch_type=${1:-x86}
debug=$2

platform=linux/x86_64
if [[ $arch_type == arm* ]];
  then platform=linux/arm64
fi
if [[ $debug == y ]];
  then
    echo "running $arch_type docker build in debug mode"
    docker build -f Dockerfile.$arch_type  --progress=plain --no-cache --build-arg CACHEBUST="$(date)" --build-arg ARCH="$arch_type" --platform "$platform" -t "$appName:latest-$arch_type" .;
  else
    echo "running $arch_type docker build"
    docker build -f Dockerfile.$arch_type  --build-arg ARCH="$arch_type" --platform "$platform" -t "$appName:latest-$arch_type" .;
fi