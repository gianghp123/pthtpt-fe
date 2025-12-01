'use client'
import { useState } from "react"
import { Filter, Download, RefreshCw, X } from "lucide-react"

export default function Page() {
  const [seats, setSeats] = useState([
    { id: 1, seat_number: "A1", status: "AVAILABLE", customer_name: null, booked_by_node: null, updated_at: "2025-01-01 12:00:00" },
    { id: 2, seat_number: "A2", status: "BOOKED", customer_name: "John Doe", booked_by_node: "Node 3", updated_at: "2025-01-01 12:05:00" },
    { id: 3, seat_number: "A3", status: "AVAILABLE", customer_name: null, booked_by_node: null, updated_at: "2025-01-01 12:00:02" },
    { id: 4, seat_number: "A4", status: "BOOKED", customer_name: "Jane Smith", booked_by_node: "Node 1", updated_at: "2025-01-01 12:10:00" },
    { id: 5, seat_number: "A5", status: "AVAILABLE", customer_name: null, booked_by_node: null, updated_at: "2025-01-01 12:00:00" },
    { id: 6, seat_number: "A6", status: "BOOKED", customer_name: "Bob Wilson", booked_by_node: "Node 2", updated_at: "2025-01-01 12:15:00" },
    { id: 7, seat_number: "A7", status: "AVAILABLE", customer_name: null, booked_by_node: null, updated_at: "2025-01-01 12:00:00" },
    { id: 8, seat_number: "A8", status: "AVAILABLE", customer_name: null, booked_by_node: null, updated_at: "2025-01-01 12:00:00" },
    { id: 9, seat_number: "B1", status: "AVAILABLE", customer_name: null, booked_by_node: null, updated_at: "2025-01-01 12:00:00" },
    { id: 10, seat_number: "B2", status: "BOOKED", customer_name: "Alice Brown", booked_by_node: "Node 1", updated_at: "2025-01-01 12:20:00" },
    { id: 11, seat_number: "B3", status: "AVAILABLE", customer_name: null, booked_by_node: null, updated_at: "2025-01-01 12:00:00" },
    { id: 12, seat_number: "B4", status: "AVAILABLE", customer_name: null, booked_by_node: null, updated_at: "2025-01-01 12:00:00" },
    { id: 13, seat_number: "B5", status: "AVAILABLE", customer_name: null, booked_by_node: null, updated_at: "2025-01-01 12:00:00" },
    { id: 14, seat_number: "B6", status: "AVAILABLE", customer_name: null, booked_by_node: null, updated_at: "2025-01-01 12:00:00" },
    { id: 15, seat_number: "B7", status: "AVAILABLE", customer_name: null, booked_by_node: null, updated_at: "2025-01-01 12:00:00" },
    { id: 16, seat_number: "B8", status: "AVAILABLE", customer_name: null, booked_by_node: null, updated_at: "2025-01-01 12:00:00" },
    { id: 17, seat_number: "C1", status: "AVAILABLE", customer_name: null, booked_by_node: null, updated_at: "2025-01-01 12:00:00" },
    { id: 18, seat_number: "C2", status: "AVAILABLE", customer_name: null, booked_by_node: null, updated_at: "2025-01-01 12:00:00" },
    { id: 19, seat_number: "C3", status: "BOOKED", customer_name: "Charlie Davis", booked_by_node: "Node 3", updated_at: "2025-01-01 12:25:00" },
    { id: 20, seat_number: "C4", status: "AVAILABLE", customer_name: null, booked_by_node: null, updated_at: "2025-01-01 12:00:00" },
    { id: 21, seat_number: "C5", status: "AVAILABLE", customer_name: null, booked_by_node: null, updated_at: "2025-01-01 12:00:00" },
    { id: 22, seat_number: "C6", status: "AVAILABLE", customer_name: null, booked_by_node: null, updated_at: "2025-01-01 12:00:00" },
    { id: 23, seat_number: "C7", status: "AVAILABLE", customer_name: null, booked_by_node: null, updated_at: "2025-01-01 12:00:00" },
    { id: 24, seat_number: "C8", status: "AVAILABLE", customer_name: null, booked_by_node: null, updated_at: "2025-01-01 12:00:00" },
    { id: 25, seat_number: "D1", status: "AVAILABLE", customer_name: null, booked_by_node: null, updated_at: "2025-01-01 12:00:00" },
    { id: 26, seat_number: "D2", status: "AVAILABLE", customer_name: null, booked_by_node: null, updated_at: "2025-01-01 12:00:00" },
    { id: 27, seat_number: "D3", status: "AVAILABLE", customer_name: null, booked_by_node: null, updated_at: "2025-01-01 12:00:00" },
    { id: 28, seat_number: "D4", status: "AVAILABLE", customer_name: null, booked_by_node: null, updated_at: "2025-01-01 12:00:00" },
    { id: 29, seat_number: "D5", status: "AVAILABLE", customer_name: null, booked_by_node: null, updated_at: "2025-01-01 12:00:00" },
    { id: 30, seat_number: "D6", status: "AVAILABLE", customer_name: null, booked_by_node: null, updated_at: "2025-01-01 12:00:00" },
    { id: 31, seat_number: "D7", status: "AVAILABLE", customer_name: null, booked_by_node: null, updated_at: "2025-01-01 12:00:00" },
    { id: 32, seat_number: "D8", status: "AVAILABLE", customer_name: null, booked_by_node: null, updated_at: "2025-01-01 12:00:00" },
  ])

  const [logs, setLogs] = useState([
    { id: 1, node_id: "Node 3", action_type: "BUY", description: "Purchased seat A2 for John Doe", created_at: "2025-01-01 12:05:01" },
    { id: 2, node_id: "Node 1", action_type: "LOCK", description: "Locked seat A1", created_at: "2025-01-01 11:58:12" },
    { id: 3, node_id: "Node 2", action_type: "RELEASE", description: "Released seat B3", created_at: "2025-01-01 11:55:30" },
    { id: 4, node_id: "Node 3", action_type: "BUY", description: "Purchased seat A4 for Jane Smith", created_at: "2025-01-01 12:10:05" },
  ])

  const availableSeats = seats.filter(s => s.status === "AVAILABLE").length
  const bookedSeats = seats.filter(s => s.status === "BOOKED").length

  const clearAllSeats = () => {
    const clearedSeats = seats.map(seat => ({
      ...seat,
      status: "AVAILABLE",
      customer_name: null,
      booked_by_node: null,
      updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    }))
    setSeats(clearedSeats)
    
    const newLog = {
      id: logs.length + 1,
      node_id: "Admin",
      action_type: "CLEAR",
      description: "Cleared all seats",
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    }
    setLogs([newLog, ...logs])
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8 rounded-lg">
      <div className="w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-slate-600 mt-1">Manage seats and monitor transactions in real-time</p>
          </div>
          
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm font-medium">Refresh</span>
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Export</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Seats</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{seats.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Available</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{availableSeats}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Booked</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{bookedSeats}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* SEATS GRID */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Seat Layout</h2>
                <p className="text-sm text-slate-600 mt-1">Click on a seat to view details</p>
              </div>
              
              <button 
                onClick={clearAllSeats}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 shadow-sm"
              >
                <X className="w-4 h-4" />
                <span className="text-sm font-medium">Clear All Seats</span>
              </button>
            </div>
          </div>

          {/* Theater-style seat layout */}
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              {/* Screen indicator */}
              <div className="mb-8">
                <div className="h-2 bg-linear-to-r from-transparent via-slate-300 to-transparent rounded-full mb-2"></div>
                <p className="text-center text-sm text-slate-500 font-medium">SCREEN</p>
              </div>

              {/* Seats Grid - 4 rows x 8 columns */}
              <div className="space-y-4">
                {['A', 'B', 'C', 'D'].map((row, rowIndex) => (
                  <div key={row} className="flex items-center gap-3">
                    {/* Row label */}
                    <div className="w-8 text-center font-bold text-slate-700">{row}</div>
                    
                    {/* Seats in row */}
                    <div className="flex-1 grid grid-cols-8 gap-3">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((seatNum) => {
                        const seat = seats.find(s => s.seat_number === `${row}${seatNum}`)
                        const isBooked = seat?.status === "BOOKED"
                        
                        return (
                          <div
                            key={seatNum}
                            className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                              isBooked
                                ? 'bg-red-50 border-red-300 hover:bg-red-100'
                                : 'bg-green-50 border-green-300 hover:bg-green-100 hover:scale-105'
                            }`}
                            title={isBooked ? `${seat.customer_name} - ${seat.booked_by_node}` : 'Available'}
                          >
                            {/* Seat icon */}
                            <svg 
                              className={`w-6 h-6 ${isBooked ? 'text-red-600' : 'text-green-600'}`} 
                              fill="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path d="M4 9h16v10c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V9zm3-6h10v2H7V3zm-4 6h2V7c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v2h2v2H3V9z"/>
                            </svg>
                            <span className={`text-xs font-semibold mt-1 ${isBooked ? 'text-red-700' : 'text-green-700'}`}>
                              {row}{seatNum}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-50 border-2 border-green-300"></div>
                  <span className="text-sm text-slate-600">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-50 border-2 border-red-300"></div>
                  <span className="text-sm text-slate-600">Booked</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LOGS TABLE */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Transaction Logs</h2>
                <p className="text-sm text-slate-600 mt-1">Recent activity across all nodes</p>
              </div>
              
              <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filter by Action</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Node</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Action</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Description</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700 text-sm">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-sm font-semibold">
                        {log.node_id}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                        log.action_type === "BUY" 
                          ? "bg-blue-50 text-blue-700 border-blue-200" 
                          : log.action_type === "LOCK"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : log.action_type === "CLEAR"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-purple-50 text-purple-700 border-purple-200"
                      }`}>
                        {log.action_type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-700">{log.description}</td>
                    <td className="py-4 px-6 text-slate-500 text-sm">{log.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}