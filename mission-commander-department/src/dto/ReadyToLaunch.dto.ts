import { RocketDTO } from "./Rocket.dto";

export class ReadyToLaunchDTO {
    rocket: RocketDTO;
    weatherDepartmentStatus: string;
    rocketDepartmentStatus: string;
}