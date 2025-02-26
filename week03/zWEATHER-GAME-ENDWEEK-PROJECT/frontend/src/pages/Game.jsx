import { useEffect, useState } from "react"
import axios from 'axios'
import { API_KEY, weatherIcons, weatherShadows } from "../contexts/GeneralContext"
import FightEvent from "../components/FightEvent";


export const Game = () => {
    const [mySquad, setMySquad] = useState([]);
    const [enemySquad, setEnemySquad] = useState([]);
    const [wave, setWave] = useState(0);
    const [cities, setCities] = useState([]);
    const [data, setData ] = useState([]);
    const [weather, setWeather] = useState(null);
    const [error, setError ] = useState(null);
    const [loading, setLoading] = useState(false);

    console.log('weather: ', weather);
    console.log('my squad: ', mySquad);

    useEffect(() => {
        if(!data) return;

        if(!data.lat || !data.lon) return;

        const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${data.lat}&lon=${data.lon}&appid=${API_KEY}`);

            if (!res.data || !res.data.list) {
                setError("Weather data not found.");
                return;
            }

            setWeather(res.data.list.slice(0, 5).map(w => ({
                main: w.weather[0].main,
                icon: w.weather[0].icon,
                level: 0,
                qty: 1
            })));
            setError(null);
        } catch(err) {
            setError(err + 'Cannot fetch weather, please check if your city is invalid!');
            setWeather(null);
        } finally {
            setLoading(false);
        }
        }

        fetchData();
    }, [data]);


    // function handleInputChange(e) {
    //     setCity(e.target.value);
    // }

    const fetchCities = async () => {
        const apiUrl = `http://localhost:5000/api/cities`;
    
        try {
          const res = await axios.get(apiUrl);
          console.log('data: ', res.data);
    
          setCities(res.data);
        } catch (error) {
          console.error("Lỗi khi gọi API cities:", error);
        }
      };

    function handleSelect() {
        if(!weather) return;
        setMySquad(weather);
    }

    function handleFightEnd(meWin) {
        if(meWin) {
            setMySquad(mySquad.map((chess, index) => index === wave ? weather[wave] : chess));
        } 
        if(wave < 4) {
            setWave(w => w + 1);
        } else {
            setWave(0);
        }
    }
     
    function handleRunEnd() {
        if(wave < 4) {
            setWave(w => w + 1);
        } else {
            setWave(0);
        }
    }

    function isEnhanced(squad) {
        const firsMain = squad[0].main;
        return squad.every(chess => chess.main === firsMain);
    }

  return (
    <>
        <div className="min-h-screen flex items-center flex-col sm:gap-4 px-2 gap-2 pb-[66px]">
            {/* <div className="flex justify-center items-center leading-22 rounded-full shadow-2xl mt-[22px] gap-2">
                <p className="text-5xl ms-6.5">🏙️</p>
                <input className="w-full outline-0 pe-3" value={city} onChange={handleInputChange} placeholder="Enter a city..." />
            </div> */}
                    <div className="p-6 text-center">
                        <button
                            onClick={fetchCities}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg hover:bg-blue-600"
                        >
                            Lấy thành phố ngẫu nhiên
                        </button>

                        <ul className="mt-4 flex flex-wrap gap-4 justify-center">
                            {cities.map((city, index) => (
                            <li key={index} className="text-lg font-semibold"
                                onClick={() => setData(city)}
                            >
                                🌍 {city.name}, {city.country}
                            </li>
                            ))}
                        </ul>
                    </div>
            {data && (
                <>  <p className="text-4xl sm:text-5xl font-montserrat font-semibold text-center cursor-pointer">
                        MY SQUAD
                    </p>
                    <div className="flex flex-wrap justify-center sm:gap-18 gap-12 a">
                        {mySquad ? mySquad.map(weatherChess => (
                            <div className={`flex flex-col gap-2 rounded-[66px] shadow-2xl px-8 py-8 items-center mb-[36px] relative a
                                            ${weatherShadows[weatherChess.main]} || ''}
                                            `}>
                                <p className="text-2xl absolute top-[-18px] font-bold">{weatherChess.main}</p>
                                <img 
                                    src={`https://openweathermap.org/img/wn/${weatherChess.icon}@4x.png`}
                                    className="w-36 h-36 flex justify-center items-center"
                                    alt={weatherChess.icon}
                                    />
                            </div>
                        )) : <p>No chess</p>}
                    </div>
                    {mySquad.length > 0 && weather.length > 0 && (
                        <>
                            <FightEvent myChess={mySquad[wave]} enemyChess={weather[wave]} onFightEnd={handleFightEnd} onRunEnd={handleRunEnd} isMyEnhanced={isEnhanced(mySquad)} isEnemyEnhanced={isEnhanced(weather)} />
                        </>
                    )}
                    <p className="text-4xl sm:text-5xl font-montserrat font-semibold text-center cursor-pointer">
                        {data.name}
                    </p>
                    <div className="flex flex-wrap justify-center sm:gap-18 gap-12 a">
                        {weather && weather.map((dayWeather, index) => (
                            <div key={index}>
                                <div className={`flex flex-col gap-2 rounded-[66px] shadow-2xl px-8 py-8 items-center mb-[36px] relative a
                                                ${weatherShadows[dayWeather.main]} || ''}
                                                `}>
                                    <p className="text-2xl absolute top-[-18px] font-bold">{dayWeather.main}</p>
                                    <img 
                                        src={`https://openweathermap.org/img/wn/${dayWeather.icon}@4x.png`}
                                        alt={dayWeather.icon}
                                        className="w-36 h-36"
                                        />
                                </div>
                            </div>
                        ))}
                    </div>
                    {mySquad.length === 0 && <button onClick={handleSelect} className="bg-black text-2xl text-white">Select</button>}
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
                    {/* <div className="flex flex-wrap justify-center sm:gap-18 mt-[36px] gap-12">
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
                    </div> */}
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
