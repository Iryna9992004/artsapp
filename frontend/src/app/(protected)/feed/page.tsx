import FeedMessage from "@/components/entities/feed-message";

export default function Feed() {
  return (
    <div className="p-3">
      <FeedMessage
        text="Text placeholder here"
        timestamp="5 mins ago"
        status="read"
        readCount={3}
        colorNumber="1"
      />
      <FeedMessage
        text="Text placeholder here"
        timestamp="5 mins ago"
        status="read"
        readCount={3}
        isMine={true}
        colorNumber="2"
      />
      <FeedMessage
        text="Text placeholder here"
        timestamp="5 mins ago"
        status="read"
        readCount={3}
        colorNumber="3"
      />
      <FeedMessage
        text="Text placeholder here"
        timestamp="5 mins ago"
        status="read"
        readCount={3}
        colorNumber="4"
      />
      <FeedMessage
        text="Text placeholder here"
        timestamp="5 mins ago"
        status="read"
        readCount={3}
        colorNumber="5"
      />
      <FeedMessage
        text="Text placeholder here"
        timestamp="5 mins ago"
        status="read"
        readCount={3}
        colorNumber="6"
      />
      <FeedMessage
        text="Text placeholder here"
        timestamp="5 mins ago"
        status="read"
        readCount={3}
        colorNum="7"
      />
      <FeedMessage
        text="Text placeholder here"
        timestamp="5 mins ago"
        status="read"
        readCount={3}
        colorNumber="8"
      />
      <FeedMessage
        text="Text placeholder here"
        timestamp="5 mins ago"
        status="read"
        readCount={3}
        colorNumber="9"
      />
      <FeedMessage
        text="Text placeholder here"
        timestamp="5 mins ago"
        status="read"
        readCount={3}
        colorNumber="10"
      />
    </div>
  );
}
