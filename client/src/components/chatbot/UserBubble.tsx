interface UserBubbleProps {
  message: string;
}

function UserBubble({ message }: UserBubbleProps) {
  return (
    <div className="max-w-[309px] p-2 rounded-tl-lg rounded-br-lg rounded-bl-lg bg-primary-pink text-xs text-background-40 leading-5 whitespace-pre-wrap break-words overflow-hidden ml-auto">
      {message}
    </div>
  );
}

export default UserBubble;
