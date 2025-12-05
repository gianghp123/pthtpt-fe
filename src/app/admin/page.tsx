import AdminClient from "@/features/admin/components/AdminClient";
import { getAllNodes } from "@/features/nodes/services/node.get";
import { getAllSeats } from "@/features/seats/services/seat.get"; //
import { getTransactionLogs } from "@/features/transaction_logs/services/transaction.service"; //

export const dynamic = 'force-dynamic'; // Đảm bảo luôn fetch dữ liệu mới nhất, không cache tĩnh

export default async function AdminPage() {
  // 1. Fetch Node thực (đã có)
  const initialNodes = await getAllNodes();

  // 2. Fetch Seat thực từ API (Thay thế mảng initialSeats cứng)
  const initialSeats = await getAllSeats();

  // 3. Fetch Transaction logs thực (Thay thế mảng initialTransactions cứng)
  // Mặc định lấy 50 logs gần nhất
  const initialTransactions = await getTransactionLogs(50);

  return (
    <AdminClient
      initialNodes={initialNodes}
      initialSeats={initialSeats}
      initialTransactions={initialTransactions}
    />
  );
}