'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import axios from 'axios';
import Button from '@mui/material/Button';
import CustomTextField from '@/app/signIn/components/CustomTextField';
import { setCookie, getCookie } from '@/lib/cookie';

export default function SignIn() {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URI;
  const [userEmail, setUserEmail] = useState<string>('');
  const [userPw, setUserPw] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isInvalid, setIsInvalid] = useState<boolean>(false);

  const handleUserEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsInvalid(false);
    setUserEmail(e.target.value);
  };

  const handleUserPwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsInvalid(false);
    setUserPw(e.target.value);
  }

  const handleEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if(e.key === "Enter") {
      handleLoginClick();
    }
  }

  /* 로그인 버튼 클릭 이벤트 */
  const handleLoginClick = async () => {
    setLoading(true);

    try {
      const response = await axios.post(`${baseUrl}/api/v1/user/signIn`, {
        userEmail: userEmail,
        userPw: userPw
      });

      // 이메일 또는 비밀번호가 일치하지 않을 시
      if (response.data.code == 401) {
        setIsInvalid(true);
        return;
      }

      // 최상위 경로에 토큰 데이터가 담긴 쿠키를 저장
      setCookie('access_token', response.data.data.accessToken, { path: '/', secure: true, sameSite: 'lax' });
      router.push('/');

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (getCookie('access_token')) {
      router.push('/');
    }
  });

  return (
    <div className="container_no_footer">
      <div className="contents flex_center">
        <div className="sign_container">
          <Link href='/'>
            <Image className='logo' src='/images/logo.svg' alt='logo' width={200} height={166} />
          </Link>
          <div className='form_box'>
            {/* TODO : 이메일 또는 비밀번호 오류 적용 */}
            <CustomTextField className='text_field' label="이메일" variant="outlined" placeholder='your@email.com' value={userEmail} onChange={handleUserEmailChange} error={isInvalid} autoComplete='off' />
            <CustomTextField className='text_field' label="비밀번호" variant="outlined" type='password' value={userPw} onChange={handleUserPwChange} onKeyDown={(e) => handleEnter(e)} error={isInvalid} />
          </div>
          <Button className='sign_btn' variant="contained" onClick={handleLoginClick} disabled={loading}>로그인</Button>
          <div className='invalid_box'>
            {isInvalid && (<span>이메일 또는 비밀번호가 일치하지 않습니다.</span>)}
          </div>
          <div className='etc_box'>
            <p>계정이 없으신가요?<Link className='link' href='/signUp'>회원가입</Link></p>
            <p className='guide'>본 사이트는 비영리 목적 포트폴리오입니다. <br /> Mail : plus4912@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}