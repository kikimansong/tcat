export interface ReviewInterface {
  reviewIdx: number;
  rating: number;
  reviewText: string;
  maskingUserEmail: string;
  insertAt: string;
}

export interface ReviewListResponse {
  list: ReviewInterface[];
  page: number;
  totalCnt: number;
  lastReviewIdx: number;
};