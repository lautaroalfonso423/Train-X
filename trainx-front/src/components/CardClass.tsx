'use client';

interface ClassCardProps {
  name: string;
  instructor: string;
  time: string;
  duration: string;
  capacity: number;
  booked: number;
  location: string;
  image: string;
  onBook: () => void;
}

export default function ClassCard({
  name,
  instructor,
  time,
  duration,
  capacity,
  booked,
  location,
  image,
  onBook,
}: ClassCardProps) {
  const spotsLeft = capacity - booked;
  const isAlmostFull = spotsLeft <= 3;
  const isFull = spotsLeft === 0;

  return (
    <div className="overflow-hidden rounded-xl bg-white border border-gray-300 hover:border-orange-500 transition-colors shadow-sm">
      {/* Imagen */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/fallback-image.jpg";
          }}
        />
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full`}
            style={{
              backgroundColor: isFull
                ? "#ef4444"
                : isAlmostFull
                ? "#f59e0b"
                : "#FF6B00",
              color: "#121212",
            }}
          >
            {isFull ? "Completo" : `${spotsLeft} cupos`}
          </span>
        </div>
      </div>

      {/* Información */}
      <div className="p-5">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-1 text-gray-900">{name}</h3>
          <p className="text-sm text-gray-500">con {instructor}</p>
        </div>

        {/* Detalles */}
        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span>🕒</span>
            <span>
              {time} • {duration}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>👥</span>
            <span>
              {booked}/{capacity} participantes
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span>{location}</span>
          </div>
        </div>

        {/* Botón */}
        <button
          disabled={isFull}
          onClick={onBook}
          className={`w-full py-2 rounded-md font-semibold transition-colors ${
            isFull
              ? "bg-gray-800 text-gray-400 cursor-not-allowed"
              : "bg-orange-500 text-black hover:bg-orange-400"
          }`}
        >
          {isFull ? "Clase Completa" : "Reservar Turno"}
        </button>
      </div>
    </div>
  );
}
