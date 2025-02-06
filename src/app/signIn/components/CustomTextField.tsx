'use client';

import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

const CustomTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#fff", // 기본 테두리 색상
    },
    "&:hover fieldset": {
      borderColor: "#fff", // 호버 시 테두리 색상
    },
    "&.Mui-focused fieldset": {
      borderColor: "#fff", // 포커스 시 테두리 색상
    },
  },
  "& .MuiInputLabel-root": {
    color: "#fff", // 라벨 색상
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#fff", // 포커스된 라벨 색상
  },
  "& .MuiOutlinedInput-input": {
    color: "#fff", // 입력 텍스트 색상
  },
  "& .MuiOutlinedInput-placeholder": {
    color: "#fff", // 플레이스홀더 색상
  },
}));

export default CustomTextField;