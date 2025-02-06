import Header from "@/app/components/layouts/Header";
import Footer from "@/app/components/layouts/Footer";
import MenuBreadcrumbs from "@/app/components/layouts/MenuBreadcrumbs";
import NoticeTab from "@/app/notice/components/NoticeTab";

export default function Notice() {
  const pageInfo = {
    url: '/notice',
    menu: '공지사항'
  };

  return (
    <>
      <div className="wrap">
        <Header />
        <MenuBreadcrumbs url={pageInfo.url} menu={pageInfo.menu} />
        <div className="container">
          <div className="contents">
            <section className="notice_list_section flex_center">
              <div className="section_container">
                <NoticeTab />
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}