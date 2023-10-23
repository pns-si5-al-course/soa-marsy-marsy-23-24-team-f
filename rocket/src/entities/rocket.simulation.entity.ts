export class RocketSimulation {
    private s0: number; // position initiale
    private v0: number; // vitesse initiale
    private a: number;   // accélération

    constructor(s0 = 0, v0 = 0, a = 0) {
      this.s0 = s0; 
      this.v0 = v0; 
      this.a = a;   
    }
  
    // Renvoie la position à l'instant t
    positionAt(t: number) {
      return this.s0 + this.v0 * t + 0.5 * this.a * t * t;
    }
  
    // Renvoie la vitesse à l'instant t
    velocityAt(t: number) {
      return this.v0 + this.a * t;
    }

    setAcceleration(a: number) {
        this.a = a;
    }
  }
  
  