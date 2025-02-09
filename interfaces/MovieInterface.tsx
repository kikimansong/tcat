export interface MovieInterface {
  movieIdx: number,
  movieName: string,
  movieImg: string,
  movieAge: number, // 연령 제한 0: All | 1: 12 | 2: 15 | 3: 19
  movieOpenDt: string,
  movieDescription?: string,
  movieTime: string,
  totalReservationCount: number,
  totalRating: number,
  open?: boolean
};

export interface MovieListResponse {
  list: MovieInterface[],
  page?: number,
  lastPage?: number,
  pageLength?: number,
  pageStart?: number,
  totalCnt?: number
};