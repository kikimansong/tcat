'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation'
import Image from 'next/image';
import axios from 'axios';
import MovieInfoModal, { MovieInfoModalRef } from '@/app/movie/components/MovieInfoModal';
import { AgeAll, Age12, Age15, Age19} from '@/app/components/AgeImage';
import Skeleton from '@mui/material/Skeleton';
import MoodIcon from '@mui/icons-material/Mood';
import Button from '@mui/material/Button';
import { MovieInterface } from '../../../../interfaces/MovieInterface';

interface MainNowMovieItemProps extends MovieInterface {
  rank: number;
  onItemClick: () => void;
}

const LoadingSkeleton = () => {
  return (
    <>
      {[...Array(4)].map((_, index) => (
        <li className='loading' key={index}>
          <Skeleton className='image_skeleton' animation="wave" variant="rectangular" />
          <div className="movie_btn_group">
            {/* styles.css에서 스타일 적용 시 반영이 느려서 inline css로 작성 */}
            <Skeleton animation="wave" variant="rectangular" sx={{ width: '28%', height: '38.5px', borderRadius: '4px', backgroundColor: 'rgba(0, 0, 0, 0.3)' }} />
            <Skeleton animation="wave" variant="rectangular" sx={{ width: '70%', height: '38.5px', borderRadius: '4px', backgroundColor: 'rgba(0, 0, 0, 0.3)' }} />
          </div>
        </li>
      ))}
    </>
  );
};

const MainNowMovieItem = ({ movieName, movieImg, movieDescription, movieAge, totalRating, rank, onItemClick }: MainNowMovieItemProps) => {
  const imgUrl = process.env.NEXT_PUBLIC_MOVIE_IMAGE_URI;
  const router = useRouter();

  return (
    <li onClick={onItemClick}>
      <div className='movie_item_box'>
        <div className="movie_grade_wrap">
          {(() => {
            switch (movieAge) {
              case 0 :  return <AgeAll />;
              case 1 :  return <Age12 />;
              case 2 :  return <Age15 />;
              case 3 :  return <Age19 />;
            }
          })()}
        </div>
        <p className='rank'>{rank}</p>
        <Image className='movie_img' src={imgUrl + movieImg} alt={movieName} width={0} height={0} layout='responsive' />
        <div className="movie_info_container">
          <div className="movie_info">
            {movieDescription}
          </div>
        </div>
      </div>
      <div className="movie_btn_group">
        <Button className='rating_btn' variant="contained" size="medium" disableRipple>
          <MoodIcon />&nbsp;{totalRating >= 10 || totalRating == 0 ? totalRating.toFixed(0) : totalRating.toFixed(1)}
        </Button>
        <Button className="reservation_btn" variant="contained" size="medium" onClick={() => {router.push('/reservation')}}>
          예매
        </Button>
      </div>
    </li>
  );
}

const MainNowMovieList = () => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URI;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<MovieInterface[]>([]);
  const MovieInfoModalRef = useRef<MovieInfoModalRef>(null);

  const handleItem = (movieIdx: number) => {
    if (MovieInfoModalRef.current) {
      MovieInfoModalRef.current.handleOpen(movieIdx);
    }
  };

  /*
  예매율 Top4 영화 리스트 조회
  */
  const getList = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${baseUrl}/api/v1/movie/list/main`);
      setData(response.data.data);
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
    <div className='now_movie_list_container'>
      <ol>
        {loading && data.length === 0 && <LoadingSkeleton />}

        {!loading && data.length != 0 && (
          <>
            {data.map((item, index) => (
              <MainNowMovieItem key={item.movieIdx} rank={index + 1} onItemClick={() => {handleItem(item.movieIdx)}} {...item} />
           ))}
          </>
        )}
      </ol>
      <MovieInfoModal ref={MovieInfoModalRef} />
    </div>
  );
}

export default MainNowMovieList;