'use client';

import { useState } from 'react';
import { useRouter } from "next/navigation";
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';

const MainSearch = () => {
  const router = useRouter();
  const [searchTitle, setSearchTitle] = useState<string>('');

  const handleSearchTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTitle(e.target.value);
  }

  const handleSearch = () => {
    if (searchTitle === '' || searchTitle.replaceAll(' ', '') === '') {
      alert('영화 제목을 입력해주세요.');
      return;
    }

    // 검색어 앞, 뒤 공백을 제거해서 검색
    router.push(`/movie?searchTitle=${searchTitle.replace(/^\s+|\s+$/gm,'')}`);
  }

  return (
    <div className="main_search_box">
      <TextField
        id="outlined-basic"
        label="찾는 영화가 있으신가요?"
        variant="outlined"
        value={searchTitle}
        onChange={handleSearchTitleChange}
        autoComplete='off'
        sx={{
          width: "100%",
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
        }}
        slotProps={{
          input: {
            style: { color: "#fff", fontWeight: "bold" }, // 입력 텍스트 색상 및 스타일
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch}>
                  <SearchIcon sx={{ color: "#fff" }} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </div>
  );
}

export default MainSearch;