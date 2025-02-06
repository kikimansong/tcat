import Link from 'next/link';
import Image from 'next/image';
import SignUpFormBox from '@/app/signUp/components/SignUpFormBox';
import LoginCheck from '@/app/signUp/components/LoginCheck';

export default function SignUp() {
  return (
    <div className="container_no_footer">
      <div className="contents flex_center">
        <div className="sign_container">
          <Link href='/'>
            <Image className='logo' src='/images/logo.svg' alt='logo' width={200} height={166} />
          </Link>
          <SignUpFormBox />
          <div className='etc_box'>
            <p>이미 계정이 있으신가요?<Link className='link' href='/signIn'>로그인</Link></p>
            <p className='guide'>본 사이트는 비영리 목적 포트폴리오입니다. <br /> Mail : plus4912@gmail.com</p>
          </div>
        </div>
        <LoginCheck />
      </div>
    </div>
  );
}