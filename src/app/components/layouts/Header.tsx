'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axiosAuth from "@/lib/axiosInterceptors";
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import Skeleton from '@mui/material/Skeleton';
import { getCookie } from '@/lib/cookie';

const HeaderTop = () => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URI;
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const handleLogout = async () => {
    try {
      const response = await axiosAuth.post(`${baseUrl}/api/v1/auth/logout`);

      if (response.status == 200) {
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      // 쿠키는 브라우저 환경 함수이므로 서버에서 사용이 불가능하기 때문에 state에 저장해서 사용
      const tokenCookie = getCookie('access_token');
      setAccessToken(tokenCookie);

      if (tokenCookie) {
        try {
          setLoading(true);
          const userInfo = await axiosAuth.post(`${baseUrl}/api/v1/user`);

          switch (userInfo.data.code) {
            case 200 :
              setUserName(userInfo.data.data.name);
              break;

            case 401 :
              setAccessToken(null);
              break;
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [baseUrl, setLoading]);

  if (loading) {
    return (
      <div className='header_top'>
        <Skeleton animation="wave" sx={{width: '200px', bgcolor: 'text.secondary', '&::after': { bgcolor: 'text.primary',},}} />
      </div>
    );
  }

  return (
    <div className='header_top'>
      <ul>
        {!accessToken && (
          <>
            <li>
              <Link className='link' href='/signIn'>
                <LoginIcon className='link_icon' />
                로그인
              </Link>
            </li>
            <li>
              <Link className='link' href='/signUp'>
                <PersonAddIcon className='link_icon' />
                회원가입
              </Link>
            </li>
          </>
        )}
        
        {accessToken && (
          <>
            <li>
              <Link className='link' href='#'>
                <PersonIcon className='link_icon' />
                {userName}님
              </Link>
            </li>
            <li>
              <div className='link' onClick={handleLogout}>
                <LogoutIcon className='link_icon' />
                로그아웃
              </div>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

const Header = () => {
  return (
    <header>
      <div className='header'>
        <HeaderTop />
        <div className='header_wrap'>
            <div className='header_container'>
              <div className='menu_wrap menu_left_wrap'>
                <ul>
                  <li><Link href='/movie'>영화</Link></li>
                  <li><Link href='reservation'>예매</Link></li>
                </ul>
              </div>
              <div className='logo'>
                <Link href='/'>
                  <Image className='logo' src='/images/logo.svg' alt='logo' width={200} height={150} />
                  {/* <img src='/images/logo.svg' /> */}
                </Link>
              </div>
              <div className='menu_wrap menu_right_wrap'>
                <ul>
                  <li><Link href='/notice'>공지사항</Link></li>
                </ul>
              </div>
            </div>
        </div>
      </div>
    </header>
  );
}

export default Header;