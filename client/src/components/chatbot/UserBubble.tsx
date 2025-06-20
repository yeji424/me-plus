interface UserBubbleProps {
  message: string;
}

function UserBubble({ message }: UserBubbleProps) {
  return (
    <div className="user-bubble w-fit max-w-[309px] p-[10px] rounded-tl-xl rounded-br-xl rounded-bl-xl text-sm text-white leading-5 whitespace-pre-wrap break-words overflow-hidden ml-auto">
      {message}
    </div>
  );
}

export default UserBubble;
