/* 숫자 셋째 자리 마다 콤마 */
export const comma = (val: number) => {
  return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* YYYY-MM-DD T HH:MM:SS 양식의 시간을 YYYY-MM-DD로 변경 */
export const ISODateToFormattedDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/* YYYY-MM-DD T HH:MM:SS 양식의 시간을 HH:MM으로 변경 */
export const ISODateToFormattedTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  const hour = String(date.getHours()).padStart(2, '0');
  const minuet = String(date.getMinutes()).padStart(2, '0');

  return `${hour}:${minuet}`;
}

/* YYYY-MM-DD T HH:MM:SS 양식의 시간을 YYYY.MM.DD HH:MM으로 변경 */
export const ISODateToFormattedDateTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minuet = String(date.getMinutes()).padStart(2, '0');

  return `${year}.${month}.${day} ${hour}:${minuet}`;
}

export const emailReg = (email: string): boolean => {
  const emailRegEx = /^(?=.{1,64}$)[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i;
  return emailRegEx.test(email);
}

export const nameReg = (name: string): boolean => {
  const nameRegEx = /^[a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣][a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣\s]{1,19}$/;
  return nameRegEx.test(name);
}

export const phoneReg = (phone: string): boolean => {
  const phoneRegEx = /^(\d{10}|\d{11})$/;
  return phoneRegEx.test(phone);
}

export const birthDtReg = (birthDt: string): boolean => {
  const birthDtRegEx = /^(\d{8})$/;
  return birthDtRegEx.test(birthDt);
}

/* 10자리 또는 11자리 전화번호 사이에 하이픈 (-) 삽입 */
export const FormattedPhone = (phone: string): string => {
  if (phone.length == 10) {
    return `${phone.slice(0, 3)}-${phone.slice(3, 7)}-${phone.slice(7)}`;
  }

  if (phone.length == 11) {
    return `${phone.slice(0, 3)}-${phone.slice(3, 8)}-${phone.slice(8 )}`;
  }

  throw new Error('전화번호 10자 또는 11자를 입력받아야 합니다.');
}

/* 8자리 생년월일 YYYY-MM-DD 양식으로 변경 */
export const DateFormattedBirth = (birthDt: string): string => {
  if (birthDt.length == 8) {
    return `${birthDt.slice(0, 4)}-${birthDt.slice(4, 6)}-${birthDt.slice(6)}`;
  }

  throw new Error('생년월일 8자를 입력받아야 합니다.');
}

/* 오늘 포함 5일 날짜 가져오기 */
export const getFiveDays = (): { fullDate: string, date: string; day: string, isToday: boolean }[] => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const result = [];
  const today = new Date();

  for (let i = 0; i < 5; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i);

    const date = currentDate.getDate();
    const day = days[currentDate.getDay()];

    result.push({
      fullDate: `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${(currentDate.getDate()).toString().padStart(2, '0')}`,
      date: date.toString(),
      day: day,
      isToday: today.getDate() == date
    });
  }

  return result;
}