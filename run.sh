echo "-------------------"
echo "pass -f as argument if you want to clear logs file in scripts/logs folder"
echo "-------------------"
sleep 3
docker exec -t soa-marsy-scripts-service-1 sh ./start.sh $1
