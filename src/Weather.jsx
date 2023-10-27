import React from 'react'

 class Weather extends React.Component {


  render() {
    console.log('did we get weather',this.props.weather);
    return (
      this.props.weather.map((day, index) => (
        <div key={index}>
          <p>day: {day.time}</p>
          <p>description: {day.forecast}</p>
        </div>
      ))
    )
  }
}
export default Weather;