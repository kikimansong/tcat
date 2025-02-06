'use client';

import React from 'react';
import { useState, forwardRef, useImperativeHandle, useEffect, useCallback } from 'react';
import { ReservationSeatCustomDialog } from '@/app/reservation/components/CustomDialog';
import { ReservationSeatCustomTooltip } from '@/app/reservation/components/CustomTooltip';
import ReservationCheckModal from '@/app/reservation/components/ReservationCheckModal';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { RoomInterface } from '../../../../interfaces/RoomInterface';
import axiosAuth from '@/lib/axiosInterceptors';

/* 상위 컴포넌트에서 호출할 함수 정의 */
export interface ReservationSeatModalRef {
  handleOpen: (movieRoomMappingIdx: number, roomIdx: number) => void;
}

interface SeatItemProps {
  type: string;
  row?: string;
  seat?: number | string;
  isSelected?: boolean;
  onItemClick?: (row: string, seat: number) => void;
}

interface ReservationSeatModalProps {
  selectedMovieRoomMappingIdx: number;
  onCloseClick: () => void;
}

/**
 * 좌석 아이템 컴포넌트
 */
const SeatItem = ({ type, row, seat, isSelected, onItemClick }: SeatItemProps) => {
  if (type === 'empty' && row && onItemClick) {
    return (
      <li className={`empty ${isSelected ? 'active' : ''}`} onClick={() => {onItemClick(row, Number(seat))}}>{seat}</li>
    );
  }

  if (type === 'impossible' && seat) {
    return <li className='impossible'>{seat.toString().replaceAll('*', '')}</li>;
  }

  if (type === 'blank') {
    return <li className='blank'></li>;
  }
}

