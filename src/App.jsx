import React from "react";
import "./App.css";
import { Button, Carousel, Container, Form } from "react-bootstrap";
import axios from "axios";

let VITE_APP_SERVER = import.meta.env.VITE_APP_SERVER;
console.log(VITE_APP_SERVER);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: "",
      photoData: [],
      showImages: false
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

  render() {
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
      </>
    );
  }
}

export default App;
