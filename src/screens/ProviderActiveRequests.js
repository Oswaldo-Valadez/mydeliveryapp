import React, { useEffect, useState } from 'react';

import {
    View,
    ScrollView,
    Text,
    StyleSheet
} from 'react-native';
import List from '../components/List';
import { colors } from '../common/theme';
import * as Icon from '@expo/vector-icons';
import I18n from '../common/lang/config';

import * as firebase from 'firebase';

export default function ProviderActiveRequests(props) {

    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const refRequests = firebase.database().ref('requests');
        refRequests.on('value', data => {
            const allRequests = [];
            const ref_request = data.val();
            for (let key in ref_request) {
                ref_request[key].key = key;
                if (ref_request[key].provider_uid == firebase.auth().currentUser.uid && ref_request[key].status === 'active')
                    allRequests.push(ref_request[key]);
            }
            setRequests(allRequests);
        });
    }, []);

    const list = List({ navigation: props.navigation, requests: requests });

    return (
        <View style={styles.container}>
            {
                list ?
                    <ScrollView>
                        {list}
                    </ScrollView>
                    :
                    <View style={styles.noItemsContainer} >
                        <Icon.MaterialCommunityIcons name="package-variant-closed" size={128} color={colors.TRANSPARENCY.BLACK.small} />
                        <Text style={styles.noItemsText}>{I18n.t('no_requests_found')}</Text>
                    </View>
            }
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE.background
    },
    noItemsText: {
        color: colors.TRANSPARENCY.BLACK.small,
        fontSize: 24,
        fontWeight: 'bold',
    },
    noItemsContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});