'use client';

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useSearchParams } from "next/navigation";
import axios from 'axios';
import MovieItem from '@/app/movie/components/MovieItem'
import MovieInfoModal, { MovieInfoModalRef } from '@/app/movie/components/MovieInfoModal';
import { MovieInterface, MovieListResponse } from '../../../../interfaces/MovieInterface';
import { Button, CircularProgress } from '@mui/material';
import SentimentVeryDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentVeryDissatisfiedOutlined';

export interface MovieListRef {
  getMovieList: (page: number, movieName?: string, isSearch?: boolean) => void;
}

interface MovieListProps {
  release: string;
  searchTitle?: string;
  isTabChanged: boolean;
}

const MovieList = forwardRef<MovieListRef, MovieListProps>((props, ref) => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URI;
  const [data, setData] = useState<MovieListResponse | null>(null);
  const [movieList, setMovieList] = useState<MovieInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const searchParams = useSearchParams();
  const getSearchTitle = searchParams.get('searchTitle'); // 검색 쿼리 스트링

  /* 하위 컴포넌트(모달)에서 선언한 인터페이스 MovieInfoModal 타입의 ref 생성 */
  const MovieInfoModalRef = useRef<MovieInfoModalRef>(null);

  useImperativeHandle(ref, () => ({
    getMovieList,
  }));


  /* 아이템 클릭 이벤트 */
  const handleItemClick = (movieIdx: number) => {
    if (MovieInfoModalRef.current) {
      MovieInfoModalRef.current.handleOpen(movieIdx);
    }
  };

  /* 더보기 버튼 클릭 이벤트 */
  const handleMoreClick = () => {
    getMovieList(data!.page! + 1, props.searchTitle);
  };

  /**
   * 영화 리스트 호출
   * @param {number} page 페이지
   * @param {string} movieName 영화제목
   * @param {boolean} isSearch 검색버튼 클릭헤서 조회하는지 여부
   */
  const getMovieList = useCallback(async (page: number, movieName: string = '', isSearch: boolean = false) => {
    setLoading(true);

    try {
      const response = await axios.get(`${baseUrl}/api/v1/movie/list?release=${props.release}&movieName=${movieName}&page=${page}`);
      setData(response.data.data);

      /* 검색 버튼으로 API 호출 시 기존에 로드한 데이터가 배열에 중복되지 않게 state 초기화 후 재할당  */
      setMovieList(isSearch ? response.data.data.list : (prevData) => [...prevData, ...response.data.data.list]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, props.release]);

  useEffect(() => {
    setMovieList([]); // moveList를 빈 배열로 초기화하지 않으면 getMovieList에 의해 같은 데이터가 배열에 중복되어 출력되고 key 에러 발생

    /*
      isTabChanged를 flag 역할로 사용하여 쿼리스트링이 존재한 상태에서
      탭 변경 시 getMovieList 함수를 호출 할 수 있도록 함
    */
    if (!getSearchTitle || props.isTabChanged) {
      getMovieList(1);
    }
  }, [getMovieList, getSearchTitle, props.isTabChanged]);

  return (
    <div className='movie_list_container'>
      {data && (
        <>
          {data.totalCnt == 0 ? 
            (
              <span className='not_found'>
                <SentimentVeryDissatisfiedOutlinedIcon className='not_found_icon' /> 찾는 영화가 없어요...
              </span>
            ) : 
            (
              <ol>
                {movieList.map((item: MovieInterface) => (
                  <MovieItem key={item.movieIdx} onItemClick={handleItemClick} {...item} />
                ))}
              </ol>
            )
          }

          {data.page != data.lastPage && movieList.length != 0 && (
            <Button className='more_btn' onClick={handleMoreClick} disabled={loading}>더보기</Button>
          )}
        </>
      )}
      {loading && (
        <CircularProgress className='progress' />
      )}
      <MovieInfoModal ref={MovieInfoModalRef} />
    </div>
  );
});

MovieList.displayName = 'MovieList';
export default MovieList;