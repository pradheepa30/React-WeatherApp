import axios from 'axios'
import React from 'react';
import { useState, useEffect } from 'react'
import './App.css';
import WeatherNow from './components/WeatherNow'


const apiKey = 'hVz51e6JLqbGC7akCNX1iThxe3CoPwgC'

export default function App() {

  const [city, setCity] = useState('')
  const [cityKey, setCityKey] = useState()
  const [weather, setWeather] = useState()
 

  useEffect(() => {
    setCityKey(localStorage.getItem("cityKey"))
    setCity(localStorage.getItem("cityName"))
    if (cityKey) {
      getWeatherNow()
    }
  }, [cityKey])

  async function getCityKey(e) {
    e.preventDefault()
    const urlLocale = `https://dataservice.accuweather.com/locations/v1/cities/search`
    const config = {
      params: {
        apikey: apiKey,
        q: city
      }
    }
    axios.get(urlLocale, config)
      .then(res => {
        localStorage.setItem("cityName", city)
        localStorage.setItem("cityKey", res.data[0].Key)
        setCityKey(res.data[0].Key)
      })
      .catch(err => console.log(err))
  }

  function getWeatherNow() {
    const urlWeather = `https://dataservice.accuweather.com/currentconditions/v1/${cityKey}`
    const config = {
      params: {
        apikey: apiKey
      }
    }
    axios.get(urlWeather, config)
      .then(res => setWeather(res.data[0]))
      .catch(err => {
        if(err.status){
          alert(err.data.Message)
        } else {
          alert('The allowed number of requests for the API has been exceeded today. Try again tomorrow.')
        }
      })
  }

return (
    <div className='Weather Info of the City'>

    <div className="city-form">
      <form onSubmit={(e) => getCityKey(e)}>
        <div className="form-group">
          <input type="text"
            className="form-control"
            placeholder="Enter the City Name"
            onChange={e => setCity(e.target.value)} />
        </div>
        <button className="button" type="submit">
          search
          </button>
       
      </form>
     
</div>
    {weather &&
      <WeatherNow icon={weather.WeatherIcon}
        text={weather.WeatherText}
        value={weather.Temperature.Metric.Value}
        isDayTime={weather.IsDayTime}
        city={localStorage.getItem("cityName")} >
      </WeatherNow>
    }
    
  </div>
)
}