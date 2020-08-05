import React from 'react';
import {
    View,
    ScrollView
} from 'react-native';
import RequestsList from '../components/List';

export default function RequesterActiveRequests(props) {

    return (
        <View style={{ flex: 1, backgroundColor: "#f4f4fb" }}>
            <ScrollView>
                <RequestsList status="active" />
            </ScrollView>
        </View>
    );
}