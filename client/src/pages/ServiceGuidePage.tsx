import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';

import GuideSlide from '@/components/ServiceGuidePage/GuideSlide';

import serviceGuide1 from '@/assets/image/service_guide1.png';
import serviceGuide2 from '@/assets/image/service_guide2.png';
import serviceGuide3 from '@/assets/image/service_guide3.png';
import serviceGuide4 from '@/assets/image/service_guide4.png';
import serviceGuide5 from '@/assets/image/service_guide5.png';
import serviceGuideIcon1 from '@/assets/icon/service_guide_icon1.png';
import serviceGuideIcon2 from '@/assets/icon/service_guide_icon2.png';
import serviceGuideIcon34 from '@/assets/icon/service_guide_icon34.png';
import serviceGuideIcon5 from '@/assets/icon/service_guide_icon5.png';
import guideCloseIcon from '@/assets/icon/guide_close.svg';

const ServiceGuidePage: React.FC = () => {
  const pagination = {
    clickable: true,
    renderBullet: (index: number, className: string) =>
      `<span class="${className}" id="${index}"></span>`,
  };

  return (
    <div className="absolute inset-0 bg-background-40 flex flex-col items-center z-100 overflow-hidden h-[100dvh] w-[100vw] max-w-[600px] pt-5">
      <div className="w-full h-full select-none">
        <Swiper
          pagination={pagination}
          modules={[Pagination]}
          className="mySwiper h-full"
        >
          <GuideCloseButton />
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <GuideSlide {...slide} />
              {index === slides.length - 1 && <MePlusStartButton />}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ServiceGuidePage;

const slides = [
  {
    icon: serviceGuideIcon1,
    text: (
      <p>
        <span className="text-gradation">Me플러스</span>
        에서 <br />
        내게 딱 맞는 요금제를 추천해드려요
      </p>
    ),
    image: serviceGuide1,
  },
  {
    icon: serviceGuideIcon2,
    text: (
      <>
        사소한 궁금증부터 필요한 정보
        <br />
        챗봇에서 편하게 물어보고
      </>
    ),
    image: serviceGuide2,
  },
  {
    icon: serviceGuideIcon34,
    text: (
      <>
        무엇을 물어볼지 모를 때는,
        <br />
        맞춤형 요금제 찾아보기에서
      </>
    ),
    image: serviceGuide3,
  },
  {
    icon: serviceGuideIcon34,
    text: (
      <>
        간단한 테스트로
        <br />딱 맞는 요금제를 찾아드려요
      </>
    ),
    image: serviceGuide4,
  },
  {
    icon: serviceGuideIcon5,
    text: (
      <>
        어떤 요금제가 더 좋은지 모를 땐,
        <br />
        요금제 비교하기에서!
      </>
    ),
    image: serviceGuide5,
  },
];

const GuideCloseButton = () => {
  return (
    <Link to="/">
      <img
        src={guideCloseIcon}
        alt="가이드 닫기"
        className="absolute top-5 right-5 p-2 m-3 cursor-pointer z-9999"
      />
    </Link>
  );
};

const MePlusStartButton = () => {
  return (
    <Link to="/">
      <div className="absolute bottom-[23px] w-[calc(100%-40px)] h-[46px] bg-primary-pink text-sm font-semibold text-background-40 flex justify-center items-center cursor-pointer rounded-[10px] mx-5">
        Me플러스 시작하기
      </div>
    </Link>
  );
};
