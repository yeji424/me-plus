import { Swiper, SwiperSlide } from 'swiper/react';

import { Pagination } from 'swiper/modules';

import serviceGuide1 from '@/assets/image/service_guide1.png';
import serviceGuide2 from '@/assets/image/service_guide2.png';
import serviceGuide3 from '@/assets/image/service_guide3.png';
import serviceGuide4 from '@/assets/image/service_guide4.png';
import serviceGuide5 from '@/assets/image/service_guide5.png';
import serviceGuideIcon1 from '@/assets/icon/robot_icon.png';
import serviceGuideIcon2 from '@/assets/icon/chatbot_icon.png';
import serviceGuideIcon34 from '@/assets/icon/test_icon.png';
import serviceGuideIcon5 from '@/assets/icon/compare_icon.png';
import guideCloseIcon from '@/assets/icon/guide_close.svg';

interface ServiceGuideProps {
  onClose: () => void;
}

const ServiceGuide: React.FC<ServiceGuideProps> = ({ onClose }) => {
  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '" id="' + index + '"></span>';
    },
  };
  return (
    <div className="absolute inset-0 bg-background-40 flex flex-col items-center justify-center z-100 max-h-screen overflow-hidden">
      <div className="w-full h-screen select-none">
        <Swiper
          pagination={pagination}
          modules={[Pagination]}
          className="mySwiper h-full"
        >
          <img
            src={guideCloseIcon}
            alt="guideCloseIcon"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 m-3 cursor-pointer z-9999"
          />
          <SwiperSlide>
            <div className="flex flex-col gap-5 items-center text-xl font-semibold text-center w-full justify-center absolute top-[50px]">
              <img src={serviceGuideIcon1} alt="serviceGuideIcon1" />
              <div>
                <span className="text-gradation">Me플러스</span>
                에서 <br />
                내게 딱 맞는 요금제를 추천해드려요
              </div>
              <img
                src={serviceGuide1}
                alt="serviceGuide1"
                className="max-w-[200px] w-3/5"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="flex flex-col gap-5 items-center text-xl font-semibold text-center w-full justify-center absolute top-[50px]">
              <img src={serviceGuideIcon2} alt="serviceGuideIcon1" />
              <div>
                사소한 궁금증부터 필요한 정보
                <br />
                챗봇에서 편하게 물어보고
              </div>
              <img
                src={serviceGuide2}
                alt="serviceGuide1"
                className="max-w-[200px] w-3/5"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="flex flex-col gap-5 items-center text-xl font-semibold text-center w-full justify-center absolute top-[50px]">
              <img src={serviceGuideIcon34} alt="serviceGuideIcon1" />
              <div>
                무엇을 물어볼지 모를 때는,
                <br />
                맞춤형 요금제 찾아보기에서
              </div>
              <img
                src={serviceGuide3}
                alt="serviceGuide1"
                className="max-w-[200px] w-3/5"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="flex flex-col gap-5 items-center text-xl font-semibold text-center w-full justify-center absolute top-[50px]">
              <img src={serviceGuideIcon34} alt="serviceGuideIcon1" />
              <div>
                간단한 테스트로
                <br />딱 맞는 요금제를 찾아드려요
              </div>
              <img
                src={serviceGuide4}
                alt="serviceGuide1"
                className="max-w-[200px] w-3/5"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="flex flex-col gap-5 items-center text-xl font-semibold text-center w-full justify-center absolute top-[50px]">
              <img
                src={serviceGuideIcon5}
                alt="serviceGuideIcon1"
                className="w-[75px] h-[75px]"
              />
              <div>
                어떤 요금제가 더 좋은지 모를 땐,
                <br />
                요금제 비교하기에서!
              </div>
              <img
                src={serviceGuide5}
                alt="serviceGuide1"
                className="max-w-[200px] w-3/5"
              />
            </div>
            <div
              onClick={onClose}
              className="absolute bottom-[23px] left-1/2 -translate-x-1/2 w-[calc(100%-40px)] h-[46px] bg-primary-pink text-sm font-semibold text-background-40 flex justify-center items-center cursor-pointer rounded-[10px]"
            >
              Me플러스 시작하기
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default ServiceGuide;
