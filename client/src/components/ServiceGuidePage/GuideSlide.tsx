interface GuideSlideProps {
  icon: string;
  text: React.ReactNode;
  image: string;
}

const GuideSlide: React.FC<GuideSlideProps> = ({ icon, text, image }) => {
  return (
    <div className="flex flex-col items-center text-xl font-semibold text-center w-full h-full absolute top-1/16">
      <img src={icon} alt="icon" className="h-[75px]" />
      <div className="flex items-center h-[84px]">{text}</div>
      <img
        src={image}
        alt="guide"
        className="max-h-[500px] h-[50%] aspect-1/2"
      />
    </div>
  );
};

export default GuideSlide;
