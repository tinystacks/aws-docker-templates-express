x86AppName="wrapper-x86"
sudo rm -f ~/Downloads/$x86AppName.tar
sudo rm -rf ~/Downloads/$x86AppName
docker build --no-cache --platform "linux/x86_64" -t "$x86AppName:latest-x86" .
docker container rm $x86AppName 2> /dev/null || true
docker create --name $x86AppName "$x86AppName:latest-x86"
docker export $x86AppName > ~/Downloads/$x86AppName.tar

armAppName="wrapper-arm"
sudo rm -f ~/Downloads/$armAppName.tar
sudo rm -rf ~/Downloads/$armAppName
docker build --no-cache --build-arg ARCH="arm" --platform "linux/arm64" -t "$armAppName:latest-arm" .
docker container rm $armAppName 2> /dev/null || true
docker create --name $armAppName "$armAppName:latest-arm"
docker export $armAppName > ~/Downloads/$armAppName.tar
