GREEN='\033[0;32m'

# Default color
NC='\033[0m'

retry=10

function wait-for-it-to-be-up(){
    until [ $(curl -s "http://$1" | grep \"status\":\"ok\" -c ) == 1 ] && [ $retry -gt 0 ]
    do
      echo "$2 service not up yet at $1 Retrying in 6 seconds..."
      sleep 6
      retry=$((retry-1))
    done
    echo -e " $2 service is${GREEN} UP ${NC}"
}