'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Skeleton from '@mui/material/Skeleton';
import AddIcon from '@mui/icons-material/Add';
import NoticeDetailModal, { NoticeDetailModalRef } from "@/app/notice/components/NoticeDetailModal";
import { NoticeInterface, NoticeListResponse } from '../../../../interfaces/NoticeInterface';
import { ISODateToFormattedDate } from '@/lib/utils';

interface NoticeItemProps extends NoticeInterface {
  onItemClick: (noticeIdx: number) => void;
}

const LoadingSkeleton = () => {
  return (
    <>
      {[...Array(6)].map((_, index) => (
        <li key={index}>
          <Skeleton animation="wave" variant="rectangular" sx={{ float: 'left', width: '55%', margin: '0 100px', backgroundColor: 'rgba(0, 0, 0, 0.2)' }} />
          <Skeleton animation="wave" variant="rectangular" sx={{ float: 'right', width: '10%', margin: '0 20px', backgroundColor: 'rgba(0, 0, 0, 0.2)' }} />
        </li>
      ))}
    </>
  );
}

const MainNoticeItem = ({ noticeIdx, noticeTitle, insertAt, onItemClick }: NoticeItemProps) => {
  return (
    <li>
      <p className='title' onClick={() => { onItemClick(noticeIdx) }}>{noticeTitle}</p>
      <p className='date'>{ISODateToFormattedDate(insertAt)}</p>
    </li>
  );
}

const MainNoticeList = () => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URI;
  const [data, setData] = useState<NoticeListResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  /* 하위 컴포넌트(모달)에서 선언한 인터페이스 NoticeDetailModalRef 타입의 ref 생성 */
  const modalRef = useRef<NoticeDetailModalRef>(null);

  const handleItemClick = (noticeIdx: number) => {
    if (modalRef.current) {
      modalRef.current.handleOpen(noticeIdx);
    }
  };

  const getNoticeList = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${baseUrl}/api/v1/notice/list/main/0`);
      setData(response.data.data);
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    getNoticeList();
  }, [getNoticeList]);

  return (
    <div className='notice_box flex_center_column'>
      <div className='notice_box_top'>
        <Link href='/notice'><AddIcon className='more' /></Link>
      </div>
      <ul>
        {loading || !data && <LoadingSkeleton />}

        {data && (
          <>
            {data.list.map((item: NoticeInterface) => (
              <MainNoticeItem key={item.noticeIdx} onItemClick={handleItemClick} {...item} />
            ))}
          </>
        )}
      </ul>
      <NoticeDetailModal ref={modalRef} />
    </div>
  );
}

export default MainNoticeList;