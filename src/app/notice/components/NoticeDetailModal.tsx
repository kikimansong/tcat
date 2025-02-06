import { useState, forwardRef, useImperativeHandle } from 'react';
import axios from "axios";
import { styled } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import { NoticeInterface } from '../../../../interfaces/NoticeInterface';
import { ISODateToFormattedDate } from '@/lib/utils';

/* 상위 컴포넌트에서 호출할 함수 정의 */
export interface NoticeDetailModalRef {
  handleOpen: (noticeIdx: number) => void; 
}

const NoticeDetailModal = forwardRef<NoticeDetailModalRef>((_, ref) => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URI;

  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<NoticeInterface | null>(null);

  /* 모달 열기 이벤트 */
  const handleOpen = (noticeIdx: number) => {
    getNoticeItem(noticeIdx);
    setIsOpen(true);
  };

  /* 모달 닫힘 이벤트 */
  const handleClose = () => {
    setIsOpen(false);
    setData(null);
  };

  /* 상위 컴포넌트에서 호출할 함수 이름 */
  useImperativeHandle(ref, () => ({
    handleOpen,
  }));

  /* 공지사항 아이템 호출 */
  const getNoticeItem = async (noticeIdx: number) => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/notice/${noticeIdx}`);
      setData(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  /************************************************************ */

  /* styled-component */
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
        maxWidth: "1000px",
      },
    },
  }));
  
  /************************************************************ */

  return (
    <CustomDialog className='notice_detail_modal' onClose={handleClose} open={isOpen}>
      <DialogTitle id="customized-dialog-title" className='title_container'>
        {data && (
          <>
            <div>{data.noticeTitle}</div>
            {data.noticeTp == 1 && (
              <p className="event_date">이벤트 기간 {data.startDate} ~ {data.endDate}</p>
            )}
            <p className='insert_date'>
              등록일 {ISODateToFormattedDate(data.insertAt as string)}
            </p>
          </>
        )}
        
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
        {data && (
          <Typography className='desc'>
            {data?.noticeContents}
          </Typography>
        )}
      </DialogContent>
    </CustomDialog>
  );
});

NoticeDetailModal.displayName = 'NoticeDetailModal';
export default NoticeDetailModal;