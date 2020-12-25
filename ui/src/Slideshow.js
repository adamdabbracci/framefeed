import React from 'react';
import { CarouselProvider, Slider, Slide } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { getFeed } from './api';

const refreshInterval = 60000 // 12 hours
// refreshInterval = 1740000 // 29 minutes
// const refreshInterval = 15000
let refreshTimerInstance;

export class Slideshow extends React.Component {

    constructor() {
        super()
        this.state = {
            showFeed: false,
            feed: null,
            asSlideshow: false,
        }
    }

    componentDidMount() {
        // Run immediately
        setTimeout(() => {
          this.loadFeed()
        }, 100);
    
        // Clear existing timer
        if (refreshTimerInstance) {
            clearInterval(refreshTimerInstance)
        }
        // Start the timer
        refreshTimerInstance = setInterval(() => {
            this.loadFeed()
        }, refreshInterval)
      }


    loadFeed = async () => {
        const result = await getFeed(this.props.userId)
        this.setState({
            feed: result,
            userName: window.localStorage.getItem("userName"),
            userId: window.localStorage.getItem("userId"),
        })

        // End the feed if exiting fullscreen
        document.addEventListener("fullscreenchange", (e) => {
            if (!document.fullscreenElement) {
                this.setState({
                    showFeed: false
                })
            }
        });

        return
    }

    startSlideshow = (asSlideshow) => {
        this.setState({
          showFeed: true,
          asSlideshow,
        })
    
        setTimeout(() => {
          // https://gomakethings.com/going-full-screen-with-vanilla-js/
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            document.querySelector("#carousel").requestFullscreen();
          }
        })
      }

    render() {
        const { feed, showFeed, asSlideshow } = this.state

        if (!feed && !showFeed) {
            return (
                <div style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    margin: "10% auto",
                    display: "block",
                    textAlign: "center"
                }}>Loading, please wait :)</div>
            )
        }

        else if (feed && !showFeed) {
            return (
                <div style={{
                    textAlign: "center",
                    marginTop: "10%",
                    fontSize: "2rem"
                  }}>
                <button class="pure-button pure-button-primary" onClick={() => {
                    this.startSlideshow(true)
                }}>Start A Slideshow</button>

                <button class="pure-button pure-button-primary" style={{
                    marginLeft: "10px",
                }} onClick={() => {
                    this.startSlideshow(false)
                }}>Flip Through Photos</button>
                  </div>
                
            )
        }


        else if (feed && showFeed) {
            return (
                <CarouselProvider
                    naturalSlideHeight={window.innerHeight}
                    naturalSlideWidth={window.innerWidth}
                    totalSlides={feed.length}
                    infinite={true}
                    dragEnabled={!asSlideshow}
                    touchEnabled={!asSlideshow}
                    isPlaying={asSlideshow}
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
        else {
            return (
                <div>Show: {showFeed} Feed: {feed} </div>
            )
        }

    }
}
