import { use, useEffect, useRef, useState } from "react"
import axios from 'axios'
import { API_KEY, weatherIcons, weatherShadows, testWeatherData } from "../contexts/GeneralContext"
import FightEvent from "../components/FightEvent";

export const Game = () => {
    //status state
    const starterSquadRef = useRef([]);
    const [data, setData] = useState(null);

    //object state
    const [mySquad, setMySquad] = useState([]);
    const [enemySquad, setEnemySquad] = useState([]);
    const [wave, setWave] = useState(0);
    const [round, setRound] = useState(-2);

    //utility state
    const [error, setError ] = useState(null);
    const [loading, setLoading] = useState(false);

    console.log(round);
    console.log('my squad: ', mySquad);
    
    useEffect(() => {
        const fetch5StarterSquad = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/cities/5`);
                if(!res.data) return;
                starterSquadRef.current = res.data;
            } catch(err) {
                console.error(err);
            }
        }

        fetch5StarterSquad();
        setRound(-1);
    }, []);

    useEffect(() => {
        if(!data) return;

        if(!data.lat || !data.lon) return;

        let ignore = false;

        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${data.lat}&lon=${data.lon}&appid=${API_KEY}`);

                if (!res.data || !res.data.list) {
                    if(!ignore) setError("Weather data not found.");
                    return;
                }

                if(!ignore){
                    if(round === 1) {
                        setMySquad(res.data.list.slice(0, 5).map(w => ({
                            main: w.weather[0].main,
                            icon: w.weather[0].icon,
                            qty: 1,
                            limit: 1,
                            locked: 0
                        })));
                    } else {
                        setEnemySquad(res.data.list.slice(0, 5).map(w => ({
                            main: w.weather[0].main,
                            icon: w.weather[0].icon,
                            qty: 1
                        })));
                    }
        
                    setError(null);
                }
            } catch(err) {
                if(!ignore) {
                    setError(err + 'Cannot fetch weather, please check if your city is invalid!');
                    setEnemySquad(null);
                }
            } finally {
                if(!ignore) {
                    setLoading(false);
                }
            }
        }

        fetchData();

        return () => ignore = true;
    }, [data]);

    useEffect(() => {
        if(round < 0) return;

        const fetchEnemyCity = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/cities/1`);
                if(!res.data) return;
                setData(res.data[0]);
            } catch(err) {
                console.error(err);
            }
        }

        fetchEnemyCity();

    }, [round]);

    function handleFightEnd(meWin) {
        if(meWin) {
            setMySquad(mySquad.map((chess, index) => 
                index === wave ? {
                    ...chess,
                    main: enemySquad[index].main,
                    icon: enemySquad[index].icon,
                    qty: enemySquad[index].qty
                }
                : chess
            ));
        } else {
            setMySquad(mySquad.map((chess, index) => 
                index === wave ? {
                    ...chess,
                    locked: chess.locked + 3
                }
                : chess
            ));
        }
        if(wave < 4) {
            setWave(w => w + 1);
        } else {
            setWave(0);
            setRound(r => r + 1);
            setMySquad(mySquad.map(chess => ({
                ...chess,
                locked: chess.locked > 0 ? chess.locked - 1 : 0
            })));
        }
    }
     
    function handleRunEnd(situation) {
        //minus 1 from limit
        if(situation === 'run') {
            setMySquad(mySquad.map((chess, index) =>
                index === wave ? {
                    ...chess,
                    limit: chess.limit - 1
                }
                : chess
            ));
        }

        if(wave < 4) {
            setWave(w => w + 1);
        } else {
            setWave(0);
            setRound(r => r + 1);
            setMySquad(mySquad.map(chess => ({
                ...chess,
                locked: chess.locked > 0 ? chess.locked - 1 : 0
            })));
        }
    }

    function isEnhanced(squad) {
        const firsMain = squad[0].main;
        return squad.every(chess => chess.main === firsMain);
    }

    function handleStartGame(city) {
        setData(city);
        setRound(r => r + 1);
    }

  return (
    <>
        <div className="min-h-screen flex items-center flex-col sm:gap-4 px-2 gap-2 pb-[66px]">
            <p className="text-red-600">Round: {round}</p>
            {round < 0 && <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={() => setRound(0)}>Start Game</button>}
            {round === 0 && starterSquadRef.current.length > 0 && (
                <>  
                    <p className="text-2xl sm:text-4xl font-semibold text-center">CHOOSE YOUR SQUAD</p>
                    <div className="p-6 text-center">
                        <ul className="mt-4 flex flex-wrap gap-4 justify-center">
                            {starterSquadRef.current.map((city, index) => (
                            <li key={index} className="text-lg font-semibold cursor-pointer hover:text-green-500"
                                onClick={handleStartGame}
                            >
                                🌍 {city.name}, {city.country}
                            </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
            {data && (
                <>  {mySquad.length > 0 && <p className="text-4xl sm:text-5xl font-montserrat font-semibold text-center">MY SQUAD</p>}
                    <div className="flex flex-wrap justify-center sm:gap-18 gap-12 a">
                        {mySquad ? mySquad.map((weatherChess, index) => (
                            <div key={index} 
                                className={`flex flex-col gap-2 rounded-[66px] shadow-2xl px-8 py-8 items-center mb-[36px] relative a
                                            ${weatherShadows[weatherChess.main]} || ''
                                            ${weatherChess.locked > 0 ? 'opacity-30' : ''}
                                            ${index === wave ? 'bg-cyan-100' : ''}
                                            `}>
                                <p className="text-2xl absolute top-[-18px] font-bold">{weatherChess.main}</p>
                                <img 
                                    src={`https://openweathermap.org/img/wn/${weatherChess.icon}@4x.png`}
                                    className="w-36 h-36 flex justify-center items-center"
                                    alt={weatherChess.icon}
                                    />
                                {weatherChess.locked > 0 && <p className="text-red-600 font-semibold">Locked ({weatherChess.locked} rounds left)</p>}
                            </div>
                        )) : <p>No chess</p>}
                    </div>
                    {mySquad.length > 0 && enemySquad.length > 0 && (
                        <>
                            <FightEvent myChess={mySquad[wave]} enemyChess={enemySquad[wave]} onFightEnd={handleFightEnd} onRunEnd={handleRunEnd} isMyEnhanced={isEnhanced(mySquad)} isEnemyEnhanced={isEnhanced(enemySquad)} />
                        </>
                    )}
                    <p className="text-4xl sm:text-5xl font-montserrat font-semibold text-center">
                        {data.name} - {data.country}
                    </p>
                    <div className="flex flex-wrap justify-center sm:gap-18 gap-12 a">
                        {enemySquad && enemySquad.map((chess, index) => (
                            <div key={index}>
                                <div className={`flex flex-col gap-2 rounded-[66px] shadow-2xl px-8 py-8 items-center mb-[36px] relative a
                                                ${weatherShadows[chess.main]} || ''
                                                ${index === wave ? 'bg-pink-100' : ''}
                                                `}>
                                    <p className="text-2xl absolute top-[-18px] font-bold">{chess.main}</p>
                                    <img 
                                        src={`https://openweathermap.org/img/wn/${chess.icon}@4x.png`}
                                        alt={chess.icon}
                                        className="w-36 h-36"
                                        />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-wrap justify-center sm:gap-18 gap-12 b mt-36">
                        {weatherIcons.map((icon, index) => (
                            <div key={index} className={`flex flex-col gap-2 rounded-[66px] shadow-2xl px-8 py-8 items-center mb-[36px] relative b}
                                            `}>
                                <p className="text-2xl absolute top-[-18px] font-bold">{icon}</p>
                                <img 
                                    src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
                                    className="w-36 h-36"
                                    />
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-wrap justify-center sm:gap-18 mt-[36px] gap-12">
                    {testWeatherData.map((dayWeather, index) => (
                        <div
                            key={index}
                            className={`flex flex-col gap-2 rounded-[66px] shadow-2xl px-8 py-8 items-center mb-[36px] relative
                                        ${weatherShadows[dayWeather.main] || ''}
                                    `}
                        >
                            <p className="text-2xl absolute top-[-18px] font-bold">
                            {dayWeather.main}
                            </p>
                            <img
                            src={`https://openweathermap.org/img/wn/${dayWeather.icon}@4x.png`}
                            alt={dayWeather.main}
                            className="w-36 h-36"
                            />
                        </div>
                    ))}
                    </div>
                </>
            )}
            {loading && (
            <div className="flex justify-center items-center">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            )}
            {error && <p className="text-red-500 font-bold text-2xl">{error}</p>}
            
        </div>
    </>
  )
}
