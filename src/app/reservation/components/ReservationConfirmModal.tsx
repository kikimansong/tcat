'use client';

import { ReservationConfirmCustomDialog } from '@/app/reservation/components/CustomDialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

interface ReservationConfirmModalProps {
  isOpen: boolean;
  code: number;
  message: string;
  onClose: () => void;
}

const ReservationConfirmModal = ({ isOpen, code, message, onClose }: ReservationConfirmModalProps) => {
  
  return (
    <ReservationConfirmCustomDialog className='confirm_modal' open={isOpen}>
      <DialogTitle id="customized-dialog-title" className='title_container'>
        {code == 200 ? '예매 완료' : '예매 실패'}
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
          {message}
        </Typography>
      </DialogContent>
      <DialogActions className='confirm_modal_footer'>
        <Button className='confirm_btn' onClick={onClose}>
          확인
        </Button>
      </DialogActions>
    </ReservationConfirmCustomDialog>
  );
}

export default ReservationConfirmModal;