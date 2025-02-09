'use client';

import { useState } from 'react';
import AlertModal from '@/app/components/AlertModal';
import LoginModal from '@/app/components/LoginModal';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating';
import axiosAuth from '@/lib/axiosInterceptors';
import { getCookie } from '@/lib/cookie';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { MovieInfoCustomTooltip } from './CustomTooltip';

interface MovieInfoModalFooterProps {
  movieIdx: number;
  isOpen: boolean;
  onRefresh: () => void;
}

const MovieInfoModalFooter = ({ movieIdx, isOpen, onRefresh }: MovieInfoModalFooterProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URI;
  const reviewMaxLength = 1000;
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [alertModalMessage, setAlertModalMessage] = useState<string>('');
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleTooltipClose = () => {
    setIsTooltipOpen(false);
  };

  /* 알림 모달 닫기 이벤트 */
  const handleAlertModalClose = () => {
    setIsAlertModalOpen(false);
    setAlertModalMessage('');
  };

    /* 로그인 모달 닫기 이벤트 */
  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
  };

  /* 평점 변경 이벤트 */
  const handleRating = (e: React.SyntheticEvent<Element, Event>, value: number | null) => {
    setRating(value!);
  };

  /* 감상평 입력 이벤트 */
  const handleReview = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.value.length > reviewMaxLength) {
      setAlertModalMessage(`최대 ${reviewMaxLength}자 까지 입력할 수 있습니다.`);
      setIsAlertModalOpen(true);
      return;
    }

    setReview(e.target.value);
  };

  /* 감상평 등록 이벤트, */
  const handleRatingButton = async () => {
    if (!getCookie('access_token')) {
      setIsLoginModalOpen(true);
      return;
    }

    if (rating == null || rating === undefined || rating == 0) {
      setAlertModalMessage('평점을 선택해주세요.');
      setIsAlertModalOpen(true);
      return;
    }

    if (review == null || review === undefined || review.length == 0 || review === '') {
      setAlertModalMessage('감상평을 입력해주세요.');
      setIsAlertModalOpen(true);
      return;
    }

    try {
      setLoading(true);

      const response = await axiosAuth.post(`${baseUrl}/api/v1/review`, {
        movieIdx: movieIdx,
        rating: rating * 2, // 별 반개에 0.5개 이므로 n * 2 처리. 평점 시스템은 정수 값 1점 ~ 10점.
        reviewText: review,
      });

      if (response.data.code == 200) {
        setRating(0);
        setReview('');
        setIsTooltipOpen(true);
        onRefresh();
      } else {
        setAlertModalMessage(response.data.message);
        setIsAlertModalOpen(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DialogActions className='movieinfo_modal_footer' sx={{ '& > :not(style) ~ :not(style)': { marginLeft: 0 } }}>
        <p className='top'>감상평</p>
        <div className='movieinfo_modal_footer_box'>
          <Rating name="half-rating" value={rating} precision={0.5} size="large" onChange={(e, value) => {handleRating(e, value)}} disabled={!isOpen} />
          <p>{rating * 2}</p>
        </div>
        <TextField className='full_width' value={review} onChange={(e) => {handleReview(e)}} label={`${review.length} / ${reviewMaxLength}`} variant="outlined" rows={2} placeholder='감상평을 입력해주세요.' disabled={!isOpen} multiline />
        <ClickAwayListener onClickAway={handleTooltipClose}>
          <div className='full_width'>
            <MovieInfoCustomTooltip
              onClose={handleTooltipClose}
              open={isTooltipOpen}
              disableFocusListener
              disableHoverListener
              disableTouchListener
              placement="top"
              title="감상평을 등록했습니다."
              slotProps={{
                popper: {
                  disablePortal: true,
                },
              }}
            >
              {isOpen ?
                <Button className='rating_btn' variant="contained" onClick={handleRatingButton} disabled={loading}>등록하기</Button> :
                <Button className='rating_btn' variant="contained" disabled>상영예정 작품에는 감상평을 등록할 수 없습니다</Button>
              }
            </MovieInfoCustomTooltip>
          </div>
        </ClickAwayListener>
      </DialogActions>
      <AlertModal message={alertModalMessage} isOpen={isAlertModalOpen} onClose={handleAlertModalClose} />
      <LoginModal isOpen={isLoginModalOpen} onClose={handleLoginModalClose} />
    </>
  );
}

export default MovieInfoModalFooter;