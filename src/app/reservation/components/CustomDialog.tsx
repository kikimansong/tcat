import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';

const ReservationSeatCustomDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    // minWidth: '1000px'
    maxWidth: '1100px',
    // maxHeight: '1200px',
    overflow: 'auto'
    
  },
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
      // minWidth: "1000px",
      // maxWidth: "900px",
      // width: "900px",
      overflow: 'auto'
    },
  },
}));

const ReservationSeatCheckDialog = styled(Dialog)(({ theme }) => ({
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

const ReservationConfirmCustomDialog = styled(Dialog)(({ theme }) => ({
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

export { ReservationSeatCustomDialog, ReservationSeatCheckDialog, ReservationConfirmCustomDialog };