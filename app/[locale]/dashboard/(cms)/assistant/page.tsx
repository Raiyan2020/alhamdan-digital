import { AssistantManager } from "@/components/dashboard/AssistantManager";
import { getChatbotAdminData } from "@/lib/chatbot/service";

export default async function DashboardAssistantPage() {
  const data = await getChatbotAdminData();
  return <AssistantManager initialData={data} />;
}
