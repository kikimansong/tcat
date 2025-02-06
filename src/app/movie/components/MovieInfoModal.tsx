'use client';

import { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { useRouter } from 'next/navigation'
import Image from 'next/image';
import axios from 'axios';
import { AgeAll, Age12, Age15, Age19} from '@/app/components/AgeImage';
import MovieInfoModalFooter from '@/app/movie/components/MovieInfoModalFooter';
import MovieInfoModalReviewList, { MovieInfoModalReviewListRef } from '@/app/movie/components/MovieInfoModalReviewList';
import { styled } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { comma } from '@/lib/utils';
import { MovieInterface } from '../../../../interfaces/MovieInterface';

/* 상위 컴포넌트에서 호출할 함수 정의 */
export interface MovieInfoModalRef {
  handleOpen: (movieIdx: number) => void; 
}

const MovieInfoModal = forwardRef<MovieInfoModalRef>((_, ref) => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URI;
  const imgUrl = process.env.NEXT_PUBLIC_MOVIE_IMAGE_URI;
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<MovieInterface | null>(null);

  const movieInfoModalReviewListRef = useRef<MovieInfoModalReviewListRef>(null);

  /* 상위 컴포넌트에서 호출할 함수 이름 */
  useImperativeHandle(ref, ()=> ({
    handleOpen,
  }));

  /* 모달 열기 이벤트 */
  const handleOpen = (movieIdx: number) => {
    getMovieItem(movieIdx);
    setIsOpen(true);
  };

  /* 모달 닫힘 이벤트 */
  const handleClose = () => {
    setIsOpen(false);
    setData(null);
  };

  const handleReservation = () => {
    router.push('/reservation');
  };

  const handleRefresh = () => {
    if (movieInfoModalReviewListRef.current) {
      movieInfoModalReviewListRef.current.handleRefresh();
    }
  }

  const getMovieItem = async (movieIdx: number) => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/movie/${movieIdx}`);
      setData(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  /************************************************************ */

  const CustomDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
      overflow: 'auto'
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
      overflow: 'auto'
    },
    "& .MuiDialog-container": {
      "& .MuiPaper-root": {
        width: '90%',  // 기본적으로 화면 너비의 90%를 사용
        maxWidth: '1000px', // 최대 크기는 1000px
        minWidth: '300px', // 최소 크기는 300px로 설정하여 작은 화면에서도 유지
      },
    },
  }));
  
  /************************************************************ */


  return (
    <CustomDialog className='movieinfo_modal' onClose={handleClose} open={isOpen}>
      {data && (
        <>
          <DialogTitle id="customized-dialog-title" className='title_container'>
            <div>
              {(() => {
                switch (data.movieAge) {
                  case 0 :  return <AgeAll />;
                  case 1 :  return <Age12 />;
                  case 2 :  return <Age15 />;
                  case 3 :  return <Age19 />;
                }
              })()}
              <p>{data.movieName}</p>
            </div>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={(theme) => ({
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme.palette.grey[500],
              })} disableRipple> 
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent className='contents_container' dividers>
            <Box>
              <Grid container spacing={2}>
                <Grid className='img_grid' size={{ xs: 12, md: 6 }}>
                  <Image className='movie_img' src={imgUrl + data.movieImg} alt={data.movieName} width={0} height={0} layout="responsive" />
                </Grid>
                <Grid className='detail_grid' size={{ xs: 12, md: 6 }}>
                  <p className='c_555'>평점</p>
                  <p className='rating'>
                    {data.totalRating >= 10 || data.totalRating == 0 ? data.totalRating.toFixed(0) : data.totalRating.toFixed(1)}
                  </p>
                  <p className='c_555'>누적관객수</p>
                  <p className='total'>{comma(data.totalReservationCount)}<span>명</span></p>
                  <p className='c_555'>개봉일</p>
                  <p>{data.movieOpenDt}</p>
                  <p>
                  <Button className='reservation_btn' onClick={handleReservation}>
                    예매하기
                  </Button>
                  </p>
                </Grid>
              </Grid>
            </Box>
            <Typography className='desc_top' gutterBottom>
              소개
            </Typography>
            <Typography className='desc'>
              {data.movieDescription}
            </Typography>
            <MovieInfoModalReviewList ref={movieInfoModalReviewListRef} movieIdx={data.movieIdx} />
          </DialogContent>
          <MovieInfoModalFooter movieIdx={data.movieIdx} onRefresh={handleRefresh} />
        </>
      )}
    </CustomDialog>
  );
});

MovieInfoModal.displayName = 'MovieInfoModal';
export default MovieInfoModal;