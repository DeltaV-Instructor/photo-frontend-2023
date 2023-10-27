import React from "react";
import "./App.css";
import { Button, Carousel, Container, Form } from "react-bootstrap";
import axios from "axios";
import Weather from './Weather';

let VITE_APP_SERVER = import.meta.env.VITE_APP_SERVER;
console.log(VITE_APP_SERVER);
let API_KEY = import.meta.env.VITE_API_KEY_LOCATIONIQ;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: "",
      photoData: [],
      showImages: false,
      lat: '',
      lon: '',
      locationName: '',
      weather: '',
      showWeather: false
    };
  }

  handleInput = (event) => {
    this.setState({
      searchQuery: event.target.value,
    });
  };

  getPhotos = async (event) => {
    event.preventDefault();
    try {
      let serverResults = await axios.get(`${VITE_APP_SERVER}/photos?searchQuery=${this.state.searchQuery}`);
      console.log('back from our server pics?',serverResults.data);
      this.setState({
        photoData: serverResults.data,
        showImages: true,
        photoError: false,
        photoErrorMessage: "",
      });
    } catch (error) {
      this.setState({
        photoError: true,
        photoErrorMessage: `A Photo Error Occurred: ${error.response.status}, ${error.response.data}`,
      });
    }
  };

//add a helper function to take in input for our city search and we will update state
// handle the input for the city to update state before we Submit
handleCityInput = (event) => {
  console.log(event.target. value);
  //update state
  this.setState({
    cityName: event.target.value,
  });
};

//call our to the location iq api to get the lat and lon for our weather. 
//set that data in state and use that data to pass to our weather helper function that will call our server that will then actually call the weather api. 
//handle the city search to out api using the data from state collected from the form.
handleCityFormSubmit = async (event) => {
  event.preventDefault();
  console.log("state name?", this.state.cityName);
  //we are going to call the api with the data from state.
  //base url    "?"  and we need the key and we need the city to search. specify the type data json.
  let URL = `http://us1.locationiq.com/v1/search?key=${API_KEY}&q=${this.state.cityName}&format=json`;
  // console.log(URL);
  let cityInfo = await axios.get(URL);
  console.log(cityInfo);
  console.log("city info: ", cityInfo.data[0]);

  // you will update this.state.cityName
  this.setState({
    locationName: cityInfo.data[0].display_name,
    lat: cityInfo.data[0].lat,
    lon: cityInfo.data[0].lon,
  });
  this.displayWeather(cityInfo.data[0].lat, cityInfo.data[0].lon, cityInfo.data[0].display_name);
};



displayWeather = async (lat, lon, locationName) => {
  console.log(lat,lon,locationName,'TV');

  try {
    const weather = await axios.get(`${VITE_APP_SERVER}/weather`, {params: {lat: lat, lon: lon, locationName: locationName}});
    console.log('weather from the server which is from our api.',weather);
    this.setState({
      weather: weather.data,
      showWeather: true
    })
  } catch (error) {
    console.log(error);
  }
}






















  render() {
    console.log(this.state.weather);
    let carouselItems = this.state.photoData.map((picture, index) => (
      <Carousel.Item key={index}>
        <img className="d-block w-100" src={picture.src} alt={picture.alt} />
        <Carousel.Caption>
          <h3
            style={{
              backgroundColor: "teal",
              borderRadius: "5px",
              width: "max-content",
              margin: "auto",
              padding: "5px",
            }}
          >
            Photo by: {picture.artist}
          </h3>
        </Carousel.Caption>
      </Carousel.Item>
    ));

    return (
      <>
        <h1>Image Finder</h1>
        <Container>
          <Form
            onSubmit={this.getPhotos}
            style={{ width: "max-content", margin: "auto" }}
          >
            <Form.Group controlId="searchQuery">
              <Form.Label>What do you want to see?</Form.Label>
              <Form.Control type="text" onInput={this.handleInput} />
            </Form.Group>
            <Button type="submit">Find Photos</Button>
          </Form>
        </Container>
        {this.state.showImages && (
          <Container>
            <Carousel>{carouselItems}</Carousel>
          </Container>
        )}


           {/* 1.  Add a form to take in a city  */}
           <form onSubmit={this.handleCityFormSubmit}>
          <label>
            Pick a City:
            <input type="text" onChange={this.handleCityInput} />
          </label>
          <button type="submit"> Get City Data</button>
        </form>
          {/* lastly we need to render the weather Component  */}
          {
            this.state.showWeather &&
            <Weather weather={this.state.weather} />
          }
         



      </>
    );
  }
}

export default App;
