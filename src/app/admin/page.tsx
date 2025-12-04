import AdminClient from "@/features/admin/components/AdminClient";
import { getAllNodes } from "@/features/nodes/services/node.get";
import { SeatDto } from "@/features/seats/dto/response/seat.dto";
import { TransactionDto } from "@/features/transaction_logs/dto/response/transaction.dto";
import { ActionType } from "@/lib/enums/action-type.enum";

const initialSeats: SeatDto[] = [
  { id: "1", seatNumber: "A1", available: true },
  {
    id: "2",
    seatNumber: "A2",
    available: false,
    customerName: "Jane Doe",
    bookedByNode: 3,
  },
  { id: "3", seatNumber: "A3", available: true },
  {
    id: "4",
    seatNumber: "A4",
    available: false,
    customerName: "John Smith",
    bookedByNode: 1,
  },
  { id: "5", seatNumber: "A5", available: true },
  { id: "6", seatNumber: "B1", available: true },
  {
    id: "7",
    seatNumber: "B2",
    available: false,
    customerName: "Alice Johnson",
    bookedByNode: 5,
  },
  { id: "8", seatNumber: "B3", available: true },
  { id: "9", seatNumber: "B4", available: true },
  {
    id: "10",
    seatNumber: "B5",
    available: false,
    customerName: "Bob Wilson",
    bookedByNode: 2,
  },
  { id: "11", seatNumber: "C1", available: true },
  { id: "12", seatNumber: "C2", available: true },
  {
    id: "13",
    seatNumber: "C3",
    available: false,
    customerName: "Carol White",
    bookedByNode: 4,
  },
  { id: "14", seatNumber: "C4", available: true },
  { id: "15", seatNumber: "C5", available: true },
  {
    id: "16",
    seatNumber: "D1",
    available: false,
    customerName: "David Brown",
    bookedByNode: 6,
  },
  { id: "17", seatNumber: "D2", available: true },
  { id: "18", seatNumber: "D3", available: true },
  {
    id: "19",
    seatNumber: "D4",
    available: false,
    customerName: "Emma Davis",
    bookedByNode: 3,
  },
  { id: "20", seatNumber: "D5", available: true },
];

const initialTransactions: TransactionDto[] = [
  {
    id: 1,
    timestamp: "14:32:15",
    nodeId: 3,
    actionType: ActionType.BUY,
    description: "Customer Jane Doe bought Seat A2",
  },
  {
    id: 2,
    timestamp: "14:32:18",
    nodeId: 1,
    actionType: ActionType.LOCK,
    description: "Node 1 locked Seat A4",
  },
  {
    id: 3,
    timestamp: "14:32:20",
    nodeId: 1,
    actionType: ActionType.BUY,
    description: "Customer John Smith bought Seat A4",
  },
  {
    id: 4,
    timestamp: "14:32:25",
    nodeId: 5,
    actionType: ActionType.BUY,
    description: "Customer Alice Johnson bought Seat B2",
  },
  {
    id: 5,
    timestamp: "14:32:30",
    nodeId: 3,
    actionType: ActionType.HEARTBEAT,
    description: "Leader Node 3 sent heartbeat",
  },
];

export default async function AdminPage() {
  const initialNodes = await getAllNodes();

  return (
    <AdminClient
      initialNodes={initialNodes}
      initialSeats={initialSeats}
      initialTransactions={initialTransactions}
    />
  );
}
