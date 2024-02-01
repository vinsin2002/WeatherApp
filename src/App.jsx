import { useState } from 'react';
import axios from 'axios';
import ForecastCard from './ForecastCard';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [isCelsius, setIsCelsius] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeatherData = async () => {
    try {
      const currentWeatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_API_KEY}`;
      const response = await axios.get(currentWeatherApiUrl);
      setWeatherData(response.data);

      const { coord } = response.data;
      const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&appid=${import.meta.env.VITE_API_KEY}`;
      const forecastResponse = await axios.get(forecastApiUrl);
      setForecastData(forecastResponse.data.list);
    } catch (error) {
      setError(error.message);
    }
  };

  const kelvinToCelsius = kelvin => Math.ceil(kelvin - 273.15);
  const kelvinToFahrenheit = kelvin => Math.ceil((kelvin - 273.15) * 9/5 + 32);

  const handleSearch = () => {
    if (city.trim() !== '') {
      setWeatherData(null);
      setForecastData([]);
      setError(null);
      fetchWeatherData();
    }
  };

  const handleToggle = () => {
    setIsCelsius(prevState => !prevState);
  };

  const groupForecastDataByDate = () => {
    const groupedData = {};

    const filteredData = forecastData.filter(item => !item.dt_txt.includes(new Date().toISOString().split('T')[0]));

    filteredData.forEach(forecastItem => {
      const date = forecastItem.dt_txt.split(' ')[0];
      if (!groupedData[date]) {
        groupedData[date] = {
          temp: 0,
          temp_max: -Infinity,
          temp_min: Infinity,
          humidity: 0,
          windSpeed: 0,
          windDirection: 0,
          icon: '', 
          description: '', 
        };
      }
      groupedData[date].temp += forecastItem.main.temp;
      groupedData[date].temp_max = Math.max(groupedData[date].temp_max, forecastItem.main.temp_max);
      groupedData[date].temp_min = Math.min(groupedData[date].temp_min, forecastItem.main.temp_min);
      groupedData[date].humidity += forecastItem.main.humidity;
      groupedData[date].windSpeed += forecastItem.wind.speed;
      groupedData[date].windDirection += forecastItem.wind.deg;
      groupedData[date].icon = forecastItem.weather[0].icon;
      groupedData[date].description = forecastItem.weather[0].description;
    });

    Object.keys(groupedData).forEach(date => {
      const count = filteredData.filter(item => item.dt_txt.includes(date)).length;
      groupedData[date].temp /= count;
      groupedData[date].humidity /= count;
      groupedData[date].windSpeed /= count;
      groupedData[date].windDirection /= count;
    });

    return groupedData;
  };

  const groupedForecastData = groupForecastDataByDate();

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className='w-2/3 sm:w-1/2 flex justify-center space-x-2'>
      <button
          className="h-10 border-2 border-black flex justify-center items-center p-2 rounded-md"
          onClick={handleToggle}
        >
          {isCelsius ? '°F' : '°C'}
        </button>
        <input
          type="text"
          className="h-10 w-2/3 border-2 border-black p-1 rounded-md placeholder:font-thin"
          placeholder='Enter a city name'
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          className="h-10 border-2 border-black flex justify-center items-center p-2 rounded-md"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      <div className="h-1/3 w-1/3 m-2">
        {error ? (
          <p className='text-md text-center font-thin bg-red-700 text-white p-3'>⚠️ City name not found, try again with a different city name</p>
        ) : (
          weatherData && (
            <div className='flex flex-col justify-center items-center'>
              <div className='flex space-x-5 items-center'>
                <h1 className='text-5xl font-light'>{weatherData.name}</h1>
                <div className=' mt-5'>
                  <h1 className='text-3xl font-light '>
                    {isCelsius
                      ? `${kelvinToCelsius(weatherData.main.temp)}°C`
                      : `${kelvinToFahrenheit(weatherData.main.temp)}°F`}
                  </h1>
                  <img
                    className=''
                    src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
                    alt={weatherData.weather[0].description}
                  />
                </div>
              </div>
              <div className='flex flex-col justify-center items-center text-xs sm:text-lg text-center'>
                <p className='text-2xl font-light'>{weatherData.weather[0].description}</p>
                <p className='font-light '>High: {isCelsius ? kelvinToCelsius(weatherData.main.temp_min) : kelvinToFahrenheit(weatherData.main.temp_min)}°
                  {isCelsius ? 'C' : 'F'} / Low: {isCelsius ? kelvinToCelsius(weatherData.main.temp_max) : kelvinToFahrenheit(weatherData.main.temp_max)}°
                  {isCelsius ? 'C' : 'F'}
                </p>
                <p className='font-light '>Humidity: {weatherData.main.humidity}%</p>
                <p className='font-light '>Wind Speed: {weatherData.wind.speed} m/s / Direction: {weatherData.wind.deg}°</p>
              </div>
            </div>
          )
        )}
      </div>
      <div className="h-1/3 w-3/4 sm:w-2/3 flex flex-col sm:flex-row justify-center items-center">
        {Object.keys(groupedForecastData).map((date, index) => (
          <ForecastCard
            key={index}
            date={date}
            data={groupedForecastData[date]}
            isCelsius={isCelsius}
            kelvinToCelsius={kelvinToCelsius}
            kelvinToFahrenheit={kelvinToFahrenheit}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
