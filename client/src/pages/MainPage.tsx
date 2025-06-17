import { Link } from 'react-router-dom';
import chatbotIcon from '../assets/icon/chatbot_icon.png';
import testIcon from '../assets/icon/test_icon.png';
import compareIcon from '../assets/icon/compare_icon.png';

const MainPage = () => {
  return (
    <main>
      <div className="mb-[37px]">
        <h2 className="text-2xl font-semibold">
          <span className="text-primary-pink">LG U+</span> 요금제 추천 AI 챗봇
        </h2>
        <h1 className="inline-block text-gradation text-[32px] font-semibold">
          Me플러스
        </h1>
      </div>
      <div className="flex flex-col gap-[7px] mb-[15px]">
        <p className="text-xs text-gray500 h-[12px]">
          밤낮없이 24시간 상담 가능
        </p>
        <h3 className="text-xl font-semibold">
          내게 맞는 요금제, 지금 찾아보세요!
        </h3>
      </div>
      <div className="flex flex-col gap-[20px]">
        <Link
          to={'/chatbot'}
          className={
            'flex w-full h-full min-h-[190px] rounded-[17px] p-[1px] bg-primary-pink'
          }
        >
          <div
            className={
              'flex py-[33px] px-[18px] w-full rounded-[16px]  justify-between bg-primary-pink'
            }
          >
            <div className="flex flex-col gap-[17px] w-full flex-[2] max-w-[250px]">
              <h1
                className={
                  'text-2xl font-semibold w-fit whitespace-pre-line text-white'
                }
              >
                챗봇 상담하기
              </h1>
              <p className={'text-[13px] whitespace-pre-line z-50 text-white'}>
                데이터 용량부터 사소한 궁금증까지 해결해드려요.
              </p>
            </div>

            <div className="relative w-full h-full flex-[1]">
              <img
                src={chatbotIcon}
                alt={'카드 이미지'}
                className="absolute right-0 bottom-0"
              />
            </div>
          </div>
        </Link>
        <Link
          to={'/plan-test'}
          className={
            'flex w-full min-h-[190px]  rounded-[17px] p-[1px] bg-gradation'
          }
        >
          <div
            className={
              'flex py-[33px] px-[18px] w-full rounded-[16px]  justify-between bg-background-40'
            }
          >
            <div className="flex flex-col gap-[17px] w-full flex-[2] max-w-[250px]">
              <h1
                className={
                  'text-2xl font-semibold w-fit whitespace-pre-line text-gradation'
                }
              >
                맞춤형 요금제 찾기
              </h1>
              <p
                className={
                  'text-[13px] whitespace-pre-line z-50 text-secondary-purple-80'
                }
              >
                간단한 설문을 통해 맞춤형 요금제를 찾아드려요.
              </p>
            </div>
            <div className="relative w-full h-full flex-[1]">
              <img
                src={testIcon}
                alt={'카드 이미지'}
                className="absolute right-0 bottom-0"
              />
            </div>
          </div>
        </Link>
        <div className="flex gap-[10px] min-h-[127px]">
          <div className="flex-[2]">
            <Link
              to={'/compare'}
              className={
                'flex w-full h-full rounded-[17px] p-[1px] bg-gradation'
              }
            >
              <div
                className={
                  'flex py-[33px] px-[18px] w-full rounded-[16px]  justify-between bg-background-40'
                }
              >
                <div className="flex flex-col gap-[17px] w-full flex-[2] max-w-[110px]">
                  <h1
                    className={
                      'text-[21px] flex items-center font-semibold w-fit whitespace-pre-line text-gradation'
                    }
                  >
                    요금제 비교
                  </h1>
                  <p
                    className={
                      'text-xs whitespace-pre-line z-50 text-secondary-purple-80'
                    }
                  >
                    궁금한 요금제를 한눈에 비교해봐요.
                  </p>
                </div>
                <div className="relative w-full h-full flex-[1]">
                  <img
                    src={compareIcon}
                    alt={'카드 이미지'}
                    className="absolute right-0 top-1/2 -translate-y-1/2"
                  />
                </div>
              </div>
            </Link>
          </div>
          <div className="flex-[1]">
            <Link
              to={'/#'}
              className={
                'flex w-full h-full rounded-[17px] p-[1px] shadow-basic'
              }
            >
              <div
                className={
                  'flex py-[33px] px-[18px] w-full rounded-[16px]  justify-between bg-background-40'
                }
              >
                <div className="flex flex-col gap-[17px] w-full">
                  <h1
                    className={
                      'text-[21px] font-semibold w-fit whitespace-pre-line'
                    }
                  >
                    서비스
                    <br />
                    가이드
                  </h1>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainPage;
