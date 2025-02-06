'use client';

import { useCallback, useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import axios from "axios";
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';
import NoticeDetailModal, { NoticeDetailModalRef } from "@/app/notice/components/NoticeDetailModal";
import { NoticeInterface, NoticeListResponse } from '../../../../interfaces/NoticeInterface';
import { ISODateToFormattedDate } from '@/lib/utils';

export interface NoticeListRef {
  getNoticeList: (page: number, noticeTitle?: string) => void;
}

interface NoticeListProps {
  type: number;
  searchTitle?: string;
}

interface NoticeItemProps extends NoticeInterface {
  onItemClick: (noticeIdx: number) => void;
}

/**
 * 공지사항 아이템 컴포넌트
 */
const NoticeItem = ({ noticeIdx, noticeTitle, insertAt, onItemClick }: NoticeItemProps) => {
  return (
    <tr>
      <td className='center'>{noticeIdx}</td>
      <td className='title' onClick={() => { onItemClick(noticeIdx) }}>{noticeTitle}</td>
      <td className='center'>{ISODateToFormattedDate(insertAt)}</td>
    </tr>
  );
}

/**
 * 공지사항 리스트 컴포넌트
 */
const NoticeList = forwardRef<NoticeListRef, NoticeListProps>((props, ref) => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URI;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<NoticeListResponse | null>(null);

  useImperativeHandle(ref, () => ({
    getNoticeList,
  }));

  /* 하위 컴포넌트(모달)에서 선언한 인터페이스 NoticeDetailModalRef 타입의 ref 생성 */
  const modalRef = useRef<NoticeDetailModalRef>(null);

  /* 아이템 클릭 이벤트 */
  const handleItemClick = (noticeIdx: number) => {
    if (modalRef.current) {
      modalRef.current.handleOpen(noticeIdx);
    }
  }

  /* 페이지 변경 이벤트 */
  const handlePageChange = (e: React.ChangeEvent<unknown>, page: number, currentPage: number) => {
    if (!(page === currentPage)) {
      getNoticeList(page, props.searchTitle);
    }
  }

  /* 공지사항 리스트 호출 */
  const getNoticeList = useCallback(async (page: number, noticeTitle: string = '') => {
    setLoading(true);

    try {
      const response = await axios.get(`${baseUrl}/api/v1/notice/list?noticeTp=${props.type}&noticeTitle=${noticeTitle}&page=${page}`);
      setData(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, props.type]);

  useEffect(() => {
    getNoticeList(1);
  }, [getNoticeList]);

  return (
    <div className='notice_list_container'>
      {loading && (<CircularProgress />)}
      {data && (
        <>
          <table>
            <colgroup>
              <col className="no_col" />
              <col className="title_col" />
              <col className="date_col" />
            </colgroup>
            <thead>
              <tr>
                <td>번호</td>
                <td>제목</td>
                <td>등록일</td>
              </tr>
            </thead>
            <tbody>
              {data.list.map((item: NoticeInterface) => (
                <NoticeItem key={item.noticeIdx} onItemClick={handleItemClick} {...item} />
              ))}
            </tbody>
          </table>
          <Pagination className='pagination' page={data.page} count={data.lastPage} color='primary' onChange={(e, page) => handlePageChange(e, page, data.page)} />
        </>
      )}
      <NoticeDetailModal ref={modalRef} />
    </div>
  );
});

NoticeList.displayName = 'NoticeList';
export default NoticeList;
