import { MessageSquarePlus } from "lucide-react";
import CreateNewChat from "@/features/conversations/components/CreateNewChat";

const DashboardEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      {/* Icono principal */}
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4 shadow-sm">
        <MessageSquarePlus size={28} />
      </div>

      {/* Mensaje principal */}
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Start a new conversation
      </h2>
      <p className="text-gray-500 max-w-md mb-6">
        You don’t have any active chat selected.  
        Choose one from the sidebar or start a new conversation to begin chatting with your AI assistant.
      </p>

      {/* CTA */}
      <CreateNewChat />
    </div>
  );
};

export default DashboardEmpty;
