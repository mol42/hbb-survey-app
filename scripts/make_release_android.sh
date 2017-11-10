# Go to top project folder:
SCRIPT_DIRECTORY=`dirname $0`
cd ${SCRIPT_DIRECTORY}
cd .. 

echo "====================================================="
echo "Deleting npm packages..."
echo "====================================================="
rm -rf ./node_modules || exit

echo "====================================================="
echo "Installing npm packages..."
echo "====================================================="
npm install || exit

# Go to android folder to create ipa file
cd ./android

echo "====================================================="
echo "Building app"
echo "====================================================="

ENVFILE=.env.production ./gradlew assembleRelease

# Let's print where we are
echo "====================================================="
echo "Moving apk to dist folder"
echo "====================================================="
mv app/build/outputs/apk/app-release.apk ../dist/HBBAnketor.apk || exit

echo "====================================================="
echo "RELEASE COMPLETED!"
echo "====================================================="