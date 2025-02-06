'use client';

import React, { useState, useEffect } from 'react';
import LoginModal from '@/app/components/LoginModal';
import { ReservationSeatCustomDialog } from '@/app/reservation/components/CustomDialog';
import ReservationConfirmModal from '@/app/reservation/components/ReservationConfirmModal';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import axiosAuth from '@/lib/axiosInterceptors';
import { getCookie } from '@/lib/cookie';

interface ReservationCheckModalProps {
  idx: number;
  seats: Record<string, number[]>;
  isOpen: boolean;
  onClose: () => void;
  seatCallback: () => void;
}

const ReservationCheckModal = ({ idx, seats, isOpen, onClose, seatCallback }: ReservationCheckModalProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URI;
  const [selectedSeats, setSelectedSeats] = useState<Record<string, number[]>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [responseCode, setReseponseCode] = useState<number>(0);
  const [responseMessage, setResponseMessage] = useState<string>('');

  /* '네' 버튼 클릭 이벤트 */
  const handleConfirm = async () => {
    if (!getCookie('access_token')) {
      onClose();
      setIsLoginModalOpen(true);
      return;
    }

    try {
      setLoading(true);

      const response = await axiosAuth.post(`${baseUrl}/api/v1/reservation`, {
        movieRoomMappingIdx: idx,
        reservationCnt: Object.values(selectedSeats).flat().length,
        reservationSeat: JSON.stringify(selectedSeats)
      });

      // ReservationCheckModal 닫기
      onClose();

      // API 호출 성공 시 선택된 좌석 초기화 및 상영관 좌석 최신화
      seatCallback();

      // ReservationConfirmModal에서 보여줄 데이터 바인딩
      setReseponseCode(response.data.code);
      setResponseMessage(response.data.message);
      setIsConfirmModalOpen(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* ReservationConfirmModal 닫기 클릭 이벤트  */
  const handleConfirmModalClose = () => {
    onClose();
    setIsConfirmModalOpen(false);
  };

  /* 로그인 모달 닫기 클릭 이벤트 */
  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
  };

  useEffect(() => {
    /* 선택한 좌석 열 기준으로 sort (A ~ Z) */
    const orderedSeats = Object.keys(seats).sort().reduce(
      (obj: Record<string, number[]>, row: string) => {
        obj[row] = seats[row];
        return obj;
      }, {}
    );

    setSelectedSeats(orderedSeats);
  }, [seats]);

  return (
    <>
      <ReservationSeatCustomDialog className='confirm_modal' open={isOpen}>
        <DialogTitle id="customized-dialog-title" className='title_container'>
          예매 확인
          <IconButton
            aria-label="close"
            disabled={loading}
            onClick={onClose}
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
          <Typography className='desc'>
            {Object.keys(selectedSeats).map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {selectedSeats[row].map((seat, seatIndex) => (
                  <React.Fragment key={seatIndex}>
                    {`${row.toUpperCase()}${seat}${seatIndex == (selectedSeats[row].length - 1) ? '' : ', '}`}
                    {seatIndex == selectedSeats[row].length - 1 && <br />}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
            <br /> 위 좌석으로 예매하시겠습니까?
          </Typography>
        </DialogContent>
        <DialogActions className='confirm_modal_footer'>
          <Button className='confirm_btn' onClick={handleConfirm} disabled={loading}>
            네
          </Button>
          <Button className='confirm_btn' onClick={onClose} disabled={loading}>
            아니오
          </Button>
        </DialogActions>
      </ReservationSeatCustomDialog>
      <LoginModal isOpen={isLoginModalOpen} onClose={handleLoginModalClose} />
      <ReservationConfirmModal isOpen={isConfirmModalOpen} code={responseCode} message={responseMessage} onClose={handleConfirmModalClose} />
    </>
  );
}

export default ReservationCheckModal;