'use client';

import * as React from 'react';
import { useState, useRef } from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import NoticeList, { NoticeListRef } from '@/app/notice/components/NoticeList'

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
 * 공지사항 검색 영역
 */
const NoticeSearch = ({ searchTitle, setSearchTitle, onSearchClick }: 
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
        label="검색어를 입력해주세요."
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

/**
 * 공지사항 탭 컴포넌트
 */
const NoticeTab = () => {
  const [value, setValue] = React.useState(0);
  const [searchTitle, setSearchTitle] = useState('');

  const noticeListRef = useRef<NoticeListRef>(null);

  const handleChange = (e: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setSearchTitle('');
  };

  /* 검색 아이콘 클릭 이벤트 */
  const handleSearchClick = () => {
    if (noticeListRef.current) {
      noticeListRef.current.getNoticeList(1, searchTitle);
    }
  };

  /* index, type - 0: 공지사항 | 1: 이벤트 */
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: '20px' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="공지사항" {...a11yProps(0)} sx={{ fontSize: '20pt', padding: '20px' }} disableRipple />
          <Tab label="이벤트" {...a11yProps(1)} sx={{ fontSize: '20pt', padding: '20px' }} disableRipple />
          {/* <Tab label="자주 묻는 질문" {...a11yProps(2)} sx={{ fontSize: '20pt', padding: '20px' }} disableRipple /> */}
        </Tabs>
      </Box>

      <NoticeSearch searchTitle={searchTitle} setSearchTitle={setSearchTitle} onSearchClick={handleSearchClick} />
      
      <div className='clear_right'>
        <CustomTabPanel value={value} index={0}>
          <NoticeList type={0} searchTitle={searchTitle} ref={noticeListRef} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <NoticeList type={1} searchTitle={searchTitle} ref={noticeListRef} />
        </CustomTabPanel>
      </div>
    </Box>
  );
}

export default NoticeTab;