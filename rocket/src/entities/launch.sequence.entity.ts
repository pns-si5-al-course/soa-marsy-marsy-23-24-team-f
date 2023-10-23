export enum LaunchSequenceStatus {
    "Rocket preparation",
    "Rocket on internal power",
    "Startup",
    "Main engine start",
    "Liftoff",
    "In flight",
    "MaxQ",
    "Main engine cut-off",
    "Stage separation",
    "Second engine start",
    "Fairing separation",
    "Second engine cut-off",
    "Payload deployed",
    "First Stage Separation Failed",
    "Wrong orbit"
}

export const LaunchSequenceDurations: { [key in LaunchSequenceStatus]: number } = {
    [LaunchSequenceStatus["Rocket preparation"]]: 3,
    [LaunchSequenceStatus["Rocket on internal power"]]: 3,
    [LaunchSequenceStatus["Startup"]]: 60,
    [LaunchSequenceStatus["Main engine start"]]: 3,
    [LaunchSequenceStatus["Liftoff"]]: 2,
    [LaunchSequenceStatus["In flight"]]: 10,
    [LaunchSequenceStatus["MaxQ"]]: 5,
    [LaunchSequenceStatus["Main engine cut-off"]]: 3,
    [LaunchSequenceStatus["Stage separation"]]: 3,
    [LaunchSequenceStatus["Second engine start"]]: 3,
    [LaunchSequenceStatus["Fairing separation"]]: 3,
    [LaunchSequenceStatus["Second engine cut-off"]]: 3,
    [LaunchSequenceStatus["Payload deployed"]]: 3,
    [LaunchSequenceStatus["First Stage Separation Failed"]]: 3,
    [LaunchSequenceStatus["Wrong orbit"]]: 3
};
