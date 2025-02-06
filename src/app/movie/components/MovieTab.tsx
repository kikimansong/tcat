'use client';

import * as React from 'react';
import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from "next/navigation";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import MovieList from '@/app/movie/components/MovieList';
import { MovieListRef } from './MovieList';

/**************************************************************************/

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

/**************************************************************************/

/**
 * 영화 검색 영역
 */
const MovieSearch = ({ searchTitle, setSearchTitle, onSearchClick }: 
  {
    searchTitle: string,
    setSearchTitle: React.Dispatch<React.SetStateAction<string>>,
    onSearchClick: React.MouseEventHandler<HTMLButtonElement> 
  }) => {

  const handleSearchTitleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchTitle(e.target.value);
  }

  return (
    <div className="search_box">
      <TextField
        id="outlined-basic"
        label="찾는 영화가 있으신가요?"
        variant="outlined"
        value={searchTitle}
        onChange={handleSearchTitleChange}
        sx={{
          width: "100%",
          marginBottom: '20px',
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "", // 기본 테두리 색상
            },
            "&:hover fieldset": {
              borderColor: "", // 호버 시 테두리 색상
            },
            "&.Mui-focused fieldset": {
              borderColor: "", // 포커스 시 테두리 색상
            },
          },
          "& .MuiInputLabel-root": {
            color: "", // 라벨 색상
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "", // 포커스된 라벨 색상
          },
          "& .MuiOutlinedInput-input": {
            color: "", // 입력 텍스트 색상
          },
          "& .MuiOutlinedInput-placeholder": {
            color: "", // 플레이스홀더 색상
          },
        }}
        slotProps={{
          input: {
            style: { fontWeight: "bold" }, // 입력 텍스트 색상 및 스타일
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={onSearchClick}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </div>
  );
}

const MovieTab = () => {
  const searchParams = useSearchParams();
  const getSearchTitle = searchParams.get('searchTitle'); // 검색 쿼리 스트링
  const [value, setValue] = React.useState(0);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // 실제 검색에 사용되는 state

  /*
    [isTabChanged, setIsTabChanged] : 탭 변경 여부
    영화(/movie) 진입시 false로 초기화 하며, MovieList 컴포넌트의 props로 전달
    탭 변경시 handleChange 함수에서 true로 변경
    MovieList useEffect에서 isTabChanged과 쿼리스트링의 여부로 검색어 파라미터가 없는 getMovieList를 호출하는데 flag 역할을 함
  */
  const [isTabChanged, setIsTabChanged] = useState<boolean>(false);

  const movieListRef = useRef<MovieListRef>(null);

  /* 탭 변경 이벤트 */
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setSearchQuery('');
    setSearchTitle('');
    setIsTabChanged(true);
  };

  /* 검색 아이콘 클릭 이벤트 */
  const handleSearchClick = () => {
    setSearchQuery(searchTitle);

    if (movieListRef.current) {
      movieListRef.current.getMovieList(1, searchTitle, true);
    }
  };

  /**
   * 메인 화면에서 검색해서 진입 시 MainList useEffect getMovieList를 호출하지 않고,
   * MovieTab useEffect에서 검색 로직 처리
   */
  useEffect(() => {
    if (getSearchTitle) {
      setSearchTitle(getSearchTitle);
      setSearchQuery(getSearchTitle);

      if (movieListRef.current) {
        movieListRef.current.getMovieList(1, getSearchTitle, true);
      }
    }
  }, [getSearchTitle]);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: '20px' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="전체영화" {...a11yProps(0)} sx={{ fontSize: '20pt', padding: '20px' }} disableRipple />
          <Tab label="상영중" {...a11yProps(1)} sx={{ fontSize: '20pt', padding: '20px' }} disableRipple />
          <Tab label="상영예정" {...a11yProps(2)} sx={{ fontSize: '20pt', padding: '20px' }} disableRipple />
        </Tabs>
      </Box>
      
      <MovieSearch searchTitle={searchTitle} setSearchTitle={setSearchTitle} onSearchClick={handleSearchClick} />
      
      <div className='clear_right'>
        <CustomTabPanel value={value} index={0}>
          <MovieList release={null!} searchTitle={searchQuery} isTabChanged={isTabChanged} ref={movieListRef} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <MovieList release={'0'} searchTitle={searchQuery} isTabChanged={isTabChanged} ref={movieListRef} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <MovieList release={'1'} searchTitle={searchQuery} isTabChanged={isTabChanged}ref={movieListRef} />
        </CustomTabPanel>
      </div>
    </Box>
  );
}

export default MovieTab;