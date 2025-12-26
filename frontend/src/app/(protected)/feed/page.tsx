import EventsList from "@/components/features/events-list";
import SearchInput from "@/components/features/search-input";

export const dynamic = "force-dynamic";

export default function Feed() {
  return (
    <div className="pb-30 relative max-h-[90vh] overflow-y-auto">
      <SearchInput />
      <EventsList />
      <div className="pt-10" />
    </div>
  );
}
