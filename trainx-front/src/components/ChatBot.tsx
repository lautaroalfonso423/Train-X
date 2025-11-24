import Chat from "./Chat";

const routines = [
  {
    title: "Rutina tren inferior",
    exercises: [
      "Sentadilla con barra 4x12",
      "Peso muerto rumano 3x12",
      "Zancada con mancuerna 3x12",
      "Prensa de piernas 3x12",
      "Elevación de talones 4x15"
    ]
  },
  {
    title: "Rutina tren superior",
    exercises: [
      "Press de banca con barra 4x10",
      "Remo con barra 3x12",
      "Press militar con mancuernas 3x12",
      "Jalon al pecho en polea 3x12",
      "Curl de bíceps con barra 3x12",
      "Fondos en paralelas 3x12"
    ]
  },
  {
    title: "Rutina cuerpo completo",
    exercises: [
      "Sentadilla con barra 3x12",
      "Press de banca 3x10",
      "Peso muerto 3x10",
      "Dominadas 3x12",
      "Press militar con mancuernas 3x10",
      "Curl de bíceps 3x12"
    ]
  },
];

const ChatBot = () => {
  return (
    <div className="w-full max-w-[1600px] h-screen mx-auto p-6 md:p-12">
      {/* Rutinas */}
      <div className="grid grid-cols-1 h-72 sm:grid-cols-2 h-72 lg:grid-cols-3 h-72 gap-6">
        {routines.map((routine, index) => (
          <div
            key={index}
            className="flex flex-col bg-(--muted) p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow"
          >
            <h2 className="text-(--primary) text-xl md:text-2xl font-semibold mb-4 text-center">
              {routine.title}
            </h2>
            <div className="flex flex-col gap-2">
              {routine.exercises.map((exercise, i) => (
                <p
                  key={i}
                  className="text-(--card-foreground) text-sm md:text-base text-center"
                >
                  {exercise}
                </p>
              ))}
            </div>
          </div>
        ))}
        <div className="w-4xl h-72">
          <Chat />
      </div>
      </div>
    </div>
  )
}

export default ChatBot;
