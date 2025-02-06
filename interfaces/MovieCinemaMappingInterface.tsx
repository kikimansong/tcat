export interface MovieCinemaMappingInterface {
  movieRoomMappingIdx: number,
  roomIdx: number,
  movieName: string,
  roomName: string,
  roomSeatCnt: number,
  possibleSeatCnt: number,
  startAt: string,
  endAt: string,
  available: boolean
};