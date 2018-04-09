import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps';
import {AroundMarker} from "./AroundMarker"
import { POS_KEY } from '../constants'

class AroundMap extends React.Component {
    reloadMarker = () => {
        const center = this.map.getCenter();
        const position = {lat: center.lat(), lon: center.lng()};
        this.props.loadNearbyPosts(position, this.getRange());
    }
    getRange = () => {
        const google = window.google;
        const center = this.map.getCenter();
        const bounds = this.map.getBounds();
        if (center && bounds) {
            const ne = bounds.getNorthEast();
            const right = new google.maps.LatLng(center.lat(), ne.lng());
            return 0.000621371192 * google.maps.geometry.spherical.computeDistanceBetween(center, right);
        }
    }
    getRef = (map) => {
        this.map = map;
        window.thismap = map;
    }
    render() {
        const pos = JSON.parse(localStorage.getItem(POS_KEY));
        return(
            <div>
                <GoogleMap
                    onDragEnd={this.reloadMarker}
                    onZoomChanged={this.reloadMarker}
                    defaultZoom={11}
                    defaultCenter={{ lat: pos.lat, lng: pos.lon }}
                    defaultOptions={{ scaleControl: true }}
                    ref={this.getRef}
                >
                    {this.props.posts ? this.props.posts.map((pos) =>
                        <AroundMarker
                            key={`${pos.lat}-${pos.user}-${pos.url}`}
                            post={pos}
                        />) : null }
                </GoogleMap>
            </div>
        );
    }
}

export const WrappedAroundMap = withScriptjs(withGoogleMap(AroundMap));