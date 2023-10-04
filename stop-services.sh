docker compose --file rocket-department/docker-compose-rocket.yml  \
--file weather-department/docker-compose-weather.yml \
--file payload-department/docker-compose-payload.yml \
--file telemetrie-department/docker-compose-telemetrie.yml \
--file mission-commander-department/docker-compose-mission-commander.yml \
--file rocket/docker-compose-rocket-object.yml down