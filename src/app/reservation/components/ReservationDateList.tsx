/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import axios from 'axios';
import LoginModal from '@/app/components/LoginModal';
import CircularProgress from '@mui/material/CircularProgress';
import SentimentVeryDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentVeryDissatisfiedOutlined';
import { getCookie } from '@/lib/cookie';
import { loadUser } from '@/lib/common';
import { getFiveDays, ISODateToFormattedTime } from '@/lib/utils';
import { MovieCinemaMappingInterface } from '../../../../interfaces/MovieCinemaMappingInterface';

export interface ReservationDateListRef {
  getList: () => void;
}

interface ReservationDateItemProps extends MovieCinemaMappingInterface {
  onItemClick: (movieRoomMappingIdx: number, roomIdx: number, possibleSeatCnt: number) => void;
}

interface ReservationDateListProps {
  selectedMovieIdx: number;
  selectedCinemaIdx: number;
  selectedMovieRoomMappingIdx: React.Dispatch<React.SetStateAction<number>>;
  selectedRoomIdx: React.Dispatch<React.SetStateAction<number>>;
}

const ReservationDateItem = ({ movieRoomMappingIdx, roomIdx, movieName, roomName, roomSeatCnt, possibleSeatCnt, startAt, endAt, onItemClick, available }: ReservationDateItemProps) => {
  return (
    <li className={available ? '' : 'unavailable'} onClick={() => { if(available) onItemClick(movieRoomMappingIdx, roomIdx, possibleSeatCnt) }}>
      <span>
        <p className="start">{ISODateToFormattedTime(startAt)}</p>
        <p className="end">~{ISODateToFormattedTime(endAt)}</p>
      </span>
      <p className="title">{movieName}</p>
      {!available && (<p className='unavailable'>예매불가</p>)}
      <span className="info">
        <p className="room">{roomName}</p>
        <p className="seat_cnt">
          <span className={possibleSeatCnt == 0 ? 'impossible' : 'available'}>{possibleSeatCnt}</span>/{roomSeatCnt}
        </p>
      </span>
    </li>
  );
}

const ReservationDateList = forwardRef<ReservationDateListRef, ReservationDateListProps>((props, ref) => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URI;
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MovieCinemaMappingInterface[] | null>(null);
  const fiveDays = getFiveDays(); // 오늘을 포함한 5일 가져오기
  const [isDaySelected, setIsDaySelected] = useState<boolean[]>([]);
  const [startAt, setStartAt] = useState<string>('');

  useImperativeHandle(ref, () => ({
    getList,
  }));

  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
  };

  /* 날짜 클릭 이벤트 */
  const handleDayClick = (index: number) => {
    const tempArr = Array(fiveDays.length).fill(false);
    tempArr[index] = true;
    setIsDaySelected(tempArr);
    setStartAt(fiveDays[index].fullDate);
  };

  /* 날짜/시간 아이템 클릭 이벤트 */
  const handleItemClick = async (movieRoomMappingIdx: number, roomIdx: number, possibleSeatCnt: number) => {
    if (possibleSeatCnt == 0) {
      alert('예매 가능한 좌석이 없는 상영관입니다.');
      return;
    }

    /*
    이 부분에서 api를 호출하지 않기때문에 axios 인터셉터가 작동을 하지않아 토큰 만료 여부를 알 수 없음
    유저 정보를 불러오는 api를 await 호출 후 axios 인터셉터 response를 실행시킨 뒤
    토큰 재발급 / 토큰 만료 로직을 수행. 완료 시 쿠키를 통한 로그인 여부 확인
    */

    await loadUser();

    const tokenCookie = getCookie('access_token');

    if (!tokenCookie) {
      setIsLoginModalOpen(true);
      return;
    }

    // 상위 컴포넌트로 데이터 전달
    props.selectedMovieRoomMappingIdx(movieRoomMappingIdx);
    props.selectedRoomIdx(roomIdx);
  };

  /* 극장 상영관 API 호출 */
  const getList = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${baseUrl}/api/v1/movie-cinema-mapping/reservation-list?movieIdx=${props.selectedMovieIdx}&cinemaIdx=${props.selectedCinemaIdx}&startAt=${startAt}`);
      setData(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (props.selectedMovieIdx != 0 && props.selectedCinemaIdx != 0 && isDaySelected.length != 0) {
      /* 
      getList() 함수가 useEffect에 있었으나
      함수 재활용으로 인해 외부로 빼냄
      */
      getList();
    }
  }, [baseUrl, props.selectedMovieIdx, props.selectedCinemaIdx, isDaySelected, startAt]);

  /* 렌더링 후에 오늘 날짜를 강제로 선택 */
  useEffect(() => {
    handleDayClick(0);
  }, []);

  return (
    <div className="date_box">
      <h1>날짜/시간</h1>
      <div>
        <ul>
          {fiveDays.map((fiveDay: { date: string, day: string, isToday: boolean }, index: number) => (
            <li 
              key={index} 
              className={`${fiveDay.day === '토' ? 'saturday' : fiveDay.day === '일' ? 'sunday' : ''} ${isDaySelected[index] ? 'active' : ''}`}
              onClick={() => { handleDayClick(index) }}
            >
              <p>{fiveDay.date}</p>
              <p>{fiveDay.isToday ? '오늘' : fiveDay.day}</p>
            </li>
          ))}
        </ul>
        <ul>
          {loading && <CircularProgress className='progress' />}
          {!loading && data && (
            <>
              {data.length == 0 ?
                (
                  <span className='not_found'>
                    <SentimentVeryDissatisfiedOutlinedIcon className='not_found_icon' /> 예매 가능한 영화가 없어요...
                  </span>
                ) : 
                (
                  <>
                    {data.map((item: MovieCinemaMappingInterface) => (
                      <ReservationDateItem key={item.movieRoomMappingIdx} onItemClick={() => {handleItemClick(item.movieRoomMappingIdx, item.roomIdx, item.possibleSeatCnt)}} {...item} />
                    ))}
                  </>
                )
              }
            </>
          )}
        </ul>
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={handleLoginModalClose} />
    </div>
  );
});

ReservationDateList.displayName = 'ReservationDateList';
export default ReservationDateList;