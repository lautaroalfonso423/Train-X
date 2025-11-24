// "use client";
// import { useState } from "react";

// interface Booking {
//   id: string;
//   className: string;
//   instructor: string;
//   date: string;
//   time: string;
//   location: string;
//   status: "upcoming" | "completed" | "cancelled";
// }

// const mockBookings: Booking[] = [
//   { id: "1", className: "CrossFit Intensivo", instructor: "Juan Pérez", date: "23 Oct 2025", time: "10:00 AM", location: "Sala Principal", status: "upcoming" },
//   { id: "2", className: "Yoga Flow", instructor: "María López", date: "24 Oct 2025", time: "08:00 AM", location: "Estudio Zen", status: "upcoming" },
//   { id: "3", className: "Spinning Power", instructor: "Carlos Ruiz", date: "25 Oct 2025", time: "06:00 PM", location: "Sala de Cycling", status: "upcoming" },
//   { id: "4", className: "HIIT Training", instructor: "Pedro Sánchez", date: "20 Oct 2025", time: "12:00 PM", location: "Sala Funcional", status: "completed" },
// ];

// export default function MyBookings() {
//   const [bookings, setBookings] = useState<Booking[]>(mockBookings);
//   const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
//   const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

//   const handleCancelClick = (id: string) => {
//     setBookingToCancel(id);
//     setCancelDialogOpen(true);
//   };

//   const handleConfirmCancel = () => {
//     if (!bookingToCancel) return;
//     setBookings((prev) =>
//       prev.map((b) =>
//         b.id === bookingToCancel ? { ...b, status: "cancelled" } : b
//       )
//     );
//     setCancelDialogOpen(false);
//     setBookingToCancel(null);
//     alert("Reserva cancelada exitosamente ✅");
//   };

//   const upcoming = bookings.filter((b) => b.status === "upcoming");
//   const past = bookings.filter((b) => b.status === "completed" || b.status === "cancelled");

//   return (
//     <div className="w-full max-w-6xl mx-auto p-6 pb-12">
//       {/* Header */}
//       <div className="flex flex-col">
//         <h2 className="font-semibold text-2xl">Mis Reservas</h2>
//         <p className="font-light text-lg text-(--muted-foreground) mt-3">
//           Gestiona tus clases reservadas y consulta tu historial
//         </p>
//       </div>

//       {/* Próximas clases */}
//       <div className="mt-8">
//         <h3 className="text-xl font-semibold mb-4">Próximas Clases</h3>
//         <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//           {upcoming.length === 0 ? (
//             <div className="bg-(--secondary) border border-(--muted-foreground) rounded-xl p-8 text-center">
//               <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-(--muted-foreground)" />
//               <p className="text-[14px] text-(--muted-foreground)">No tienes clases reservadas próximamente</p>
//             </div>
//           ) : (
//             upcoming.map((b) => (
//               <div
//                 key={b.id}
//                 className="flex flex-col bg-(--secondary) border border-(--muted-foreground) p-6 rounded-xl hover:border-(--primary) transition"
//               >
//                 {/* Header */}
//                 <div className="flex justify-between items-start mb-3">
//                   <span className="text-[11px] px-2 py-1 rounded bg-(--primary)/80 text-black font-semibold">
//                     Confirmada
//                   </span>
//                   <button
//                     onClick={() => handleCancelClick(b.id)}
//                     className="text-gray-400 hover:text-red-500 transition"
//                   >
//                     <XIcon className="w-4 h-4" />
//                   </button>
//                 </div>

//                 {/* Info de la clase */}
//                 <h4 className="text-lg font-bold">{b.className}</h4>
//                 <p className="text-sm text-(--card-foreground) mt-1">con {b.instructor}</p>

//                 {/* Detalles */}
//                 <div className="mt-4 space-y-2 text-[13px] text-(--card-foreground)">
//                   <div className="flex items-center gap-2"><CalendarIcon className="w-4 h-4" /> {b.date}</div>
//                   <div className="flex items-center gap-2"><ClockIcon className="w-4 h-4" /> {b.time}</div>
//                   <div className="flex items-center gap-2"><MapPinIcon className="w-4 h-4" /> {b.location}</div>
//                 </div>

//                 <button className="mt-6 bg-(--primary)/80 hover:bg-(--primary) px-3 py-2 rounded-xl text-black font-semibold transition">
//                   Ver detalles
//                 </button>
//               </div>
//             ))
//           )}
//         </div>
//       </div>


//       {/* Modal */}
//       {cancelDialogOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-(--secondary) rounded-xl p-6 w-80 text-center space-y-4">
//             <h4 className="text-lg font-semibold">¿Cancelar reserva?</h4>
//             <p className="text-sm text-(--muted-foreground)">
//               Esta acción liberará tu cupo. Podrás volver a reservar si hay disponibilidad.
//             </p>
//             <div className="flex justify-center gap-3 mt-4">
//               <button
//                 onClick={() => setCancelDialogOpen(false)}
//                 className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
//               >
//                 No, mantener
//               </button>
//               <button
//                 onClick={handleConfirmCancel}
//                 className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white text-sm"
//               >
//                 Sí, cancelar
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ==== Iconos SVG ==== */
// function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//       <rect x="3" y="4" width="18" height="18" rx="2" />
//       <line x1="16" y1="2" x2="16" y2="6" />
//       <line x1="8" y1="2" x2="8" y2="6" />
//       <line x1="3" y1="10" x2="21" y2="10" />
//     </svg>
//   );
// }
// function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//       <circle cx="12" cy="12" r="10" />
//       <polyline points="12 6 12 12 16 14" />
//     </svg>
//   );
// }
// function MapPinIcon(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//       <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
//       <circle cx="12" cy="10" r="3" />
//     </svg>
//   );
// }
// function XIcon(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//       <line x1="18" y1="6" x2="6" y2="18" />
//       <line x1="6" y1="6" x2="18" y2="18" />
//     </svg>
//   );
// }
