# soa-marsy-marsy-23-24-team-f


## --- MIGRATION DONE ---

Kafka topics available

rocket.telemetrics.topic
payload.telemetrics.topic
logs.topic


Services messaging through KAFKA

- temetrie-service  -- done ![](https://geps.dev/progress/100?dangerColor=800000&warningColor=ff9900&successColor=006600)
- rocket-department-service -- No real needs
- rocket-object-service -- done ![](https://geps.dev/progress/100?dangerColor=800000&warningColor=ff9900&successColor=006600)
- payload-service -- done ![](https://geps.dev/progress/100?dangerColor=800000&warningColor=ff9900&successColor=006600)
- weather-service -- not implemented ![](https://geps.dev/progress/0?dangerColor=800000&warningColor=ff9900&successColor=006600)
- mission-commander-service -- done ![](https://geps.dev/progress/100?dangerColor=800000&warningColor=ff9900&successColor=006600)


### Rocket object service is now event base for modification of rocket and status

* Detailled logs can be found in scripts service container in logs/ folder


Made with NestJS and Nodejs

**NodeJs** must be present on host for ./run.sh

# HOW TO RUN

. to build
./prepare.sh

. to run 
./run.sh


* First scenario will run  untill orbiting
* Second scenario will run untill failure during first stage separation and autodestruc
* Third scenario is manual destrucs on fuel leak but needs some fixes

* Web Caster view at http://localhost:3010/

# Team Effort
Hadil: 100
Floriane: 100
Nicolas: 100
Chahan: 100
