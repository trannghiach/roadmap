import { useState, useEffect } from 'react'
import axios from 'axios'

const API_KEY = 'd2e42a11cc0abcf0ec816af429c33051'

function App() {
  const [city, setCity] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  function handleChange(e) {
    setCity(e.target.value);
  }

  useEffect(() => {
    if(!city) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
        setData(res.data);
        setError(null);
      } catch (err) {
        setError(err + 'Cannot fetch the data, check if your city is unvalid');
        setData(null);
      }
    }
    const timer = setTimeout(fetchData, 800);
    return () => clearTimeout(timer);
  }, [city]);

  return (
    <>
        <input value={city} onChange={handleChange} />
        {data && (
          <div>
            <h3>
              {data.name}, {data.sys.country}
            </h3>
            <p>Temperature: {data.main.temp}°C</p>
            <img
              src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
              alt="weather icon"
            />
          </div>
        )}
        <p>{error}</p>
    </>
  )
}

export default App;
