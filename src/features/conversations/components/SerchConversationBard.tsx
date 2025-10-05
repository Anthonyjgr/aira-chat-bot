import { Search } from "lucide-react";

const SearchConversationBar = () => {
  return (
    <div className="relative w-full">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={18}
        aria-hidden="true"
      />
      <input
        type="text"
        placeholder="Search conversation"
        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        aria-label="Search conversation"
      />
    </div>
  );
};

export default SearchConversationBar;
