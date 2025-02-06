'use client';

import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { AgeAll, Age12, Age15, Age19} from '@/app/components/AgeImage';
import { MovieInterface, MovieListResponse } from '../../../../interfaces/MovieInterface';

interface ReservationMovieItemProps extends MovieInterface {
  isSelected: boolean;
  onItemClick: (movieIdx: number) => void;
}

interface ReservationMovieListProps {
  selectedMovieIdx: React.Dispatch<React.SetStateAction<number>>;
}

const ReservationMovieItem = ({ movieIdx, movieName, movieAge, isSelected, onItemClick }: ReservationMovieItemProps) => {
  return (
    <li className={isSelected ? 'active' : ''} onClick={() => { onItemClick(movieIdx) }}>
      {(() => {
        switch (movieAge) {
          case 0 : return <AgeAll />;
          case 1 : return <Age12 />;
          case 2 : return <Age15 />;
          case 3 : return <Age19 />;
        }
      })()}
      <p>{movieName}</p>
    </li>
  );
}

const ReservationMovieList = ({ selectedMovieIdx }: ReservationMovieListProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URI;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<MovieListResponse | null>(null);
  const [isItemSelected, setIsItemSelected] = useState<boolean[]>([]);

  /* 아이템 클릭 이벤트 */
  const handleItemClick = useCallback((movieIdx: number, index: number) => {
    const tempArr = Array(data?.list.length).fill(false);
    tempArr[index] = true;
    setIsItemSelected(tempArr); // 선택한 항목 'active' 표시
    selectedMovieIdx(movieIdx); // 상위 컴포넌트로 선택한 idx 전달 (setState)
  }, [selectedMovieIdx, data?.list.length]);

  const getList = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${baseUrl}/api/v1/movie/reservation-list`);
      setData(response.data.data);

      // 영화 목록 조회가 완료되면 첫번째 데이터를 강제로 선택
      // if (response.data.data && response.data.data.list.length != 0) {
      //   handleItemClick(response.data.data.list[0].movieIdx, 0);
      // }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    getList();
  }, [getList]);

  return (
    <div className="movielist_box">
      <h1>영화</h1>
      <ul>
        {loading && <CircularProgress className='progress' />}
        {!loading && data && (
          <>
            {data.list.map((item: MovieInterface, index: number) => (
              <ReservationMovieItem key={item.movieIdx} isSelected={isItemSelected[index]} onItemClick={() => {handleItemClick(item.movieIdx, index)}} {...item} />
            ))}
          </>
        )}
      </ul>
    </div>
  );
}

export default ReservationMovieList;