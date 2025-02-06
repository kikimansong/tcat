'use client';

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import { RegionInterface } from "../../../../interfaces/RegionInterface";
import { CinemaInterface } from "../../../../interfaces/CinemaInterface";

interface ReservationCinemaItemProps extends RegionInterface {
  isSelected: boolean;
  onItemClick: (regionIdx: number) => void;
}

interface ReservationCinemaInnerItemProps extends CinemaInterface {
  isSelected: boolean;
  onItemClick: (cinemaIdx: number) => void;
}

interface ReservationCinemaListProps {
  selectedCinemaIdx: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * 지역 아이템 컴포넌트
 */
const ReservationCinemaItem = ({ regionIdx, regionName, cinemaCount, isSelected, onItemClick }: ReservationCinemaItemProps) => {
  return (
    <li className={isSelected ? 'active' : ''} onClick={() => { onItemClick(regionIdx) }}>
      {regionName}({cinemaCount})
    </li>
  );
}

/**
 * 극장 아이템 컴포넌트
 */
const ResrvationCinemaInnerItem = ({ cinemaIdx, cinemaName, isSelected, onItemClick }: ReservationCinemaInnerItemProps) => {
  return (
    <li className={isSelected ? 'active' : ''} onClick={() => { onItemClick(cinemaIdx) }}>{cinemaName}</li>
  );
}

const ReservationCinemaList = ({ selectedCinemaIdx }: ReservationCinemaListProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URI;
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<RegionInterface[] | null>(null); // 극장 지역 state
  const [innerData, setInnerData] = useState<CinemaInterface[] | null>([]); // 극장 state

  const [isCinemaItemSelected, setIsCinemaItemSelected] = useState<boolean[]>([]);
  const [isCinemaInnerItemSelected, setIsCinemaInnerItemSelected] = useState<boolean[]>([]);

  /* 지역 아이템 클릭 이벤트 */
  const handleCinemaItemClick = (regionIdx: number, index: number) => {
    const tempArr = Array(data?.length).fill(false);
    tempArr[index] = true;
    setIsCinemaItemSelected(tempArr);
    setInnerData(data![index].cinemaList);
    setIsCinemaInnerItemSelected([]);
  };

  /* 극장 아이템 클릭 이벤트 */
  const handleCinemaInnerItemClick = (cinemaIdx: number, index: number) => {
    const tempArr = Array(innerData?.length).fill(false);
    tempArr[index] = true;
    setIsCinemaInnerItemSelected(tempArr);
    selectedCinemaIdx(cinemaIdx);
  };

  const getList = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${baseUrl}/api/v1/region/reservation-list`);
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
    <div className="cinemalist_box">
      <h1>극장</h1>
      <div>
        <ul>
          {loading && <CircularProgress className='progress' />}
          {!loading && data && (
            <>
              {data.map((item: RegionInterface, index: number) => (
                <ReservationCinemaItem key={item.regionIdx} isSelected={isCinemaItemSelected[index]} onItemClick={() => {handleCinemaItemClick(item.regionIdx, index)}} {...item} />
              ))}
            </>
          )}
        </ul>
        <ul>
          {loading && <CircularProgress className='progress' />}
          {!loading && data && (
            <>
              {innerData!.map((item: CinemaInterface, index: number) => (
                <ResrvationCinemaInnerItem key={item.cinemaIdx} isSelected={isCinemaInnerItemSelected[index]} onItemClick={() => {handleCinemaInnerItemClick(item.cinemaIdx, index)}} {...item} />
              ))}
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default ReservationCinemaList;