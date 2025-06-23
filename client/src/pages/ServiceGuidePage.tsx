import { Swiper, SwiperSlide } from 'swiper/react';

import { Pagination } from 'swiper/modules';

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
import { Link } from 'react-router-dom';

const ServiceGuidePage: React.FC = () => {
  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '" id="' + index + '"></span>';
    },
  };
  return (
    <div className="absolute inset-0 bg-background-40 flex flex-col items-center z-100 overflow-hidden h-[100vh] w-[100vw] max-w-[600px] pt-5">
      <div className="w-full h-full select-none">
        <Swiper
          pagination={pagination}
          modules={[Pagination]}
          className="mySwiper h-full"
        >
          <Link to="/">
            <img
              src={guideCloseIcon}
              alt="guideCloseIcon"
              className="absolute top-5 right-5 p-2 m-3 cursor-pointer z-9999"
            />
          </Link>
          <SwiperSlide>
            <div className="flex flex-col items-center text-xl font-semibold text-center w-full h-full absolute top-1/16">
              <img
                src={serviceGuideIcon1}
                alt="serviceGuideIcon1"
                className="h-[75px]"
              />
              <div className="h-[84px] flex items-center">
                <p className="text-center">
                  <span className="text-gradation">Me플러스</span>
                  에서 <br />
                  내게 딱 맞는 요금제를 추천해드려요
                </p>
              </div>
              <img
                src={serviceGuide1}
                alt="serviceGuide1"
                className="max-h-[500px] h-[50%] aspect-1/2"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="flex flex-col items-center text-xl font-semibold text-center w-full h-full absolute top-1/16">
              <img
                src={serviceGuideIcon2}
                alt="serviceGuideIcon1"
                className="h-[75px]"
              />
              <div className="flex items-center h-[84px]">
                사소한 궁금증부터 필요한 정보
                <br />
                챗봇에서 편하게 물어보고
              </div>
              <img
                src={serviceGuide2}
                alt="serviceGuide1"
                className="max-h-[500px] h-[50%] aspect-1/2"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="flex flex-col items-center text-xl font-semibold text-center w-full h-full absolute top-1/16">
              <img
                src={serviceGuideIcon34}
                alt="serviceGuideIcon1"
                className="h-[75px]"
              />
              <div className="flex items-center h-[84px]">
                무엇을 물어볼지 모를 때는,
                <br />
                맞춤형 요금제 찾아보기에서
              </div>
              <img
                src={serviceGuide3}
                alt="serviceGuide1"
                className="max-h-[500px] h-[50%] aspect-1/2"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="flex flex-col items-center text-xl font-semibold text-center w-full h-full absolute top-1/16">
              <img
                src={serviceGuideIcon34}
                alt="serviceGuideIcon"
                className="h-[75px]"
              />
              <div className="flex items-center h-[84px]">
                간단한 테스트로
                <br />딱 맞는 요금제를 찾아드려요
              </div>
              <img
                src={serviceGuide4}
                alt="serviceGuide1"
                className="max-h-[500px] h-[50%] aspect-1/2"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="flex flex-col items-center text-xl font-semibold text-center w-full h-full absolute top-1/16">
              <img
                src={serviceGuideIcon5}
                alt="serviceGuideIcon1"
                className="h-[75px]"
              />
              <div className="flex items-center h-[84px]">
                어떤 요금제가 더 좋은지 모를 땐,
                <br />
                요금제 비교하기에서!
              </div>
              <img
                src={serviceGuide5}
                alt="serviceGuide1"
                className="max-h-[500px] h-[50%] aspect-1/2 "
              />
            </div>
            <Link to="/">
              <div className="absolute bottom-[23px] w-[calc(100%-40px)] h-[46px] bg-primary-pink text-sm font-semibold text-background-40 flex justify-center items-center cursor-pointer rounded-[10px] mx-5">
                Me플러스 시작하기
              </div>
            </Link>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default ServiceGuidePage;
