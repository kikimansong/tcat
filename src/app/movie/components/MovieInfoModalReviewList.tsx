/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import CircularProgress from '@mui/material/CircularProgress';
import { ReviewInterface } from '../../../../interfaces/ReviewInterface';
import { ISODateToFormattedDateTime } from '@/lib/utils';

export interface MovieInfoModalReviewListRef {
  handleRefresh: () => void;
}

interface MovieInfoModalReviewListProps {
  movieIdx: number;
}

const MovieInfoModalReviewNoItem = () => {
  return (
    <span className='no_review'>
      <SentimentDissatisfiedIcon className='no_review_icon' />등록된 평이 없어요...
    </span>
  );
}

const MovieInfoModalReviewItem = ({ rating, reviewText, maskingUserEmail, insertAt }: ReviewInterface) => {
  return (
    <div className='movieinfo_modal_review_box'>
      <p className='rating'>
        <Rating name="size-small" value={rating / 2} size="small" readOnly />
        <span>{rating}</span>
      </p>
      <p className='review'>{reviewText}</p>
      <ul className='info'>
        <li>{maskingUserEmail}</li>
        <li>{ISODateToFormattedDateTime(insertAt)}</li>
      </ul>
    </div>
  );
}

// const MovieInfoModalReviewList = ({ movieIdx }: MovieInfoModalReviewListProps) => {
const MovieInfoModalReviewList = forwardRef<MovieInfoModalReviewListRef, MovieInfoModalReviewListProps>((props, ref) => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URI;
  const observerTargetRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [lastReviewIdx, setLastReviewIdx] = useState<number>(0);
  const [reviewList, setReviewList] = useState<ReviewInterface[]>([]);
  const [totalCnt, setTotalCnt] = useState<number>(0);

  useImperativeHandle(ref, ()=> ({
    handleRefresh,
  }));

  /* 리스트 새로고침 */
  const handleRefresh = () => {
    if (page == 1) getList();
    setPage(1);
    setLastReviewIdx(0);
    setReviewList([]);
    setTotalCnt(0);
  };

  /* 감상평 리스트 조회 API 호출 */
  const getList = useCallback(async () => {
    if (loading) return;

    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/api/v1/review/${props.movieIdx}?page=${page}&lastReviewIdx=${lastReviewIdx}`);

      if (response.data.code === 200) {
        const list = response.data.data.list;

        setTotalCnt(response.data.data.totalCnt);
        setLastReviewIdx(response.data.data.lastReviewIdx);
        setReviewList((prevList) => [...prevList, ...list]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, props.movieIdx, page, lastReviewIdx, loading]);

  /* 스크롤 페이징 옵저버 */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];

        if (target.isIntersecting && !loading && reviewList.length < totalCnt) {
          setPage((prevPage) => prevPage + 1);
        } 
      },
      { threshold: 0.5 }
    );

    if (observerTargetRef.current) {
      observer.observe(observerTargetRef.current);
    }

    return () => {
      if (observerTargetRef.current) {
        observer.unobserve(observerTargetRef.current);
      }
    };
  }, [reviewList, loading, totalCnt]);

  /* 페이지 변경 시 데이터 가져오기 */
  useEffect(() => {
    getList();
  }, [page]);

  return (
    <>
      <Typography className='desc_top' gutterBottom>
        관람객 평점
      </Typography>
      <div className='movieinfo_modal_review'>
        {loading && (
          <div className='progress_box'>
            <CircularProgress className='progress' />
          </div>
        )}

        {!loading && totalCnt === 0 && <MovieInfoModalReviewNoItem />}
        
        {reviewList.map((item) => (
          <MovieInfoModalReviewItem key={item.reviewIdx} {...item} />
        ))}
        {/* 스크롤 감지용 div */}
        <div ref={observerTargetRef} />
      </div>
    </>
  );
});

MovieInfoModalReviewList.displayName = 'MovieInfoModalReviewList;';
export default MovieInfoModalReviewList;