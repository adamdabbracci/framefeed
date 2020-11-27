import React from 'react';
import { CarouselProvider, Slider, Slide } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { getFeed } from "./api";
import NoSleep from 'nosleep.js';

export class Slideshow extends React.Component {

    constructor() {
        super() 
        this.state = {
            showFeed: false
        }
    }
    
    noSleep = new NoSleep();

    componentDidMount() {
        document.addEventListener("fullscreenchange", (e) => {
            if (!document.fullscreenElement) {
                this.setState({
                    showFeed: false
                })
                this.noSleep.disable();
              }
        });
    }

    goFullscreen = () => {
        const el = document.getElementById('carousel')
        window.scrollTo(0,document.body.scrollHeight);
        this.noSleep.enable();
        // el.requestFullscreen()
        // .catch((ex) => {
        //     // dont do anything, just fail
        // })
    }

    startSlideshow = () => {
        this.setState({
            showFeed: true
        })

        setTimeout(() => {
            this.goFullscreen()
        }, 0)
    }

  render() {
    const { showFeed } = this.state
    const { feed } = this.props

    if (!feed) {
        return (
            <div>Loading...</div>
        )
    }

    if (feed.length === 0) {
        return (
            <h1>No feed items :(</h1>
        )
    } 

    if (feed) {
        return (
            <div>
                { !showFeed && (
                    <button className={"pure-button"} style={{
                        fontSize: "1.2  rem",
                        margin: "10% auto",
                        display: "block"
                    }} onClick={() => {
                        this.startSlideshow()
                    }}>START SLIDESHOW</button>
                )}

                {
                    showFeed && (
                        <CarouselProvider
                            naturalSlideHeight={window.innerHeight}
                            naturalSlideWidth={window.innerWidth}
                            totalSlides={feed.length}
                            infinite={true}
                            isPlaying={true}
                            interval={15000}
                            id="carousel"
                        >
                        <Slider >
                            {
                                // feed.map((item, index) => {
                                //     return (
                                //         <Image index={index} key={`item-${index}`} src={item.url} style={{
                                //             backgroundSize: 'contain'
                                //         }}>
                                //         </Image>
                                //     )
                                // })
                                feed.map((item, index) => {
                                    return (
                                        <Slide index={index} key={`item-${index}`} style={{
                                            background: `no-repeat url("${item.url}")`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center center',
                                            height: "100vh",
                                            width: "100vw",
                                        }}>
                                            {/* <img src={item.url} style={{
                                                height: "100%",
                                                margin: "0 auto",
                                                display: "block",
                                                
                                            }}/> */}
                                            <div key={`caption-${index}`} style={{
                                                
                                                position: "relative",
                                                padding: "10px",
                                                top: "80%",
                                                left: 0,
                                                color: "white",
                                                backgroundColor: "rgb(40, 44, 52)",
                                                zIndex: 10,
                                                float: "left",
                                                marginLeft: "25%",
                                                width: "50%",
                                                maxWidth: "80%",
                                                textAlign: "center"
                                            }}>
                                                <span style={{
                                                    fontSize: "2em",
                                                    fontWeight: "900",
                                                }}>
                                                    {item.caption}
                                                </span>
                                                <br />
                                                From {item.uploader}
                                            </div>
                                            
                                            {/* <img src={item.url} style={{
                                                height: "100vh",
                                                width: "100vw",
                                            }}></img> */}
                                            
                                        </Slide>
                                    )
                                })
                            }
                        </Slider>

                        </CarouselProvider>
                    )
                }
            </div>
           
        )
    }
    
  }
}
