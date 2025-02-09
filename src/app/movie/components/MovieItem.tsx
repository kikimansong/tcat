/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/navigation'
// import Image from 'next/image';
import MoodIcon from '@mui/icons-material/Mood';
import { Button } from "@mui/material";
import { AgeAll, Age12, Age15, Age19} from '@/app/components/AgeImage';
import { MovieInterface } from '../../../../interfaces/MovieInterface';

interface MovieItemProps extends MovieInterface {
  onItemClick: (movieIdx: number) => void;
}

export default function MovieItem({ movieIdx, movieName, movieImg, movieDescription, movieAge, movieOpenDt, totalRating, open, onItemClick }: MovieItemProps) {
  const imgUrl = process.env.NEXT_PUBLIC_MOVIE_IMAGE_URI;
  const router = useRouter();

  const handleReservation = () => {
    router.push('/reservation');
  };

  return (
    <li>
      <a onClick={() => { onItemClick(movieIdx) }}>
        {/* <Image className='movie_img' src={imgUrl + movieImg} alt={movieName} width={0} height={0} layout='responsive' /> */}
        <img className='movie_img' src={imgUrl + movieImg} alt={movieName} />
        <div className="movie_info_container">
          <div className="movie_info">
            {movieDescription}
          </div>
        </div>
      </a>
      <div className='movie_desc'>
        <div>
          {(() => {
            switch (movieAge) {
              case 0 :  return <AgeAll />;
              case 1 :  return <Age12 />;
              case 2 :  return <Age15 />;
              case 3 :  return <Age19 />;
            }
          })()}
          <p className='title'>
            {movieName}
          </p>
        </div>
        <p className='open_date'>개봉일 {movieOpenDt}</p>
      </div>
      <div className="movie_btn_group">
        <Button className='rating_btn' variant="contained" size="medium" disableRipple>
          <MoodIcon />&nbsp;{totalRating >= 10 || totalRating == 0 ? totalRating.toFixed(0) : totalRating.toFixed(1)}
        </Button>
        {open ? 
          (<Button className="reservation_btn" variant="contained" size="medium" onClick={handleReservation}>예매</Button>) : 
          (<Button className="reservation_btn" variant="contained" size="medium" disabled>상영예정</Button>)
        }
      </div>
    </li>
  );
}