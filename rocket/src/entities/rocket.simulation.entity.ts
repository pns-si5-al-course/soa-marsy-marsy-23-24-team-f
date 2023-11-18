import { Rocket } from "./rocket.entity";
import { Stage } from "./stage.entity";

export class RocketSimulation {

    // Modify the rocket position at the instant t
    positionAt(rocket: Rocket, t: number) {
      if (rocket.stages[0].fuel <= 0) {
        rocket.stages[0].fuel = 0;
        return 
      }
      rocket.altitude = 0 + rocket.v0 * t + 0.5 * rocket.a * t * t;
      rocket.payload.altitude = rocket.altitude;
      rocket.payload.speed = this.velocityAt(rocket, t);
      rocket.stages.forEach(stage => {
        stage.altitude = rocket.altitude;
        stage.speed = rocket.payload.speed;
      });
      
      if (rocket.stages.length < 2) {
        rocket.stages[0].fuel -= 30;
      } else {
        rocket.stages[0].fuel -= 40;
      }

    }
    
    velocityAt(rocket: Rocket, t: number) {
      return rocket.v0 + rocket.a * t;
    }

    stageAt(stage: Stage, t: number) {
      // use for first stage safe landing
      stage.altitude = stage.s0 + stage.v0 * t + 0.5 * stage.a * t * t;
      stage.speed = this.stageVelocityAt(stage, t);
    }
  

    stageVelocityAt(stage: Stage, t: number) {
      return stage.v0 + stage.a * t;
    }
  }
  
  