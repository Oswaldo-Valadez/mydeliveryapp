import React from 'react';
import {
    View,
    ScrollView
} from 'react-native';
import RequestsList from '../components/RequestsList';

export default function RequesterCompleteRequests(props) {

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <RequestsList />
            </ScrollView>
        </View>
    );
}