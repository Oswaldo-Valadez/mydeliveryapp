import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Dimensions,
    Text,
    TouchableOpacity,
    Platform,
    TextInput,
    ActivityIndicator,
} from 'react-native';

import ServiceTypes from '../components/ServiceTypes';

import DateTimePicker from '@react-native-community/datetimepicker';

import { colors } from '../common/theme';

import * as firebase from 'firebase';
import I18n from '../common/lang/config';

import MButton from '../components/MaterialButton';

import * as Icon from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

import { Surface } from 'react-native-paper';

import Moment from 'moment/min/moment-with-locales';

import RequestPushMsg from '../common/RequestPushMsg';

import MyModal from '../components/MyModal';

function getProviders(services, providersList) {
    const waiting_providers_list = [];
    const pushToken_list = [];

    providersList.map((provider) => {
        if (
            (provider.services.car && services.car) ||
            (provider.services.bus && services.bus) ||
            (provider.services.pickup && services.pickup) ||
            (provider.services.truck && services.truck)
        ) {
            waiting_providers_list.push(provider.key);
            pushToken_list.push(provider.pushToken);
        }
    })

    return waiting_providers_list.length != 0 ? { waiting_providers_list: waiting_providers_list, pushToken_list: pushToken_list } : { waiting_providers_list: null, pushToken_list: null };
}

