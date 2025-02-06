import { CinemaInterface } from "./CinemaInterface";

export interface RegionInterface {
  regionIdx: number,
  regionName: string,
  cinemaCount: number,
  cinemaList: CinemaInterface[]
}