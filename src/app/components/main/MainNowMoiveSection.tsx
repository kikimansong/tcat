import { ReactNode } from 'react';
import Link from 'next/link';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface MainNowMovieSectionProps {
  children: ReactNode;
}

const MainNowMovieSection = ({ children }: MainNowMovieSectionProps) => {
  return (
    <section className='now_movie_section flex_center'>
      <div className="bg_filter"></div>
      <div className='section_container'>
        <div className='now_movie_top'>
          <div></div>
          <div className='banner_txt'>절찬 상영중!</div>
          <div>
            {/* <Link href='/movie'>더보기<ArrowForwardIosIcon className='font-1rem' /></Link> */}
            <Link href='/movie'>더보기<ArrowForwardIosIcon sx={{ fontSize: '1rem' }} /></Link>
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}

export default MainNowMovieSection;