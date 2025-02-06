// import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { ReactNode } from 'react';

interface MainNoticeListProps {
  children: ReactNode;
}

const MainNoticeSection = ({ children }: MainNoticeListProps) => {
  return (
    <section className='notice_section flex_center'>
      <div className="section_container">
        <h2>공지사항</h2>
        {children}
        {/* <a className='faq' href='#'><HelpOutlineOutlinedIcon />자주 묻는 질문</a> */}
      </div>
    </section>
  );
}

export default MainNoticeSection;