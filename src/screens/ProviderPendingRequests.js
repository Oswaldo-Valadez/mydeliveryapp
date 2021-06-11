import React, { useEffect, useState, useContext } from 'react';

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

import MyModal from '../components/MyModal';

import { MaterialIcons } from '@expo/vector-icons';

import { AuthContext } from '../common/context';

export default function ProviderPendingRequests(props) {

    const { myModalVisibility, useMyModal } = useContext(AuthContext);

    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const refRequests = firebase.database().ref('requests');
        refRequests.on('value', data => {
            const allRequests = [];
            const ref_request = data.val();
            for (let key in ref_request) {
                ref_request[key].key = key;
                if (ref_request[key].waiting_providers_list) {
                    ref_request[key].waiting_providers_list.map((data) => {
                        if (data === firebase.auth().currentUser.uid) {
                            allRequests.push(ref_request[key]);
                        }
                    });
                }
            }
            setRequests(allRequests);
        });
    }, []);

    const list = List({ navigation: props.navigation, requests: requests, makeQuestion: true });

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
            {
                <MyModal
                    isVisible={myModalVisibility}
                    onRequestClose={() => useMyModal(false)}
                    headerCaption=""
                    action={() => {
                        useMyModal(false);
                        props.navigation.navigate('ProviderMakePaymentScreen');
                    }}
                    actionCaption={I18n.t('subscribe_now')}
                >
                    <Text style={styles.unavailable}>{I18n.t('buy_subscription')}</Text>
                    <MaterialIcons name="card-membership" color={colors.PRIMARY_COLOR} size={64}
                        style={{ margin: 18 }}
                    />
                    <Text style={styles.unavailable}>{I18n.t('slider_provider_text_three')}</Text>
                </MyModal>
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
    },
    unavailable: {
        color: colors.TRANSPARENCY.BLACK.medium,
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
});