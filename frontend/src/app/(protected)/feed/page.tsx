import SearchInput from "@/components/ui/search-input";
import FeedMessage from "../../../components/entities/feed-message";

export default function Feed() {
  return (
    <div className="pb-3 relative max-h-[90vh] overflow-y-auto">
      <SearchInput />
      <div className="pt-10" />
      <FeedMessage
        text="Text placeholder here"
        timestamp="5 mins ago"
        isMine
        messagesCount={3}
        colorNumber="1"
      />
      <FeedMessage
        text="Text placeholder here"
        timestamp="5 mins ago"
        isMine
        messagesCount={3}
        colorNumber="1"
      />
      <FeedMessage
        text="Text placeholder here"
        timestamp="5 mins ago"
        isMine
        messagesCount={3}
        colorNumber="1"
      />
      <FeedMessage
        text="Text placeholder here"
        timestamp="5 mins ago"
        isMine
        messagesCount={3}
        colorNumber="1"
      />
      <FeedMessage
        text="Text placeholder here"
        timestamp="5 mins ago"
        isMine
        messagesCount={3}
        colorNumber="1"
      />
      <FeedMessage
        text="Text placeholder here"
        timestamp="5 mins ago"
        isMine
        messagesCount={3}
        colorNumber="1"
      />
      <FeedMessage
        text="Text placeholder here"
        timestamp="5 mins ago"
        isMine
        messagesCount={3}
        colorNumber="1"
      />
      <FeedMessage
        text="Text placeholder here"
        timestamp="5 mins ago"
        isMine
        messagesCount={3}
        colorNumber="1"
      />
      <FeedMessage
        text="Text placeholder here"
        timestamp="5 mins ago"
        isMine
        messagesCount={3}
        colorNumber="1"
      />
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
