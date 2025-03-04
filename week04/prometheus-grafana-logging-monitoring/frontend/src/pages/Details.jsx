import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import axios from 'axios';
import { API_KEY, weatherColors, unitMap } from "../contexts/GeneralContext";

const Details = () => {
    const [data, setData] = useState(null);
    const [unit, setUnit] = useState('standard');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { lat, lon } = useParams();

    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`);
          setData(res.data);
          setError('');
        } catch(err) {
          setError(err, " Cannot get current weather!");
          setData(null);
        } finally {
          setLoading(false);
        }
      }

      fetchData();
    }, [unit]);

    function handleSelectChange(e) {
        setUnit(e.target.value);
    }

  return (
    <>
      <div className="min-h-screen flex gap-2 mt-[36px]">
        <div className="flex flex-1 flex-col items-center">
          {loading && (
            <div className="flex justify-center items-center">
              <div className="w-10 h-10 border-4 border-blue-700 border-t-transparent animate-spin rounded-full"></div>
            </div>
          )}
          {data && (
            <>
              <p className="text-4xl font-semibold leading-12">{data.name}</p>
              <p className="text-gray-700 text-[12px]">{data.coord.lat}, {data.coord.lon}</p>
              <p>UTC {data.timezone >=0 ? '+' : ''}{data.timezone / 3600}</p>
              <p>{new Date((data.dt + data.timezone) * 1000).toUTCString().replace(' GMT', '')}</p>
              <img 
                src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                alt={data.weather[0].description}
                className="w-16 h-16 mt-[36px]"
                />
              <div className={`${weatherColors[data.weather[0].main] || ''} flex px-3 py-1 items-center justify-center shadow-xs rounded-full`}>
                <p>{data.weather[0].description}</p>
              </div>
              <div className="flex gap-5 mt-3">
                  <p>{data.main.temp} <b>{unitMap[unit]}</b></p>
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
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default Details