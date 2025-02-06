'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'
import axios from 'axios';
import Button from '@mui/material/Button';
import CustomTextField from '@/app/signUp/components/CustomTextField';
import { emailReg, nameReg, phoneReg, birthDtReg, FormattedPhone, DateFormattedBirth } from '@/lib/utils';

const SignUpFormBox = () => {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URI;

  const [signBtnText, setSignBtnText] = useState<string>('회원가입');

  const [isUserEmailInvalid, setIsUserEmailInvalid] = useState<boolean>(false);
  const [isUserPwInvalid, setIsUserPwInvalid] = useState<boolean>(false);
  const [isUserPwEmpty, setIsUserPwEmpty] = useState<boolean>(false);
  const [isUserNameValid, setIsUserNameValid] = useState<boolean>(false);
  const [isUserPhoneInvalid, setIsUserPhoneInvalid] = useState<boolean>(false);
  const [isUserBirthDtInvalid, setIsUserBirthDtInvalid] = useState<boolean>(false);

  const [isUserEmailExist, setIsUserEmailExist] = useState<boolean>(false);
  const [resMessage, setResMessage] = useState<string>('');

  const [userEmail, setUserEmail] = useState<string>('');
  const [userPw, setUserPw] = useState<string>('');
  const [userPwConfirm, setUserPwConfirm] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');
  const [userBirthDt, setUserBirthDt] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);

  const handleUserEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserEmail(e.target.value);
  }

  const handleUserPwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserPw(e.target.value);
  }

  const handleUserPwConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserPwConfirm(e.target.value);
  }

  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  }

  const handleUserPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserPhone(e.target.value);
  }

  const handleUserBirthDtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserBirthDt(e.target.value);
  }

  /* 회원가입 버튼 클릭 이벤트  */
  const handleSignUpClick = async () => {
    // 회원가입에 필요한 값들을 로컬 변수에 담아서 아래 분기문 조건에 사용하여 동기적으로 처리
    const emailInvalid = !emailReg(userEmail);
    const pwInvalid = userPw !== userPwConfirm && userPw.length > 0;
    const pwEmpty = userPw.length === 0;
    const nameInvalid = !nameReg(userName);
    const phoneInvalid = !phoneReg(userPhone);
    const birthDtInvalid = !birthDtReg(userBirthDt);

    setIsUserEmailInvalid(emailInvalid);
    setIsUserPwInvalid(pwInvalid);
    setIsUserPwEmpty(pwEmpty);
    setIsUserNameValid(nameInvalid);
    setIsUserPhoneInvalid(phoneInvalid);
    setIsUserBirthDtInvalid(birthDtInvalid);

    setIsUserEmailExist(false);

    if (!emailInvalid && !pwInvalid && !pwEmpty && 
        !nameInvalid && !phoneInvalid && !birthDtInvalid) {
      try {
        setLoading(true);

        const response = await axios.post(`${baseUrl}/api/v1/user/signUp`, {
          userEmail: userEmail,
          userPw: userPw,
          userName: userName,
          userPhone: FormattedPhone(userPhone),
          userBirthDt: DateFormattedBirth(userBirthDt)
        });

        // 중복되는 이메일일 경우
        if (response.data.code == 409) {
          setResMessage(response.data.message);
          setIsUserEmailExist(true);
          return;
        }

        // 회원가입 성공 시
        if (response.data.code == 201) {
          setSignBtnText('가입 완료. 로그인 페이지로 이동합니다.');

          const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
          await delay(800);
          
          router.push('/signIn');
        }

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <>
      <div className='form_box'>
        <CustomTextField className='text_field' label="이메일" variant="outlined" placeholder='your@email.com' value={userEmail} onChange={handleUserEmailChange} error={isUserEmailInvalid || isUserEmailExist} autoComplete='off' />
        <CustomTextField className='text_field' label="비밀번호" variant="outlined" type="password" value={userPw} onChange={handleUserPwChange} error={isUserPwInvalid || isUserPwEmpty} />
        <CustomTextField className='text_field' label="비밀번호 확인" variant="outlined" type="password" value={userPwConfirm} onChange={handleUserPwConfirmChange} error={isUserPwInvalid || isUserPwEmpty} />
        <CustomTextField className='text_field' label="이름" variant="outlined" placeholder='한글, 영어 2~20자' value={userName} onChange={handleUserNameChange} error={isUserNameValid} autoComplete='off' />
        <CustomTextField className='text_field' label="전화번호" variant="outlined" placeholder='- 제외 (01011110000)' value={userPhone} onChange={handleUserPhoneChange} error={isUserPhoneInvalid} autoComplete='off' />
        <CustomTextField className='text_field' label="생년월일" variant="outlined" placeholder='생년월일 8자 (20250131)' value={userBirthDt} onChange={handleUserBirthDtChange} error={isUserBirthDtInvalid} autoComplete='off' />
      </div>
      <Button className='sign_btn' variant="contained" onClick={handleSignUpClick} disabled={loading}>{signBtnText}</Button>
      <div className='invalid_box'>
        {isUserEmailInvalid && (<span>이메일 양식이 바르지 않습니다.</span>)}
        {isUserPwInvalid && (<span>비밀번호가 일치하지 않습니다.</span>)}
        {isUserPwEmpty && (<span>비밀번호를 입력해주세요.</span>)}
        {isUserNameValid && (<span>이름 양식이 바르지 않습니다.</span>)}
        {isUserPhoneInvalid && (<span>전화번호 양식이 바르지 않습니다.</span>)}
        {isUserBirthDtInvalid && (<span>생년월일 양식이 바르지 않습니다.</span>)}
        {isUserEmailExist && (<span>{resMessage}</span>)}
      </div>
    </>
  );
}

export default SignUpFormBox;