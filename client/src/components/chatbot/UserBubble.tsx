interface UserBubbleProps {
  message: string;
}

function UserBubble({ message }: UserBubbleProps) {
  return (
    <div className="user-bubble w-fit max-w-[309px] p-2 rounded-tl-lg rounded-br-lg rounded-bl-lg text-[14px] text-white leading-5 whitespace-pre-wrap break-words overflow-hidden ml-auto">
      {message}
    </div>
  );
}

export default UserBubble;
