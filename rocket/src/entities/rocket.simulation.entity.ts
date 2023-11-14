import { Rocket } from "./rocket.entity";
import { Stage } from "./stage.entity";

export class RocketSimulation {

    // Renvoie la position à l'instant t
    positionAt(rocket: Rocket, t: number) {
      rocket.altitude = 0 + rocket.v0 * t + 0.5 * rocket.a * t * t;
      rocket.payload.altitude = rocket.altitude;
      rocket.payload.speed = this.velocityAt(rocket, t);
      rocket.stages.forEach(stage => {
        stage.altitude = rocket.altitude;
        stage.speed = rocket.payload.speed;
      });
    }

    stageAt(stage: Stage, t: number) {
      // use for first stage safe landing
      stage.altitude = 0 + stage.v0 * t + 0.5 * stage.a * t * t;
    }
  
    // Renvoie la vitesse à l'instant t
    velocityAt(rocket: Rocket, t: number) {
      return rocket.v0 + rocket.a * t;
    }
  }
  
  