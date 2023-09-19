GREEN='\033[0;32m'

# Default color
NC='\033[0m'



function wait-for-it-to-be-up(){
    until [ $(curl -s "http://$1" | grep \"status\":\"ok\" -c ) == 1 ]
    do
      echo "$2 service not up yet at $1"
      sleep 3
    done
    echo -e " $2 service is${GREEN} UP ${NC}"
}