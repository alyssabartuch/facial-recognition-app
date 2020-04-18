import React, {Component } from 'react';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';

const particlesOptions = {
  "particles":{
     "number":{
        "value":120,
        "density":{
           "enable":true,
           "value_area":800
        }
     },
     "color":{
        "value":"#fff"
     },
     "shape":{
        "type":"polygon",
        "stroke":{
           "width":0,
           "color":"#fff"
        },
        "polygon":{
           "nb_sides":8
        },
        "image":{
           "src":"img/github.svg",
           "width":100,
           "height":100
        }
     },
     "opacity":{
        "value":0.8,
        "random":false,
        "anim":{
           "enable":false,
           "speed":1,
           "opacity_min":0.1,
           "sync":false
        }
     },
     "size":{
        "value":2,
        "random":true,
        "anim":{
           "enable":false,
           "speed":40,
           "size_min":0.1,
           "sync":false
        }
     },
     "line_linked":{
        "enable":true,
        "distance":150,
        "color":"#fff",
        "opacity":0.8443879765465317,
        "width":1
     },
     "move":{
        "enable":true,
        "speed":2,
        "direction":"none",
        "random":false,
        "straight":false,
        "out_mode":"out",
        "bounce":false,
        "attract":{
           "enable":false,
           "rotateX":600,
           "rotateY":1200
        }
     }
  },
  "interactivity":{
     "detect_on":"canvas",
     "events":{
        "onhover":{
           "enable":true,
           "mode":"repulse"
        },
        "onclick":{
           "enable":true,
           "mode":"push"
        },
        "resize":true
     },
     "modes":{
        "grab":{
           "distance":400,
           "line_linked":{
              "opacity":1
           }
        },
        "bubble":{
           "distance":400,
           "size":40,
           "duration":2,
           "opacity":8,
           "speed":3
        },
        "repulse":{
           "distance":200,
           "duration":0.4
        },
        "push":{
           "particles_nb":4
        },
        "remove":{
           "particles_nb":2
        }
     }
  },
  "retina_detect":true
}

// const particlesOptionsSimple = {
//   particles: {
//     number: {
//       value: 30,
//       density: {
//         enable: true,
//         value_area: 800
//       }
//     }
//   }
// }

const app = new Clarifai.App({
   apiKey: '305c04463cbd4dd8b16216ae7e8c79de'
  });

class App extends Component {
   constructor() {
      super()
      this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
      //https://i2-prod.mirror.co.uk/incoming/article14334083.ece/ALTERNATES/s615/3_Beautiful-girl-with-a-gentle-smile.jpg
      }
   }

   calculateFaceLocation = (data) => {
      const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
      const image = document.getElementById('input-image');
      const width = Number(image.width);
      const height = Number(image.height);
      console.log(width,height);
      return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
      }
   }

   displayFaceBox = (box) => {
      this.setState({ box: box})
   }

   onInputchange = (event) => {
      this.setState({ input: event.target.value })
   }

   onInputSubmit = () => {
      this.setState({ imageUrl: this.state.input })

      app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log('Bad Request. Please check your link or try a differnt one.',err))  
   }

   onRouteChange = (route) => {
      if (route === 'signout') {
         this.setState({ isSignedIn: false })
      } else if (route === 'home') {
         this.setState({ isSignedIn: true })
      } 
      this.setState({route: route})
   }

   render() {
      const { imageUrl, box, route, isSignedIn } = this.state;

      return (
         <div className="App">
            <Particles 
               className="particles"
               params={particlesOptions} />
            <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
            { route === 'home'
               ? <div>
                  <Logo />
                  <Rank />
                  <ImageLinkForm onInputChange={this.onInputchange} onSubmit={this.onInputSubmit}/>
                  <FaceRecognition imageUrl={imageUrl} box={box} />
               </div> 
               : (
                  route === 'signin' || route === 'signout'
                     ? <SignIn onRouteChange={this.onRouteChange} /> 
                     : <Register onRouteChange={this.onRouteChange} />
               )
            }
         </div>
      );
   }
}

export default App;
