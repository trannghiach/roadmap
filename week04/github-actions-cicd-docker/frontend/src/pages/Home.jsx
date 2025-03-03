import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_KEY, weatherColors, unitMap } from "../contexts/GeneralContext";

export const Home = () => {
    const [city, setCity ] = useState('');
    const [data, setData ] = useState([]);
    const [weather, setWeather] = useState([]);
    const [error, setError ] = useState(null);
    const [loading, setLoading] = useState(false);
    const [unit, setUnit] = useState('standard');
    const [number, setNumber] = useState(0);

    console.log('data: ', data);
    console.log('weather: ', weather);
    console.log('number: ', number);

    const navigate = useNavigate();

    useEffect(() => {
        if(!city) return;

        const fetchData = async () => {
            setLoading(true);
            setWeather([]);
            setData([]);
            setError(null);
            setNumber(0);
            try {
                const res = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=12&appid=${API_KEY}`);

                if (!res.data || res.data.length === 0) {
                    setError('City not existed!');
                    return;
                }

                setData(res.data);

                setError(null);
            } catch(err) {
                setError(err + 'Cannot fetch lat & lon, please check if your city is invalid!');
                setData([]);
            } finally {
                setLoading(false);
            }
        };
        
        const timer = setTimeout(fetchData, 800);
        return () => clearTimeout(timer);
    }, [city])

    useEffect(() => {
        if(!data) return;

        if(!data[number]) return;

        if(!data[number].lat || !data[number].lon) return;

        const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${data[number].lat}&lon=${data[number].lon}&appid=${API_KEY}&units=${unit}`);

            if (!res.data || !res.data.list) {
                setError("Weather data not found.");
                return;
            }

            const newObject = res.data.list.slice(0,5).reduce((acc, cur, index) => {
                acc[index] = cur;
                return acc;
            }, {});

            console.log('object: ', newObject);

            setWeather(prevWeather => [
                ...prevWeather, newObject]);
            setError(null);
        } catch(err) {
            setError(err + 'Cannot fetch weather, please check if your city is invalid!');
            setWeather([]);
        } finally {
            setLoading(false);
        }
        }

        fetchData();
    }, [data, unit, number]);


    function handleInputChange(e) {
        setCity(e.target.value);
    }

    function handleSelectChange(e) {
        setUnit(e.target.value);
    }

    function handelTitleClick(i) {
        navigate(`/${data[i].lat}/${data[i].lon}`);
    }

    function handleLoadMore() {
        if(number + 2 <= data.length) setNumber(n => n + 1);
    }

  return (
    <>
        <div className="min-h-screen flex items-center flex-col sm:gap-14 px-2 gap-8 mb-[66px]">
            <div className="flex justify-center items-center leading-22 rounded-full shadow-2xl mt-[22px] gap-2">
                <p className="text-5xl ms-6.5">🏙️</p>
                <input className="w-full outline-0 pe-3" value={city} onChange={handleInputChange} placeholder="Enter a city..." />
                <div>
                    <select
                    value={unit}
                    onChange={handleSelectChange}
                    className="border rounded-full border-gray-200 px-3 me-4"
                    >
                        <option value="standard">Farenheit (°F)</option>
                        <option value="metric">Celcius (°C)</option>
                        <option value="imperial">Kelvin (K)</option>
                    </select>
                </div>
            </div>
            <p className="text-emerald-600">Got {data.length} results!</p>
            {data && data.slice(0, number + 1).map((child, i) => (
                <>
                    <p className="text-4xl sm:text-5xl font-montserrat font-semibold text-center cursor-pointer"
                        onClick={() => handelTitleClick(i)}
                        >
                        {child.name}
                    </p>
                    <div className="flex flex-wrap justify-center sm:gap-18 mt-[36px] gap-12">
                    {weather[i] && Object.values(weather[i]).map(dayWeather => (
                        <div className={`flex flex-col gap-2 rounded-[66px] shadow-2xl px-18 py-8 items-center mb-[36px] 
                                        ${weatherColors[dayWeather.weather[0].main] || ''}
                                        `}>
                            <img 
                                src={`https://openweathermap.org/img/wn/${dayWeather.weather[0].icon}@2x.png`}
                                alt={dayWeather.weather[0].description}
                                className="w-16 h-16"
                                />
                            <p>{new Date(dayWeather.dt * 1000).toLocaleTimeString([], { hour: "numeric", hour12: true })}</p>
                            <p>{dayWeather.main.temp} <b>{unitMap[unit]}</b></p>
                        </div>
                    ))}
                    </div>
                </>
            ))}
            {loading && (
            <div className="flex justify-center items-center">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            )}
            {data.length > 0 && (
                <button className={`py-3 px-6 rounded-full flex justify-center items-center border-2
                                    ${number + 2 > data.length ? "border-gray-200 text-gray-400 cursor-not-allowed" : "border-gray-400 cursor-pointer " }`}
                            onClick={handleLoadMore}
                        >
                    Load More
                </button>
            )}
            {error && <p className="text-red-500 font-bold text-2xl">{error}</p>}
        </div>
    </>
  )
}
