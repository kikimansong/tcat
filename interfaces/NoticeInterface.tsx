export interface NoticeInterface {
  noticeIdx: number,
  noticeTitle: string,
  noticeContents?: string,
  noticeTp: number,
  insertAt: string,
  startDate?: string,
  endDate?: string,
  bannerImg?: string,
  isBanner?: string
};

export interface NoticeListResponse {
  list: NoticeInterface[],
  page: number,
  lastPage: number,
  pageLength: number,
  pageStart: number,
  totalCnt: number
};