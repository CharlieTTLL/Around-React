import React from 'react';
import { Tabs, Spin } from 'antd';
import { GEO_OPTIONS,POS_KEY,API_ROOT,AUTH_PREFIX,TOKEN_KEY } from '../constants';
import $ from 'jquery';
import { Gallery } from "./Gallery"
import { CreatePostButton } from "./CreatePostButton"
import { WrappedAroundMap } from "./AroundMap"

const TabPane = Tabs.TabPane;

export class Home extends React.Component {
    state = {
        loadingGeoLocation: false,
        loadingNearbyPosts: false,
        posts: [],
        error: '',
    };

    componentDidMount() {
        this.setState({loadingGeoLocation: true, error: ''});
        this.getGeoLocation();
    }

    getGeoLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                this.onSuccessLoadGeoLocation,
                this.onFailedLoadGeoLocation,
                GEO_OPTIONS,
            )
        } else {
            /* geolocation IS NOT available */
        }
    }

    onSuccessLoadGeoLocation = (position) => {
        this.setState({ loadingGeoLocation: false, error: '' });
        console.log(position);
        const { latitude, longitude } = position.coords;
        localStorage.setItem(POS_KEY, JSON.stringify({lat: latitude, lon: longitude}));
        this.loadNearbyPosts();
    }

    onFailedLoadGeoLocation = () => {
        this.setState({loadingGeoLocation: false, error: 'Failed to load geo location!'});
    }

    loadNearbyPosts = (position, radius) => {
        const { lat, lon } = position ? position :
            JSON.parse(localStorage.getItem(POS_KEY));
        const range = radius ? radius : 20;
        this.setState({ loadingNearbyPosts: true, error: '' });
        return $.ajax({
            url: `${API_ROOT}/search?lat=${lat}&lon=${lon}&range=${range}`,
            method: 'GET',
            headers: {
                Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`
            },
        }).then((response) => {
            this.setState({ posts: response, loadingNearbyPosts: false, error: ''});
            console.log(response);
        }, (error) => {
            this.setState({ loadingNearbyPosts: false, error: error.responseText});
            console.log(error);
        }).catch((error) => {
            console.log(error);
        })
    }

    getGalleryPanelContent = () => {
        if (this.state.error) {
            return <div>{this.state.error}</div>;
        } else if (this.state.loadingGeoLocation) {
            return <Spin tip="loading geolocation..."/>
        } else if (this.state.loadingNearbyPosts) {
            return <Spin tip="loading post..."/>
        } else if (this.state.posts && this.state.posts.length > 0) {
            const images = this.state.posts.map((post) => {
                return {
                    user: post.user,
                    src: post.url,
                    thumbnail: post.url,
                    thumbnailWidth: 400,
                    thumbnailHeight: 300,
                    caption: post.message,
                }
            });
            return <Gallery images={images}/>;
        } else {
            return null;
        }
    }

    render() {
        const createPostButton = <CreatePostButton loadNearbyPosts={this.loadNearbyPosts}/>;
        return (
                <Tabs tabBarExtraContent ={ createPostButton } className="main-tabs">
                    <TabPane tab="Tab 1" key="1">
                        {this.getGalleryPanelContent()}
                    </TabPane>
                    <TabPane tab="Tab 2" key="2">
                        <WrappedAroundMap
                            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places"
                            loadingElement={<div style={{ height: `100%` }} />}
                            containerElement={<div style={{ height: `400px` }} />}
                            mapElement={<div style={{ height: `100%` }} />}
                            loadNearbyPosts={this.loadNearbyPosts}
                            posts={this.state.posts}
                        />
                    </TabPane>
                </Tabs>
        );
    }
}
