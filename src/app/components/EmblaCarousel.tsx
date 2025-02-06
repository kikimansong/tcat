'use client';

import React, { useRef } from 'react'
import Image from 'next/image';
import Skeleton from '@mui/material/Skeleton';
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { EmblaOptionsType } from 'embla-carousel'
import { DotButton, useDotButton } from '@/app/components/EmblaDotButtons'
import { PrevButton, NextButton, usePrevNextButtons } from '@/app/components/EmblaArrowButtons'
import '@/app/assets/css/embla.css'
import NoticeDetailModal, { NoticeDetailModalRef } from "@/app/notice/components/NoticeDetailModal";
import { EmblaItem } from '../../../interfaces/EmblaItem';

type PropType = {
  slides: Array<EmblaItem>,
  options?: EmblaOptionsType,
  loading: boolean
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const imgUrl = process.env.NEXT_PUBLIC_NOTICE_IMAGE_URI;
  const { slides, options, loading } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay({ delay: 4000 })]);
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);
  
  /* 하위 컴포넌트(모달)에서 선언한 인터페이스 NoticeDetailModalRef 타입의 ref 생성 */
  const modalRef = useRef<NoticeDetailModalRef>(null);

  const handleBannerClick = (e: React.MouseEvent<HTMLAnchorElement>, noticeIdx: number) => {
    e.preventDefault();
    if (modalRef.current) {
      modalRef.current.handleOpen(noticeIdx);
    }
  };

  return (
    <div className='carousel_box'>
      {loading ? 
      (
        <Skeleton animation='wave' variant="rectangular" sx={{ width: '650px', height: '300px', backgroundColor: 'rgba(0, 0, 0, 0.3)' }} />
      ) : 
      (
        <>
          <div>
            <section className="embla">
              <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                  {slides.map((item, index) => (
                    <div className="embla__slide" key={index} >
                      <div className="embla__slide__item">
                        <a href='#' onClick={(e) => { handleBannerClick(e, item.noticeIdx) }}>
                          <Image src={imgUrl + item.bannerImg} alt={item.noticeTitle} width={0} height={0} layout='responsive' />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="embla__controls">
                <div className="embla__buttons">
                  <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
                  <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
                </div>

                <div className="embla__dots">
                  {scrollSnaps.map((_, index) => (
                    <DotButton
                      key={index}
                      onClick={() => onDotButtonClick(index)}
                      className={'embla__dot'.concat(
                        index === selectedIndex ? ' embla__dot--selected' : ''
                      )}
                    />
                  ))}
                </div>
              </div>
            </section>
            </div>
            <NoticeDetailModal ref={modalRef} />
        </>
      )}
    </div>
  );
}

export default EmblaCarousel;