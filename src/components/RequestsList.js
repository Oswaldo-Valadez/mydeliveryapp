import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
    AsyncStorage,
    Dimensions
} from 'react-native';
import { Surface } from 'react-native-paper';
import { colors } from '../common/theme';
import I18n from '../common/lang/config';
import * as firebase from 'firebase';

const { height } = Dimensions.get('window');

const ListItem = (props) => {
    return (
        <Surface style={styles.container}>
            <TouchableOpacity style={{ width: '100%', height: '100%' }}>
                <View>
                    <Text style={styles.code}>{I18n.t('request')} #{props.itemData.request_id}</Text>
                    <Text style={styles.date}>{I18n.t('date')}: {props.itemData.start_date}</Text>
                </View>
                <View>
                    <Text style={styles.vehicleType}>{I18n.t('vehicle_type')}: {props.itemData.type}</Text>
                </View>
                <View>
                    <Text style={{ justifyContent: 'center', fontWeight: '100' }}>{I18n.t('pick_up_place')}: </Text>
                    <Text style={{ justifyContent: 'center', fontWeight: '100' }}>{I18n.t('delivery_place')}: </Text>
                </View>
            </TouchableOpacity>
        </Surface>
    );
}

export default class RequestsList extends React.Component {
    state = {
        allRequests: [],
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const uid = firebase.auth().currentUser.uid;
        const refRequests = firebase.database().ref('users/' + uid + '/my_requests');
        refRequests.on('value', data => {
            const allRequests = [];
            const requests = data.val();
            for (let key in requests) {
                requests[key].bookingUid = key;
                console.log(requests[key]);
                allRequests.push(
                    <ListItem itemData={requests[key]} />
                );
            }
            this.setState({
                allRequests: allRequests
            });
        });
    }

    render() {
        return this.state.allRequests;
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '96%',
        height: height * 0.3,
        alignSelf: 'center',
        marginVertical: 6,
        padding: 10,
        elevation: 4,
        borderRadius: 10,
    },
    date: {
        fontWeight: 'bold',
        fontSize: 16,
        alignSelf: 'flex-end',
    },
    code: {
        fontWeight: 'bold',
        fontSize: 18,
        color: colors.PRIMARY_COLOR,
    },
    vehicleType: {
        fontWeight: 'bold',
        fontSize: 14,
        alignSelf: 'flex-start',
    }
});