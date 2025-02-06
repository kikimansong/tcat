import Header from "@/app/components/layouts/Header";
import Footer from "@/app/components/layouts/Footer";
import MenuBreadcrumbs from "@/app/components/layouts/MenuBreadcrumbs";
import ReservationSection from "@/app/reservation/components/ReservationSection";;

export default function Reservation() {
  const pageInfo = {
    url: '/reservation',
    menu: '예매'
  };

  return (
    <>
      <div className="wrap">
        <Header />
        <MenuBreadcrumbs url={pageInfo.url} menu={pageInfo.menu} />
        <div className="container">
          <div className="contents">
            <ReservationSection />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}