'use client';

import { useRouter } from 'next/navigation'
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


const LoginModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const router = useRouter();

  const CustomDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
      overflow: 'auto',
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
  
  const handleConfirmClick = () => {
    router.push('/signIn');
  };

  return (
    <CustomDialog className='reservation_confirm_modal' open={isOpen}>
      <DialogTitle id="customized-dialog-title" className='title_container'>
        알림
        <IconButton
          aria-label="close"
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
          로그인이 필요한 서비스입니다.
        </Typography>
      </DialogContent>
      <DialogActions className='reservation_confirm_modal_footer'>
        <Button className='confirm_btn' onClick={handleConfirmClick}>
          로그인
        </Button>
      </DialogActions>
    </CustomDialog>
  );
}

export default LoginModal;