export default function RequesterMakeRequest({ navigation, route }) {


    useEffect(() => {
        Moment.locale(I18n.locale);
    });

    useEffect(() => {
        if (route.params?.deliverPoint && route.params?.pickupPoint) {
            const { deliverPoint, pickupPoint } = route.params;
            setRequestData({
                ...requestData,
                deliver_text: deliverPoint.text,
                deliver_latitude: deliverPoint.latitude,
                deliver_longitude: deliverPoint.longitude,
                pickup_text: pickupPoint.text,
                pickup_latitude: pickupPoint.latitude,
                pickup_longitude: pickupPoint.longitude
            });
        }
    }, [route.params?.deliverPoint, route.params?.pickupPoint]);

    useEffect(() => {
        const listAllProviders = [];
        const refProviders = firebase.database().ref('users');

        refProviders.on('value', data => {
            if (data.val()) {
                const allProviders = data.val();
                for (let key in allProviders) {
                    if (allProviders[key].usertype == 'provider' && allProviders[key].approved) {
                        allProviders[key].key = key;
                        listAllProviders.push(allProviders[key]);
                    }
                }
            }
        });

        setProvidersList(listAllProviders);
    }, []);

    const [providersList, setProvidersList] = useState([]);

    const [checkOnMakeRequest, setCheckOnMakeRequest] = useState(false);

    const [requestData, setRequestData] = useState({
        deliver_text: "",
        deliver_latitude: 9.061460,
        deliver_longitude: 7.500640,
        pickup_text: "",
        pickup_latitude: 9.061460,
        pickup_longitude: 7.500640,
        date: new Date(),
        time: new Date(),
        notes: ''
    });

    const [services, setServices] = useState({
        car: false,
        bus: false,
        pickup: false,
        truck: false
    });

    const [showDatetimePicker, setShowDatetimePicker] = useState({
        date: false,
        time: false
    });

    const [myModalVisibility, setMyModalVisibility] = useState({
        noProvidersModal: false,
        requestSendedModal: false,
        preparingRequestModal: false,
    });

    const handleMakeRequest = () => {

        setMyModalVisibility({ ...myModalVisibility, preparingRequestModal: true });

        setTimeout(() => {
            const { waiting_providers_list, pushToken_list } = getProviders(services, providersList);

            if (waiting_providers_list) {
                const data = {
                    services: services,
                    delivery_point: {
                        latitude: requestData.deliver_latitude,
                        longitude: requestData.deliver_longitude,
                        text: requestData.deliver_text,
                    },
                    pickup_point: {
                        latitude: requestData.pickup_latitude,
                        longitude: requestData.pickup_longitude,
                        text: requestData.pickup_text,
                    },
                    date: requestData.date.toString(),
                    time: requestData.time.toString(),
                    notes: requestData.notes,
                    creation_date: new Date().toString(),
                    status: 'active',
                    requester_uid: firebase.auth().currentUser.uid,
                    waiting_providers_list: waiting_providers_list,
                }

                const msg = I18n.t('you_have_a_new_request');

                RequestPushMsg(pushToken_list ? pushToken_list : null, msg);

                firebase.database().ref('requests/').push(data);

                setMyModalVisibility({ ...myModalVisibility, requestSendedModal: true });
            } else {
                setMyModalVisibility({ ...myModalVisibility, noProvidersModal: true });
            }
        }, 3000);

    }

    const onChangeDate = (event, selectedDate) => {
        const date = selectedDate || requestData.date;
        setShowDatetimePicker({ ...showDatetimePicker, date: !showDatetimePicker.date });
        setRequestData({ ...requestData, date: date });
    };

    const onChangeTime = (event, selectedTime) => {
        const time = selectedTime || requestData.time;
        setShowDatetimePicker({ ...showDatetimePicker, time: !showDatetimePicker.time });
        setRequestData({ ...requestData, time: time });
    };

    const handleServices = (name, value) => {
        setServices({
            ...services,
            [name]: value,
        })
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.WHITE.background }}>
            <ScrollView>
                <Text style={styles.top_title}>{I18n.t('make_your_request')}</Text>
                <Surface style={styles.surface}>
                    <Text style={styles.title}>{I18n.t('select_addresses')}</Text>

                    <Text style={styles.sub_title}>{I18n.t('pickup_address')}</Text>
                    <TouchableOpacity style={styles.action} onPress={() => {
                        route.params?.deliverPoint && route.params?.pickupPoint ?
                            navigation.navigate('RequesterSelectRoutesScreen', {
                                from: 'pickup',
                                pickupData: {
                                    latitude: requestData.pickup_latitude,
                                    longitude: requestData.pickup_longitude,
                                    text: requestData.pickup_text
                                },
                                deliverData: {
                                    latitude: requestData.deliver_latitude,
                                    longitude: requestData.deliver_longitude,
                                    text: requestData.deliver_text
                                }
                            })
                            :
                            navigation.navigate('RequesterSelectRoutesScreen')
                    }}>
                        <Text numberOfLines={I18n.locale == 'ar' ? null : 1} style={styles.inputText}>{requestData.pickup_text == '' ? I18n.t('you_have_not_selected_any_address') : requestData.pickup_text}</Text>
                        <Icon.MaterialIcons style={{ marginLeft: 8 }} name="location-searching" color={colors.PRIMARY_COLOR} size={20} />
                    </TouchableOpacity>

                    <Text style={styles.sub_title}>{I18n.t('delivery_address')}</Text>
                    <TouchableOpacity style={styles.action} onPress={() => {
                        route.params?.deliverPoint && route.params?.pickupPoint ?
                            navigation.navigate('RequesterSelectRoutesScreen', {
                                from: 'deliver',
                                pickupData: {
                                    latitude: requestData.pickup_latitude,
                                    longitude: requestData.pickup_longitude,
                                    text: requestData.pickup_text
                                },
                                deliverData: {
                                    latitude: requestData.deliver_latitude,
                                    longitude: requestData.deliver_longitude,
                                    text: requestData.deliver_text
                                }
                            })
                            :
                            navigation.navigate('RequesterSelectRoutesScreen')
                    }}>
                        <Text numberOfLines={I18n.locale == 'ar' ? null : 1} style={styles.inputText}>{requestData.deliver_text == '' ? I18n.t('you_have_not_selected_any_address') : requestData.deliver_text}</Text>
                        <Icon.MaterialIcons style={{ marginLeft: 8 }} name="gps-fixed" color={colors.PRIMARY_COLOR} size={20} />
                    </TouchableOpacity>
                    {
                        (requestData.pickup_text == '' || requestData.deliver_text == '') && checkOnMakeRequest ?
                            <Text style={styles.textValidation}>{I18n.t('you_must_select_both_addresses')}*</Text> : null
                    }
                </Surface>

                <Surface style={styles.surface}>
                    <Text style={styles.title}>{I18n.t("select_date_and_time")}</Text>
                    <TouchableOpacity style={styles.action} onPress={onChangeDate}>
                        <Text style={styles.inputText}>{Moment(requestData.date).format("LL")}</Text>
                        <Icon.MaterialCommunityIcons style={{ marginLeft: 8 }} name="calendar-month" color={colors.PRIMARY_COLOR} size={20} />
                    </TouchableOpacity>
                    {
                        showDatetimePicker.date ?
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={requestData.date}
                                minimumDate={new Date()}
                                mode="date"
                                is24Hour={true}
                                display="calendar"
                                onChange={onChangeDate}
                                locale={I18n.locale}
                            /> : null
                    }

                    <TouchableOpacity style={styles.action} onPress={onChangeTime}>
                        <Text style={styles.inputText}>{Moment(requestData.time).format("LT")}</Text>
                        <Icon.MaterialCommunityIcons style={{ marginLeft: 8 }} name="clock" color={colors.PRIMARY_COLOR} size={20} />
                    </TouchableOpacity>
                    {
                        showDatetimePicker.time ?
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={requestData.time}
                                minimumDate={new Date()}
                                mode="time"
                                is24Hour={true}
                                display="spinner"
                                onChange={onChangeTime}
                                locale={I18n.locale}
                            /> : null
                    }
                </Surface>

                <Surface style={styles.surface}>
                    <Text style={styles.title}>{I18n.t('select_service_type')}</Text>
                    <ServiceTypes services={services} onPress={(name, value) => handleServices(name, value)} />
                    {
                        !(services.car || services.bus || services.pickup || services.truck) && checkOnMakeRequest ?
                            <Text style={styles.textValidation}>{I18n.t('you_must_select_at_least_one_service')}*</Text> : null
                    }
                </Surface>

                <Surface style={styles.surface}>
                    <Text style={styles.title}>{I18n.t('notes')} <Text style={styles.optionalText}>({I18n.t('optional')})</Text></Text>
                    <TouchableOpacity style={styles.action}>
                        <TextInput multiline numberOfLines={8} style={[styles.inputText, { textAlignVertical: 'top' }, I18n.locale == 'ar' ? { writingDirection: 'rtl' } : { writingDirection: 'ltr' }]} onChangeText={(value) => setRequestData({ ...requestData, notes: value.toString() })} />
                    </TouchableOpacity>
                </Surface>

                <View style={{ padding: 20 }}>
                    <MButton opaque={true} buttonStyle="solid" caption={I18n.t('send_request')} onPress={() => {
                        (services.car || services.bus || services.pickup || services.truck) && (requestData.pickup_text != '' && requestData.deliver_text != '') ?
                            handleMakeRequest()
                            :
                            setCheckOnMakeRequest(true)
                    }} />
                </View>
            </ScrollView>
            {
                <MyModal
                    isVisible={myModalVisibility.preparingRequestModal}
                    onRequestClose={() => setMyModalVisibility({ ...myModalVisibility, preparingRequestModal: false })}
                >
                    <Text style={styles.unavailable}>{I18n.t('please_wait_while_we_process_your_order')}</Text>
                    <ActivityIndicator size={64} color={colors.PRIMARY_COLOR} style={{ margin: 18 }} />
                </MyModal>
            }
            {
                <MyModal
                    isVisible={myModalVisibility.noProvidersModal}
                    headerCaption={I18n.t('modal_error_message')}
                    onRequestClose={() => setMyModalVisibility({ ...myModalVisibility, noProvidersModal: false })}
                >
                    <Text style={styles.unavailable}>{I18n.t('no_available_providers_found')}</Text>
                    <Icon.FontAwesome5 name="user-clock" color={colors.TRANSPARENCY.BLACK.medium} size={64}
                        style={{ margin: 18 }}
                    />
                    <Text style={styles.unavailable}>{I18n.t('please_try_again_later')}</Text>
                </MyModal>
            }
            {
                <MyModal
                    isVisible={myModalVisibility.requestSendedModal}
                    headerCaption={I18n.t('modal_successful_message')}
                    onRequestClose={() => setMyModalVisibility({ ...myModalVisibility, requestSendedModal: false })}
                >
                    <Text style={styles.unavailable}>{I18n.t('your_request_has_been_sent_successfully')}</Text>
                    <Icon.MaterialIcons name="check" color={colors.TRANSPARENCY.BLACK.medium} size={64}
                        style={{ margin: 18 }}
                    />
                </MyModal>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    unavailable: {
        color: colors.TRANSPARENCY.BLACK.medium,
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
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
        margin: 20,
        fontWeight: 'bold',
        fontSize: 24,
    },
    sub_title: {
        marginLeft: 8,
        color: colors.TRANSPARENCY.BLACK.medium
    },
    inputText: {
        flex: 9,
    },
    action: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: colors.TRANSPARENCY.BLACK.small,
        padding: 14,
        borderRadius: 8,
        marginVertical: 6,
    },
    textValidation: {
        color: 'red'
    },
    optionalText: {
        color: colors.TRANSPARENCY.BLACK.small,
        fontWeight: 'normal',
        fontSize: 14
    }
});