import React from 'react';
import { Tabs, Button, Spin } from 'antd';
import { GEO_OPTIONS } from '../constants';

const TabPane = Tabs.TabPane;

const operations = <Button type="primary">Create New Posts</Button>;
export class Home extends React.Component {
    state = {
        loadingGeoLocation: false,
    };
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

    componentDidMount() {
        this.setState({loadingGeoLocation: true});
        this.getGeoLocation();
    }

    onSuccessLoadGeoLocation = (position) => {
        this.setState({loadingGeoLocation: false});
        console.log(position);
    }

    onFailedLoadGeoLocation = (error) => {
        this.setState({loadingGeoLocation: false});
        console.log(error);
    }
    render() {
        return (
                <Tabs tabBarExtraContent={operations} className="main-tabs">
                    <TabPane tab="Tab 1" key="1">{this.state.loadingGeoLocation} ? <Spin tip="loading geolocation..."/> : null</TabPane>
                    <TabPane tab="Tab 2" key="2">Content of tab 2</TabPane>
                </Tabs>
        );
    }
}