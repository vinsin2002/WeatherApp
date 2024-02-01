const ForecastCard = ({ date, data, isCelsius, kelvinToCelsius, kelvinToFahrenheit }) => {
  return (
    <div className="w-full sm:w-1/5 h-10 sm:h-full m-1 flex sm:flex-col justify-evenly sm:justify-center items-center space-x-1 sm:space-x-0">
      <h1 className='text-2xl sm:text-3xl font-light'>
        {isCelsius
          ? `${kelvinToCelsius(data.temp)}°C`
          : `${kelvinToFahrenheit(data.temp)}°F`}
      </h1>
      <img
        className=''
        src={`http://openweathermap.org/img/w/${data.icon}.png`}
        alt={data.description}
      />
      <p className='text-xl font-light'>{data.description}</p>
      <p className='text-md sm:text-xl font-light'>{date}</p>
      <p className='hidden sm:block text-xs sm:text-md font-light'>
        High: {isCelsius ? kelvinToCelsius(data.temp_max) : kelvinToFahrenheit(data.temp_max)}°
        {isCelsius ? 'C' : 'F'} / Low: {isCelsius ? kelvinToCelsius(data.temp_min) : kelvinToFahrenheit(data.temp_min)}°
        {isCelsius ? 'C' : 'F'}
      </p>
      <p className='hidden sm:block text-xs sm:text-md font-light'>Humidity: {data.humidity.toFixed(0)}%</p>
      <p className='hidden sm:block text-xs sm:text-md font-light'>Wind Speed: {data.windSpeed.toFixed(2)} m/s </p>
      <p className='hidden sm:block text-xs sm:text-md font-light'>Wind Direction: {data.windDirection.toFixed(0)}°</p>
    </div>
  );
};

export default ForecastCard;
