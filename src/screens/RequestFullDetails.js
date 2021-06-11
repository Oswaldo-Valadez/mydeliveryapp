import React, { useEffect, useState, useContext } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Text,
    Platform,
    Linking,
} from 'react-native';

import ServiceTypes from '../components/ServiceTypes';
import { colors } from '../common/theme';
import * as firebase from 'firebase';
import I18n from '../common/lang/config';
import * as Icon from '@expo/vector-icons';
import { Surface } from 'react-native-paper';

import Moment from 'moment/min/moment-with-locales';

import { AuthContext } from '../common/context';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function RequestFullDetails(props) {

    useEffect(() => {
        Moment.locale(I18n.locale);
    });

    const { usertype } = useContext(AuthContext);

    const [requestData, setRequestData] = useState({
        key: '',
        delivery_point: {
            text: '',
        },
        pickup_point: {
            text: '',
        },
        creation_date: '',
        date: '',
        time: '',
        notes: '',
        services: {
            bus: false,
            car: false,
            pickup: false,
            truck: false,
        },
        status: '',
        requester_uid: '',
        provider_uid: '',
    });

    const [provider, setProvider] = useState({
        full_name: '',
        phone: '',
        uid: '',
    });

    const [requester, setRequester] = useState({
        full_name: '',
        phone: '',
        uid: '',
    });

    useEffect(() => {
        const params = props.route.params;
        const request = firebase.database().ref('requests/' + params.key);

        request.once('value', data => {
            if (data.val()) {
                const request_data = data.val();

                setRequestData({
                    key: params.key,
                    delivery_point: {
                        text: request_data.delivery_point.text
                    },
                    pickup_point: {
                        text: request_data.pickup_point.text
                    },
                    creation_date: request_data.creation_date,
                    date: request_data.date,
                    time: request_data.time,
                    notes: request_data.notes,
                    services: {
                        bus: request_data.services.bus,
                        car: request_data.services.car,
                        pickup: request_data.services.pickup,
                        truck: request_data.services.truck,
                    },
                    status: request_data.satus,
                    provider_uid: request_data.provider_uid,
                    requester_uid: request_data.requester_uid,
                });
            }
        }).then((response) => {
            const responseJSON = response.toJSON();

            const requester = firebase.database().ref('users/' + responseJSON.requester_uid);

            requester.on('value', data => {
                if (data.val()) {
                    const requester_data = data.val();

                    setRequester({
                        full_name: requester_data.full_name,
                        phone: requester_data.phone,
                        uid: responseJSON.requester_uid,
                    });
                }
            });

            if (responseJSON.provider_uid) {
                const provider = firebase.database().ref('users/' + responseJSON.provider_uid);

                provider.on('value', data => {
                    if (data.val()) {
                        const provider_data = data.val();

                        setProvider({
                            full_name: provider_data.full_name,
                            phone: provider_data.phone,
                            uid: responseJSON.provider_uid,
                        });
                    }
                });
            }
        }).catch((err) => console.log(err))

    }, []);

    const sendOnWhatsApp = (phone, msg) => {

        const url = 'whatsapp://send?text=' + msg + '&phone=' + phone;
        Linking.openURL(url).then((data) => {
            console.log('WhatsApp Opened');
        }).catch(() => {
            console.log('Make sure Whatsapp installed on your device');
        });
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.WHITE.background }}>
            <ScrollView>

                <Text style={styles.top_title}>#{requestData.key}</Text>

                <Surface style={styles.surface}>
                    <Text style={styles.title}>
                        {
                            usertype == 'provider' ?
                                I18n.t('requester') : I18n.t('provider')
                        }
                    </Text>
                    <View>
                        <View style={styles.action}>
                            <View style={[{ flex: 1, justifyContent: 'center' }]}>
                                <Icon.FontAwesome name="user-circle" size={48} color={colors.TRANSPARENCY.BLACK.medium} />
                            </View>
                            {
                                usertype == 'provider' ?
                                    <View style={[{ flex: 3, flexDirection: 'column' }]}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ flex: 1, textAlignVertical: 'center' }}>{requester.full_name}</Text>
                                        </View>
                                        <TouchableOpacity style={[styles.action, { borderBottomWidth: 1, borderWidth: 0, paddingVertical: 6 }]}
                                            onPress={() => {
                                                sendOnWhatsApp(requester.phone, I18n.t('whatsapp_provider_message') + requestData.key)
                                            }}
                                        >
                                            <Text style={{ flex: 1, textAlignVertical: 'center', fontWeight: 'bold' }}>{requester.phone}</Text>
                                            <Icon.MaterialCommunityIcons style={{ marginLeft: 8 }} name="whatsapp" color={colors.PRIMARY_COLOR} size={20} />
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    provider.uid == '' ?
                                        <View style={[{ flex: 3, flexDirection: 'column' }]}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ flex: 1, textAlignVertical: 'center', fontWeight: 'bold' }}>{I18n.t('no_provider_has_been_assigned')}</Text>
                                            </View>
                                        </View>
                                        :
                                        <View style={[{ flex: 3, flexDirection: 'column' }]}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ flex: 1, textAlignVertical: 'center' }}>{provider.full_name}</Text>
                                            </View>
                                            <TouchableOpacity style={[styles.action, { borderBottomWidth: 1, borderWidth: 0, paddingVertical: 6 }]}
                                                onPress={() => {
                                                    sendOnWhatsApp(provider.phone, I18n.t('whatsapp_requester_message') + requestData.key)
                                                }}
                                            >
                                                <Text style={{ flex: 1, textAlignVertical: 'center', fontWeight: 'bold' }}>{provider.phone}</Text>
                                                <Icon.MaterialCommunityIcons style={{ marginLeft: 8 }} name="whatsapp" color={colors.PRIMARY_COLOR} size={20} />
                                            </TouchableOpacity>
                                        </View>
                            }
                        </View>
                    </View>
                </Surface>

                <Surface style={styles.surface}>
                    <Text style={styles.title}>{I18n.t("creation_date_and_time")}</Text>
                    <View style={styles.action}>
                        <Text style={styles.inputText}>{Moment(requestData.date).format("LLLL")}</Text>
                        <Icon.MaterialCommunityIcons style={{ marginLeft: 8 }} name="calendar-month" color={colors.PRIMARY_COLOR} size={20} />
                    </View>
                </Surface>

                <Surface style={styles.surface}>
                    <Text style={styles.title}>{I18n.t('addresses')}</Text>

                    <Text style={styles.sub_title}>{I18n.t('pickup_address')}</Text>
                    <View style={styles.action}>
                        <Text style={styles.inputText}>{requestData.pickup_point.text}</Text>
                        <Icon.MaterialIcons style={{ marginLeft: 8 }} name="location-searching" color={colors.PRIMARY_COLOR} size={20} />
                    </View>

                    <Text style={styles.sub_title}>{I18n.t('delivery_address')}</Text>
                    <View style={styles.action}>
                        <Text style={styles.inputText}>{requestData.delivery_point.text}</Text>
                        <Icon.MaterialIcons style={{ marginLeft: 8 }} name="gps-fixed" color={colors.PRIMARY_COLOR} size={20} />
                    </View>
                </Surface>

                <Surface style={styles.surface}>
                    <Text style={styles.title}>{I18n.t("date_and_time")}</Text>
                    <View style={styles.action}>
                        <Text style={styles.inputText}>{Moment(requestData.date).format("LL")}</Text>
                        <Icon.MaterialCommunityIcons style={{ marginLeft: 8 }} name="calendar-month" color={colors.PRIMARY_COLOR} size={20} />
                    </View>

                    <View style={styles.action}>
                        <Text style={styles.inputText}>{Moment(requestData.time).format("LT")}</Text>
                        <Icon.MaterialCommunityIcons style={{ marginLeft: 8 }} name="clock" color={colors.PRIMARY_COLOR} size={20} />
                    </View>
                </Surface>

                <Surface style={styles.surface}>
                    <Text style={styles.title}>{I18n.t('service_type')}</Text>
                    <ServiceTypes services={requestData.services} />
                </Surface>

                <Surface style={[styles.surface, { marginBottom: 24 }]}>
                    <Text style={styles.title}>{I18n.t('notes')}</Text>
                    <View style={styles.action}>
                        <Text style={[styles.inputText, { textAlignVertical: 'top' }, requestData.notes == '' ? { color: colors.RED } : null]}>
                            {
                                requestData.notes == '' ?
                                    I18n.t('no_notes')
                                    :
                                    requestData.notes
                            }
                        </Text>
                    </View>
                </Surface>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    surface: {
        width: '100%',
        alignSelf: 'center',
        marginVertical: 6,
        padding: 12,
        elevation: 1,
        borderRadius: 0,
        overflow: "visible",
        backgroundColor: colors.WHITE.default
    },
    title: {
        marginLeft: 4,
        fontWeight: 'bold',
        fontSize: 18,
    },
    top_title: {
        color: colors.PRIMARY_COLOR,
        margin: 20,
        fontWeight: 'bold',
        fontSize: 24,
    },
    sub_title: {
        marginLeft: 8,
        color: colors.TRANSPARENCY.BLACK.medium
    },
    inputText: {
        flex: 9
    },
    action: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: colors.TRANSPARENCY.BLACK.small,
        padding: 14,
        borderRadius: 8,
        marginVertical: 6,
    },
});