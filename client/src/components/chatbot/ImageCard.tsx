import NoImage from '@/assets/image/no_image.png';

interface ImageCardProps {
  imageUrl?: string;
  text: string;
  buttonText: string;
  onButtonClick?: () => void;
}

const ImageCard = ({
  imageUrl,
  text,
  buttonText,
  onButtonClick,
}: ImageCardProps) => {
  return (
    <div className="w-[227px] shadow-small rounded-2xl overflow-hidden bg-white text-gray700 flex flex-col">
      <div className="h-[123px]">
        <img
          src={imageUrl || NoImage}
          alt="preview"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="text-gray700 flex flex-col gap-[13px] p-[10px]">
        <p className="leading-[18px] text-xs break-all">{text}</p>
        <button
          onClick={onButtonClick}
          className="bg-background text-xs py-2 px-4 rounded-lg cursor-pointer"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default ImageCard;
