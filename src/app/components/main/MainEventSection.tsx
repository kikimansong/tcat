'use client';

import { ReactNode, useCallback, useEffect, useState } from 'react'
import axios from 'axios';
import EmblaCarousel from '@/app/components/EmblaCarousel';
import { EmblaOptionsType } from 'embla-carousel'
import { EmblaItem } from '../../../../interfaces/EmblaItem';

interface MainEventSectionProps {
  children: ReactNode;
}

const MainEventSection = ({ children }: MainEventSectionProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URI;
  const OPTIONS: EmblaOptionsType = { loop: true, watchDrag: true };
  const [carouselItems, setCarouselItems] = useState<EmblaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getBannerList = useCallback(async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/notice/banner-list`);
      setCarouselItems(response.data.data.list);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    getBannerList();
  }, [getBannerList]);

  return (
    <section className='event_section flex_center'>
      <div className="section_container">
        <h2>이벤트</h2>
        <div className='row_box'>
          <EmblaCarousel slides={carouselItems} options={OPTIONS} loading={loading}/>
          {children}
        </div>
      </div>
    </section>
  );
}

export default MainEventSection;