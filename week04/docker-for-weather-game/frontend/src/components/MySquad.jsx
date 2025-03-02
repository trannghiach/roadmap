import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { weatherShadows } from "../contexts/GeneralContext"

const MySquad = ({ weatherChess, index, wave }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: weatherChess.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: "none",
    }

    const dragListeners = weatherChess.locked > 0 ? {} : listeners;

  return (
    <>
        <div ref={setNodeRef} {...attributes} {...dragListeners} style={style}
            className={`flex flex-col gap-0 rounded-[52px] shadow-2xl px-5 py-5 items-center mb-[36px] relative a
                        ${weatherShadows[weatherChess.main]} || ''
                        ${weatherChess.locked > 0 ? 'opacity-30 cursor-not-allowed' : ''}
                        ${index === wave ? 'bg-cyan-100' : ''}
                        `}>
            <p className="text-xl absolute top-[-18px] font-bold">{weatherChess.main}</p>
            <img 
                src={`https://openweathermap.org/img/wn/${weatherChess.icon}@4x.png`}
                className="w-32 h-32 flex justify-center items-center"
                alt={weatherChess.icon}
                />
            {weatherChess.qty > 1 && weatherChess.qty < 3 && <p className="text-emerald-600 font-semibold">x{weatherChess.qty}</p>}
            {weatherChess.qty >= 3 && (
                <>
                    <p className="text-amber-600 text-xl font-bold">Level {Math.floor(Math.cbrt(weatherChess.qty)) + 1}</p>
                    <p className="text-emerald-600 font-semibold">x{weatherChess.qty}</p>
                </>
            )}
            {weatherChess.locked > 0 && <p className="text-red-600 font-semibold text-xs">Locked ({weatherChess.locked} rounds left)</p>}
        </div>
    </>
  )
}

export default MySquad