const ReservationSeatModal = forwardRef<ReservationSeatModalRef, ReservationSeatModalProps>((props, ref) => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URI;
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckModalOpen, setIsCheckModalOpen] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [data, setData] = useState<RoomInterface | null>(null);

  // 극장 상영관 좌석, 예매된 좌석을 합친 객체. 예매가 된 좌석은 빨갛게, blank 좌석은 빈 공간으로 화면에 노출
  const [mergedSeats, setMergedSeats] = useState<Record<string, (number | string)[]> | null>(null);

  // 좌석 선택 여부 객체. 좌석 선택 시 해당 인덱스는 true 할당
  const [seatState, setSeatState] = useState<Record<string, boolean[]> | null>(null);

  // 선택한 좌석 인덱스가 할당되는 객체. 좌석 열이 key, 좌석 번호가 value의 형태로 할당
  const [selectedSeats, setSelectedSeats] = useState<Record<string, number[]>>({});

  // const [count, setCount] = useState<number>(1);  

  const [movieRoomMappingIdx, setMovieRoomMappingIdx] = useState<number>(0);
  const [roomIdx, setRoomIdx] = useState<number>(0);


  /* 모달 열기 이벤트 */
  const handleOpen = (movieRoomMappingIdx: number, roomIdx: number) => {
    setMovieRoomMappingIdx(movieRoomMappingIdx);
    setRoomIdx(roomIdx);
    getRoomItem(movieRoomMappingIdx, roomIdx);
    setIsOpen(true);
  };


  /* 모달 닫힘 이벤트 */
  const handleClose = useCallback(() => {
    props.onCloseClick();
    setIsOpen(false);
    setData(null);
    setMergedSeats(null);
    // setCount(1);
    setSeatState(null);
    setSelectedSeats({});
    setMovieRoomMappingIdx(0);
    setRoomIdx(0);
  }, [props]);


  const handleCheckModalClose = () => {
    setIsCheckModalOpen(false);
  };


  const handleTooltipClose = () => {
    setIsTooltipOpen(false);
  };


  /**
   * 예매수 증감 버튼 클릭 이벤트
   * @param {string} flag increase : 예매 수 증가 | decrease : 예매 수 감소
   */
  // const handleCount = useCallback((flag: string) => {
  //   setCount((prevCount) => {
  //     if (flag === 'increase' && data!.possibleSeatCnt > prevCount) {
  //       return prevCount + 1;
  //     }

  //     if (flag === 'decrease' && prevCount > 1) {
  //       return prevCount - 1;
  //     }

  //     return prevCount;
  //   });
  // }, [data]);


  /**
   * 좌석 클릭 이벤트
   * @param {string} row 열 (A ~ Z)
   * @param {number} seat 좌석 번호
   */
  const handleSeat = (row: string, seat: number) => {
    /* 좌석 선택 여부 */
    setSeatState((prevState) => {
      if (!prevState) return prevState; // null 막기

      return {
        ...prevState,
        [row]: prevState[row].map((isSelected, index) =>
          index === (seat - 1) ? !isSelected : isSelected
        )
      }
    });

    /* 선택한 좌석 */
    setSelectedSeats((prevSeat) => {
      const seatRow = prevSeat[row] || [];
    
      if (seatRow.includes(seat)) {
        const updatedSeats = seatRow.filter((e) => e !== seat); // 이미 선택된 좌석일 경우 제거
        const { [row]: unused, ...newSeats } = prevSeat; // 배열이 비었으면 해당 key 삭제
        void unused;

        return updatedSeats.length > 0 ? { ...prevSeat, [row]: updatedSeats } : newSeats;
      } else {
        // 좌석 추가 후 오름차순 정렬
        return { 
          ...prevSeat, 
          [row]: [...seatRow, seat].sort((a, b) => a - b) 
        };
      }
    });
  };

  
  /* 선택한 좌석 초기화 및 상영관 좌석 최신화 */
  const handleReload = () => {
    /*
    seatState는 useEffect에서 초기화 해주고 있지만,
    selectedSeat는 초기화가 이뤄지는 로직이 없어서 handleReload 함수 호출 시 초기화
    */
    setSelectedSeats({});
    getRoomItem(movieRoomMappingIdx, roomIdx);
  };


  /* 예매하기 버튼 클릭 이벤트 */
  const handleReservation = () => {
    const selectedSeatsCnt = Object.values(selectedSeats).flat().length;

    if (selectedSeatsCnt == 0) {
      setIsTooltipOpen(true);
      return;
    }

    setIsCheckModalOpen(true);
  };


  /* 상위 컴포넌트에서 호출할 함수 이름 */
  useImperativeHandle(ref, ()=> ({
    handleOpen,
  }));


  /* 에약된 좌석, 상영관 좌석 객체 합치기 */
  const mergeSeatObject = useCallback((
    obj1: Record<string, (number | string)[]>, 
    obj2: Record<string, (number | string)[]>): (Record<string, (number | string)[]> | null) => {

    const result: Record<string, (number | string)[]> = {};
  
    Object.keys({ ...obj1, ...obj2 }).forEach((key) => {
      const arr1 = obj1[key] || [];
      const arr2 = obj2[key] || [];
  
      // 중복된 값 처리 (두 번째 배열 기준으로 순서 유지)
      const mergedArray = arr2.map((value) => {
        if (arr1.includes(value)) {
          return `*${value}`; // 중복된 값에 * 붙이기
        }

        return value; // 중복되지 않은 값
      });
  
      // 첫 번째 배열에서 아직 포함되지 않은 값 추가
      const additionalValues = arr1.filter((value) => !arr2.includes(value));
      result[key] = [...mergedArray, ...additionalValues]; // 두 번째 배열 기준으로 정렬 유지
    });
  
    // key 값을 정렬 (a ~ z)
    const orderedResult = Object.keys(result).sort().reduce(
      (obj: Record<string, (number | string)[]>, key: string) => {
        obj[key] = result[key];
        return obj;
      }, {}
    );

    return orderedResult;
  }, []);


  /* 좌석 선택 여부 배열 만들기 */
  const copyEmptySeatObject = useCallback((obj: Record<string, (number | string)[]>): Record<string, boolean[]> => {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        value.filter((item) => item !== 'div').map(() => false),
      ])
    );
  }, []);


  /* 극장 상영관 아이템 호출 */
  const getRoomItem = async (movieRoomMappingIdx: number, roomIdx: number) => {
    try {
      const response = await axiosAuth.get(`${baseUrl}/api/v1/room/reservation-item/${movieRoomMappingIdx}/${roomIdx}`);
      setData(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    if (data) {
      setMergedSeats(mergeSeatObject(JSON.parse(data.reservationSeat), JSON.parse(data.roomBlankSeat)));
    }
  }, [data, mergeSeatObject]);


  useEffect(() => {
    if (mergedSeats) {
      setSeatState(copyEmptySeatObject(mergedSeats!));
    }
  }, [mergedSeats, copyEmptySeatObject]);


  return (
    <ReservationSeatCustomDialog className='reservation_seat_modal' open={isOpen}>
      {data && (
        <>
          <DialogTitle id="customized-dialog-title" className='title_container'>
            <div>
              <span className='room_name'>{data.roomName} 좌석선택</span>
              <ul>
                <li><p className='empty'></p>선택가능</li>
                <li><p className='impossible'></p>선택불가</li>
                <li><p className='active'></p>선택</li>
              </ul>
            </div>
            {/* <div className='reservation_count_box'>
              예매 수
              <p className='count_btn' onClick={() => {handleCount('decrease')}}>-</p>
              <p className='count'>{count}</p>
              <p className='count_btn' onClick={() => {handleCount('increase')}}>+</p>
            </div> */}
            <div className='reservation_count_box'>
              <p>선택 좌석 수: {Object.values(selectedSeats).flat().length}</p>
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
            <div className='contents_box'>
              <div className='screen'>SCREEN</div>
              <div className='seat_box'>
                <ul className='seat_row'>
                  {mergedSeats && (
                    <>
                      {Object.keys(mergedSeats).map((row, index) => (
                        <React.Fragment key={index}>
                          <li>{row.toUpperCase()}</li>

                          {mergedSeats[row][mergedSeats[row].length - 1] === 'div' && (
                            <li className='blank'></li>
                          )}
                        </React.Fragment>
                      ))}
                    </>
                  )}
                </ul>

                  {mergedSeats && seatState && (
                    <>
                      {Object.keys(mergedSeats).map((row: string, rowIndex: number) => (
                        <React.Fragment key={rowIndex}>
                          <ul className='seat_col'>
                            {mergedSeats[row].map((seat: number | string, seatIndex: number) => (
                              <React.Fragment key={row + seatIndex.toString()}>
                                {(() => {
                                  // 예약 가능 좌석
                                  if (typeof seat === 'number') {
                                    return <SeatItem 
                                              type={'empty'}
                                              row={row}
                                              seat={seat}
                                              isSelected={seatState?.[row]?.[seat - 1] || false}
                                              onItemClick={() => {handleSeat(row, seat)}} 
                                            />
                                  }

                                  // 예약 불가능 좌석
                                  if (seat.toString().includes('*')) {
                                    return <SeatItem type='impossible' seat={seat} />
                                  } 
                                  
                                  // 공백
                                  if (seat.toString() === '') {
                                    return <SeatItem type='blank' />
                                  }
                                })()}
                              </React.Fragment>
                            ))}
                          </ul>
                          {/* 각 row의 마지막 인덱스 값이 'div'인 경우 한줄 blank 처리 */}
                          {mergedSeats[row][mergedSeats[row].length - 1] === 'div' && (
                            <ul className='seat_col blank_col'></ul>
                          )}
                        </React.Fragment>
                      ))}
                    </>
                  )}
              </div>
            </div>
          </DialogContent>
          <DialogActions className='reservation_seat_modal_footer'>
            <ClickAwayListener onClickAway={handleTooltipClose}>
              <div>
                <ReservationSeatCustomTooltip
                  onClose={handleTooltipClose}
                  open={isTooltipOpen}
                  disableFocusListener
                  disableHoverListener
                  disableTouchListener
                  placement="top"
                  title="좌석을 선택해주세요"
                  slotProps={{
                    popper: {
                      disablePortal: true,
                    },
                  }}
                >
                  <Button className='reservation_btn' onClick={handleReservation}>
                    예매하기
                  </Button>
                </ReservationSeatCustomTooltip>
              </div>
            </ClickAwayListener>
          </DialogActions>
        </>
      )}
      <ReservationCheckModal
        idx={props.selectedMovieRoomMappingIdx}
        seats={selectedSeats}
        isOpen={isCheckModalOpen}
        onClose={handleCheckModalClose}
        seatCallback={handleReload}
      />
    </ReservationSeatCustomDialog>
  );
});


ReservationSeatModal.displayName = 'ReservationSeatModal'
export default ReservationSeatModal;