
SCRIPT_DIRECTORY=`dirname $0`
cd ${SCRIPT_DIRECTORY}
cd ..
cd "./mock-server"
node "survey-api-server.js"