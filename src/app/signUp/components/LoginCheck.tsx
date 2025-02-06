'use client'

import { useRouter } from 'next/navigation'
import { getCookie } from '@/lib/cookie';
import { useEffect } from 'react';

const LoginCheck = () => {
  const router = useRouter();
  
  useEffect(() => {
    if (getCookie('access_token')) {
      router.push('/');
    }
  })
  
  return <></>;
}

export default LoginCheck;