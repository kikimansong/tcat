import { Suspense } from "react";
import Header from "@/app/components/layouts/Header";
import Footer from "@/app/components/layouts/Footer";
import MenuBreadcrumbs from "@/app/components/layouts/MenuBreadcrumbs";
import MovieTab from "@/app/movie/components/MovieTab";

export default function Movie() {
  const pageInfo = {
    url: '/movie',
    menu: '영화'
  };

  return (
    <>
      <div className="wrap">
        <Header />
        <MenuBreadcrumbs url={pageInfo.url} menu={pageInfo.menu} />
        <div className="container">
          <div className="contents">
            <section className="movie_list_section flex_center">
              <div className="section_container">
                <Suspense>
                  <MovieTab />
                </Suspense>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}