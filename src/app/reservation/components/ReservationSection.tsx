'use client';

import { useEffect, useRef, useState } from "react";
import ReservationMovieList from "@/app/reservation/components/ReservationMovieList";
import ReservationCinemaList from "@/app/reservation/components/ReservationCinemaList";
import ReservationDateList, { ReservationDateListRef } from "@/app/reservation/components/ReservationDateList"
import ReservationSeatModal, { ReservationSeatModalRef } from "@/app/reservation/components/ReservationSeatModal";

const ReservationSection = () => {
  const [selectedMovieIdx, setSelectedMovieIdx] = useState<number>(0);
  const [selectedCinemaIdx, setSelectedCinemaIdx] = useState<number>(0);
  const [selectedMovieRoomMappingIdx, setSelectedMovieRoomMappingIdx] = useState<number>(0);
  const [selectedRoomIdx, setSelectedRoomIdx] = useState<number>(0);

  const ReservationDateListRef = useRef<ReservationDateListRef>(null);
  const reservationSeatModalRef = useRef<ReservationSeatModalRef>(null);

  const handleReservationSeatModalClose = () => {
    setSelectedMovieRoomMappingIdx(0);
    setSelectedRoomIdx(0);

    /* 좌석 모달을 닫으면 선택한 조건의 극장 상영관 리스트 새로고침 */
    ReservationDateListRef.current?.getList();
  };

  useEffect(() => {
    /* 날짜/시간 탭의 아이템 클릭 시 좌석 예약 모달 노출 */
    if (reservationSeatModalRef && selectedRoomIdx != null && selectedMovieRoomMappingIdx != 0 && selectedRoomIdx != 0) {
      reservationSeatModalRef.current?.handleOpen(selectedMovieRoomMappingIdx, selectedRoomIdx);
    }
  }, [selectedMovieRoomMappingIdx, selectedRoomIdx]);

  return (
    <section className="reservation_section flex_center">
      <div className="section_container">
        <h2>예매</h2>
        <div className="reservation_container">
          <ReservationMovieList selectedMovieIdx={setSelectedMovieIdx} />
          <ReservationCinemaList selectedCinemaIdx={setSelectedCinemaIdx} />
          <ReservationDateList ref={ReservationDateListRef} selectedMovieIdx={selectedMovieIdx} selectedCinemaIdx={selectedCinemaIdx} selectedMovieRoomMappingIdx={setSelectedMovieRoomMappingIdx} selectedRoomIdx={setSelectedRoomIdx} />
        </div>
      </div>
      <ReservationSeatModal ref={reservationSeatModalRef} selectedMovieRoomMappingIdx={selectedMovieRoomMappingIdx} onCloseClick={handleReservationSeatModalClose} />
    </section>
  );
}

export default ReservationSection;