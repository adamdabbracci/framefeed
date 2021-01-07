import React from 'react';
import { removeFeedItem, getFeed } from './api';

export class ManageFeed extends React.Component {

    constructor() {
        super()
        this.state = {
            feed: [],
            showDeleteFor: null
        }
    }
    componentDidMount() {
        this.loadFeed()
    }

    loadFeed = async () => {
        const feed = await getFeed(this.props.userId)
        console.log(feed)
        this.setState({
            feed,
            showDeleteFor: null
        })
    }

    removeItem = async (path) => {
        await removeFeedItem(this.props.userId, path)
        this.loadFeed()
    }

    render() {
        const { feed, showDeleteFor } = this.state
        return (
            <div class="pure-g">
                    {
                    feed.map((feedItem, index) => {
                        return (
                            <div class="pure-u-1-4" onClick={() => {
                                this.setState({
                                    showDeleteFor: index
                                })
                            }}>
                                
                                {
                                    showDeleteFor === index && (
                                        <a class="pure-button pure-button-error" style={{
                                            margin: "20% auto",
                                            display: "block",
                                            width: "80%",
                                            color: "red"
                                        }} onClick={() => {
                                            this.removeItem(feedItem.path)
                                        }}>Delete This Photo</a>
                                    )
                                }
                                {
                                    showDeleteFor !== index && (
                                        <img src={feedItem.url} style={{
                                            maxWidth: "100%"
                                        }}></img>
                                    )
                                }
                            </div>
                        )
                    })
                }
                </div>
        )
    }
}