import React from 'react';
import {
    View,
    Text
} from 'react-native';

export default class ProviderActiveRequests extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (

            <View>
                <Text>Active Requests</Text>
            </View>

        );
    }
}