import { AlertTriangle, CheckCircle, Phone } from "lucide-react";
import React from "react";
import { tokens } from "@/lib/utils/tokens";
import { useComplaints } from "../hooks/useComplaints";

export const CustomerComplaints: React.FC = () => {
  const { complaints, resolveComplaint, totalTickets, pendingTickets, resolvedTickets } =
    useComplaints();

  return (
    <div
      className={`rounded-2xl border ${tokens.colors.border} ${tokens.colors.cardBg} p-6 shadow-sm`}
    >
      <h3 className={`${tokens.fontSizes.heading} ${tokens.colors.textPrimary}`}>
        Customer Complaints
      </h3>
      <p className={`${tokens.fontSizes.body} ${tokens.colors.textMuted} mt-0.5`}>
        Monitor and resolve issues reported by customers.
      </p>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div
          className={`p-4 rounded-xl border ${tokens.colors.border} ${tokens.colors.cardBgMuted}`}
        >
          <span className={`${tokens.fontSizes.bodyBold} ${tokens.colors.textMuted}`}>
            Total Tickets
          </span>
          <h4 className={`text-xl font-extrabold ${tokens.colors.textPrimary} mt-1`}>
            {totalTickets}
          </h4>
        </div>
        <div
          className={`p-4 rounded-xl border ${tokens.colors.border} ${tokens.colors.cardBgMuted}`}
        >
          <span className={`${tokens.fontSizes.bodyBold} text-amber-505`}>Pending Resolution</span>
          <h4 className="text-xl font-extrabold text-amber-500 mt-1">{pendingTickets}</h4>
        </div>
        <div
          className={`p-4 rounded-xl border ${tokens.colors.border} ${tokens.colors.cardBgMuted}`}
        >
          <span className={`${tokens.fontSizes.bodyBold} text-emerald-505`}>Resolved Today</span>
          <h4 className="text-xl font-extrabold text-emerald-500 mt-1">{resolvedTickets}</h4>
        </div>
      </div>

      {/* Tickets List */}
      <div className="mt-6 space-y-4">
        {complaints.map((ticket) => (
          <div
            key={ticket.id}
            className={`p-4 rounded-xl border ${tokens.colors.border} flex flex-col md:flex-row md:items-center md:justify-between gap-4`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2.5">
                <span className={`${tokens.fontSizes.bodyBold} ${tokens.colors.textPrimary}`}>
                  Order #{ticket.orderId}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    ticket.type === "Missing Item"
                      ? "bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/20 dark:border-amber-900/30"
                      : "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/30"
                  }`}
                >
                  {ticket.type}
                </span>
                <span className={`${tokens.fontSizes.small} ${tokens.colors.textMuted}`}>
                  {ticket.time}
                </span>
              </div>
              <p className={`mt-2 ${tokens.fontSizes.bodyBold} ${tokens.colors.textSecondary}`}>
                Customer:{" "}
                <span className="font-semibold text-zinc-950 dark:text-white">
                  {ticket.customerName}
                </span>{" "}
                (Item: {ticket.item})
              </p>
              <p className={`mt-1 ${tokens.fontSizes.body} ${tokens.colors.textSecondary} italic`}>
                "{ticket.text}"
              </p>
            </div>

            <div className="flex items-center gap-3.5">
              <span
                className={`flex items-center gap-1 text-xs font-bold ${
                  ticket.status === "resolved" ? "text-emerald-500" : "text-amber-500"
                }`}
              >
                {ticket.status === "resolved" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                {ticket.status === "resolved" ? "Resolved" : "Action Required"}
              </span>

              {ticket.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => resolveComplaint(ticket.id)}
                    className={`rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 ${tokens.fontSizes.bodyBold} transition-colors cursor-pointer shadow-sm`}
                  >
                    Refund & Resolve
                  </button>
                  <a
                    href="tel:+919876543210"
                    className={`rounded-lg border ${tokens.colors.border} bg-white hover:bg-zinc-50 text-zinc-650 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-400 p-2 transition-colors flex items-center justify-center`}
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerComplaints;
