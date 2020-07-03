import React from 'react';
import {
    View,
    Text,
    ScrollView
} from 'react-native';
import RequestListItem from '../components/RequestsList';

export default function RequesterActiveRequests() {

    let payments = [];

    for (let i = 0; i < 10; i++) {
        payments.push(
            <RequestListItem id={i} />
        )
    }

    return (
        <ScrollView>
            {payments}
        </ScrollView>
    );
}