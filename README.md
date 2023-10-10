# soa-marsy-marsy-23-24-team-f


## --- MIGRATION IN PROGRESS ---

FOR TEST PURPOSE KAFKA IS NOW CONFIGURED WITH
TELEMETRY-SERVICE BOTH AS PRODUCER AND CONSUMER 
OF THE SAME BROKER kafka:19092 AND THE SAME TOPIC
rocket.topic

ONCE SERVICES ARE UP, curl -x GET http://localhost:3003/send/telemetrics
to send the last telemetrics stored in db though kafka bus


Services messaging through KAFKA



- temetrie-service  -- in progress ![](https://geps.dev/progress/80?dangerColor=800000&warningColor=ff9900&successColor=006600)
- rocket-service -- not implemented ![](https://geps.dev/progress/0?dangerColor=800000&warningColor=ff9900&successColor=006600)
- rocket-object-service -- in progress ![](https://geps.dev/progress/60?dangerColor=800000&warningColor=ff9900&successColor=006600)
- payload-service -- in progress ![](https://geps.dev/progress/60?dangerColor=800000&warningColor=ff9900&successColor=006600)
- weather-service -- not implemented ![](https://geps.dev/progress/0?dangerColor=800000&warningColor=ff9900&successColor=006600)
- mission-commander-service -- not implemented ![](https://geps.dev/progress/0?dangerColor=800000&warningColor=ff9900&successColor=006600)


Architecture must evolve to migrate to kafka, only external routes
will remain and conversation beetween services will be done through kafka topics





Made with NestJS and Nodejs

**NodeJs** must be present on host for ./run.sh

# HOW TO RUN

. to build
./prepare.sh

. to run 
./run.sh


* First scenario will run for 120 seconds untill orbiting
* Second scenario will run for 60 seconds untill failure

* User friendly view of telemetrics at http://localhost:3003/

# US Covered

1-  As Tory (Launch Weather Officer), I need to check the weather status, so that I can 
be sure that the conditions are in a valid range for a safe operation of the rocket. 


2-  As Elon (Chief Rocket Department), I need to monitor the status of the rocket, so 
that I can be sure that the rocket is behaving correctly before launch.  

3- As Richard (Mission Commander), I have to perform a Go/No Go poll to every 
monitoring department before giving the final go ahead with the launch, so that I 
can be sure that everything is nominal before launch. 
The Go/No Go poll has to be done in the following order:  
o  Weather Department (Tory)  
o  Rocket Department (Elon)  
o  Mission Commander (Richard)  

4-  As Elon (Chief Rocket Department), I have to send the launch order to the rocket 
after the GO from Richard, so that the rocket can launch into space and deliver the 
payload. 

5-  As Jeff (Telemetry Officer), I want to receive, store and consult the telemetry data of 
the rocket of the whole launch sequence (from before the launch, to the end of the
mission), so that I can monitor that everything is working as intended, and that if 
anything goes wrong, I can find the root cause of the anomaly. 

6-  As Elon (Chief Rocket Department), I want to stage the rocket mid-flight (separate 
the rocket in 2 parts), so that the rocket remains as efficient as possible, by leaving 
behind the first stage, now empty in fuel, and continuing with the second stage and 
the payload, full in fuel.  

7-  As Gwynne (Chief Payload Department), I want to deliver the payload 
(satellite/probe) in space on the right orbit or trajectory, so that the customer’s 
desires have been successfully fulfilled by the mission. 

8- As Richard (Mission Commander), I want to be able to issue an order for the 
destruction of the flight hardware in case of a severe anomaly, so that the rocket 
can’t follow an uncontrolled trajectory and to prevent potential damage on the 
ground.

9-  As Peter (Chief Executive Officer), I want the booster (first stage, that we previously 
discarded after the separation (staging) of the rocket in 2 parts) of the rocket to 
land, so that I can reuse it later and thus have a cheaper operating cost for each 
launch in order to be competitive on the space launches market.

10- As Jeff (Telemetry Officer), I want to receive, store and consult the telemetry data of 
the first stage, so that I can ensure the operation of the booster from the launchpad 
all the way until the booster lands.  

11- As Gwynne (Chief Payload Department), I want to receive, store and consult the
telemetry data of the payload, so that Mars Y can certify that the orbital parameters 
desired by the customer are ensured.


# Team Effort
Hadil: 100
Floriane: 100
Nicolas: 100
Chahan: 100
