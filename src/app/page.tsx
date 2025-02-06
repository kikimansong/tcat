import Header from "@/app/components/layouts/Header";
import Footer from "@/app/components/layouts/Footer";
import MainNowMovieList from '@/app/components/main/MainNowMovieList';
import MainSearch from '@/app/components/main/MainSearch';
import MainNowMovieSection from "@/app/components/main/MainNowMoiveSection";
import MainEventSection from "@/app/components/main/MainEventSection";
import MainEventList from '@/app/components/main/MainEventList';
import MainNoticeSection from "@/app/components/main/MainNoticeSection";
import MainNoticeList from "@/app/components/main/MainNoticeList";

export default function Home() {
  return (
    <>
      <div className='wrap'>
        <Header />
        <div className='container'>
          <div className='contents'>
            {/* 현재 상영중 */}
            <MainNowMovieSection>
              <MainNowMovieList />
              <MainSearch />
            </MainNowMovieSection>
            {/* 이벤트 */}
            <MainEventSection>
              <MainEventList />
            </MainEventSection>
            {/* 공지사항 */}
            <MainNoticeSection>
              <MainNoticeList />
            </MainNoticeSection>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
