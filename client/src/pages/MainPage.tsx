import LinkCard from '@/components/MainPage/LinkCard';
import FadeInUpDiv from '@/components/common/FadeInUpDiv';
import AnimatedShaker from '@/components/common/AnimatedShaker';
// import chatbotIcon from '@/assets/icon/chatbot_icon.png';
// import testIcon from '@/assets/icon/test_icon.png';
import compareIcon from '@/assets/icon/compare_icon.png';
import chatbotIcon from '@/assets/icon/chatbot_icon.png';
import testIcon from '@/assets/icon/test_icon.png';

const MainPage: React.FC = () => {
  return (
    <div className="h-[100vh] flex flex-col justify-center ">
      <div className="px-5" style={{ top: '25px' }}>
        {/* 제목 */}
        <FadeInUpDiv custom={0} className="mb-[37px]">
          <h2 className="text-2xl font-semibold">
            <span className="text-primary-pink">LG U+</span> 요금제 추천 AI 챗봇
          </h2>
          <h1 className="inline-block text-gradation text-[32px] font-semibold">
            Me플러스
          </h1>
        </FadeInUpDiv>

        {/* 설명 */}
        <FadeInUpDiv custom={1} className="flex flex-col gap-[7px] mb-[15px]">
          <p className="text-xs text-gray500 h-[12px]">
            밤낮없이 24시간 상담 가능
          </p>
          <h3 className="text-xl font-semibold">
            내게 맞는 요금제, 지금 찾아보세요!
          </h3>
        </FadeInUpDiv>

        {/* 카드들 */}
        <div className="flex flex-col gap-[20px]">
          <FadeInUpDiv custom={2}>
            <AnimatedShaker>
              <LinkCard
                to="/chatbot"
                title="챗봇 상담하기"
                description={
                  <>
                    데이터 용량부터 사소한 궁금증까지
                    <br />
                    해결해드려요.
                  </>
                }
                icon={chatbotIcon}
                variant="primary"
                size="large"
              />
            </AnimatedShaker>
          </FadeInUpDiv>
          <FadeInUpDiv custom={3}>
            <LinkCard
              to="/plan-test"
              title="맞춤형 요금제 찾아보기"
              description={
                <>
                  간단한 설문을 통해
                  <br />
                  맞춤형 요금제를 찾아드려요.
                </>
              }
              icon={testIcon}
              variant="gradient"
              size="large"
            />
          </FadeInUpDiv>
          <FadeInUpDiv custom={4}>
            <div className="flex gap-[10px] min-h-[127px]">
              <div className="flex-[2]">
                <LinkCard
                  to="/compare"
                  title="요금제 비교"
                  description="궁금한 요금제를 한눈에 비교해봐요."
                  icon={compareIcon}
                  variant="gradient"
                  size="medium"
                />
              </div>
              <div className="flex-[1]">
                <LinkCard
                  to="/service-guide"
                  title={
                    <>
                      서비스
                      <br />
                      가이드
                    </>
                  }
                  variant="shadow"
                  size="medium"
                />
              </div>
            </div>
          </FadeInUpDiv>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
