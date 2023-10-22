# soa-marsy-marsy-23-24-team-f


## --- MIGRATION DONE ---

Kafka topics available

rocket.telemetrics.topic
payload.telemetrics.topic
logs.topic


Services messaging through KAFKA

- temetrie-service  -- done ![](https://geps.dev/progress/100?dangerColor=800000&warningColor=ff9900&successColor=006600)
- rocket-service -- not iplemented ![](https://geps.dev/progress/0?dangerColor=800000&warningColor=ff9900&successColor=006600)
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

* User friendly view of telemetrics at http://localhost:3007/

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

12- -- Simplified -- As Elon (Chief Rocket Department), I want the rocket to go through Max Q 
harmlessly so that the total stress on the payload and the flight hardware stay in a 
safe level. In order to do so, the rocket engines must throttle down to reduce the 
load. Max Q is the atmospheric flight phase where the vehicle’s flight reaches 
maximum dynamic pressure because of the air density and the speed of the rocket.
-- No checks for air density or maximum dynamic pressure --



13- As Richard (Mission Commander), I want the launch procedure to follow the 
subsequent events to have a fine grain overview of the mission:

14- As Richard (Mission Commander), I want the mission logs to be stored and 
retrievable in order to comply with the Aerospace Authorities regulations, and for the 
company’s own investigations.

15- As Marie (Webcaster), I want to be aware of the launch procedure events in real 
time so that I can tell on the web stream what is actually happening ![](https://geps.dev/progress/50?dangerColor=800000&warningColor=ff9900&successColor=006600)


18- As Richard (Mission Commander), I want the mission to be aborted (flight hardware 
destruction if in-flight, etc) whenever an anomaly with a critical severity is detected in order 
to not endanger the surrounding area with and uncontrollable rocket without any human 
intervention. ![](https://geps.dev/progress/50?dangerColor=800000&warningColor=ff9900&successColor=006600)

# Team Effort
Hadil: 100
Floriane: 100
Nicolas: 100
Chahan: 100
