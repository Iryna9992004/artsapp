import FeedMessage from "../../../components/entities/feed-message";

export default function Feed() {
  return (
    <div className="p-3">
      <FeedMessage
        text="Text placeholder here"
        timestamp="5 mins ago"
        isMine
        messagesCount={3}
        colorNumber="1"
      />
    </div>
  );
}
