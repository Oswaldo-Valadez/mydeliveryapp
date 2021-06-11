import React, { useState, useEffect } from 'react';

import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    Image,
} from 'react-native';

import {
    Surface,
} from 'react-native-paper';

import BraintreeView from '../components/PaymentMethods/BraintreeView';
import IngenicoView from '../components/PaymentMethods/IngenicoView';

import { colors } from '../common/theme';
import I18n from '../common/lang/config';

import ServiceTypes from '../components/ServiceTypes';

import MButton from '../components/MaterialButton';

import * as firebase from 'firebase';

import * as Icon from '@expo/vector-icons';
import Moment from 'moment/min/moment-with-locales';

export default function ProviderMakePayment(props) {

    const [services, setServices] = useState({
        car: false,
        bus: false,
        pickup: false,
        truck: false
    });

    useEffect(() => {
        let sub_total = 0;

        if (services.car)
            sub_total += 5;

        if (services.bus)
            sub_total += 7;

        if (services.pickup)
            sub_total += 6;

        if (services.truck)
            sub_total += 10;

        setTotal(sub_total);
        setPayData({ ...payData, amount: sub_total });
    }, [services]);

    const [payData, setPayData] = useState({
        email: "walosdarck@gmail.com",
        amount: 0,
        order_id: new Date().toString(),
        name: "Test",
        description: "Payment test",
        currency: "OMR",
        quantity: 1,
    });

    const [gateway, setGateway] = useState('');

    const [readyToPay, setReadyToPay] = useState(false);

    const [total, setTotal] = useState(0)

    const handleServices = (name, value) => {
        setServices({
            ...services,
            [name]: value,
        });
    }

    const [checkOnMakeRequest, setCheckOnMakeRequest] = useState(false);

    const onSuccessHandler = () => {
        firebase.database().ref('users/' + firebase.auth().currentUser.uid).update({
            approved: true,
            services: services,
        }).then(() => props.navigation.goBack());
    };

    return (
        <View style={{ backgroundColor: colors.WHITE.background, flex: 1 }}>
            {
                !readyToPay ?
                    <View>
                        <Text style={styles.top_title}>{I18n.t('choose_the_services_for_your_subscription')}</Text>
                        <View style={styles.surface}>
                            <ServiceTypes withPricing services={services} onPress={(name, value) => handleServices(name, value)} />
                            {
                                !(services.car || services.bus || services.pickup || services.truck) && checkOnMakeRequest ?
                                    <Text style={styles.textValidation}>{I18n.t('you_must_select_at_least_one_service')}*</Text> : null
                            }
                        </View>
                        <View style={styles.surface}>
                            <View style={styles.totalContainer}>
                                <Text style={styles.totalText}>{total}</Text>
                                <Text style={styles.currencyText}>{I18n.t('omr')}</Text>
                            </View>
                        </View>
                        <View style={styles.surface}>
                            <Text style={styles.title}>{I18n.t("expire_date")}</Text>
                            <View style={{
                                flexDirection: 'row',
                                borderWidth: 1,
                                borderColor: colors.TRANSPARENCY.BLACK.small,
                                padding: 14,
                                borderRadius: 8,
                                marginVertical: 6,
                            }} >
                                <Text style={styles.inputText}>{Moment(new Date).add(1, 'months').format("LL")}</Text>
                                <Icon.MaterialCommunityIcons style={{ marginLeft: 8 }} name="calendar-month" color={colors.PRIMARY_COLOR} size={20} />
                            </View>
                            <Text style={styles.renewal_text}>{I18n.t('renewal_alert')}*</Text>
                        </View>
                        <View style={{ padding: 20 }}>
                            <MButton opaque={true} buttonStyle="solid" caption={I18n.t('make_payment')} onPress={() => {
                                (services.car || services.bus || services.pickup || services.truck) ?
                                    setReadyToPay(true)
                                    :
                                    setCheckOnMakeRequest(true)
                            }} />
                        </View>
                    </View>
                    :
                    gateway == '' ?
                        <View>
                            <Text style={styles.top_title}>{I18n.t('select_payment_gateway')}</Text>

                            <Surface style={styles.surface}>
                                <TouchableOpacity style={styles.action} onPress={() => {
                                    setGateway('braintree');
                                }}>
                                    <Image
                                        style={styles.thumb}
                                        source={require('../../assets/images/braintree-gateway.png')}
                                    />
                                </TouchableOpacity>
                            </Surface>

                            <Surface style={styles.surface}>
                                <TouchableOpacity style={styles.action} onPress={() => {
                                    setGateway('ingenico');
                                }}>
                                    <Image
                                        style={[styles.thumb, { borderRadius: 8 }]}
                                        source={require('../../assets/images/ingenico-gateway.png')}
                                    />
                                </TouchableOpacity>
                            </Surface>
                        </View >
                        : gateway == "braintree" ?
                            <BraintreeView payData={payData} onSuccess={() => onSuccessHandler()} onCancel={() => setReadyToPay(false)} />
                            :
                            <IngenicoView />
            }
            {
                !readyToPay ?
                    null :
                    <View style={[{ padding: 20, backgroundColor: colors.WHITE.default, borderTopWidth: 1, borderColor: colors.TRANSPARENCY.BLACK.small }, !gateway == '' ? null : { backgroundColor: colors.TRANSPARENT }]}>
                        <MButton opaque={true} buttonStyle="solid" caption={I18n.t('cancel')} onPress={() => {
                            setReadyToPay(false);
                            setGateway('');
                        }} />
                    </View>
            }
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
        backgroundColor: colors.WHITE.default,
    },
    totalContainer: {
        width: 110,
        height: 110,
        borderRadius: 128,
        borderWidth: 1,
        borderColor: colors.TRANSPARENCY.BLACK.small,
        alignSelf: 'center',
    },
    totalText: {
        flex: 1,
        textAlignVertical: 'bottom',
        textAlign: 'center',
        fontSize: 28,
        fontWeight: 'bold',
    },
    currencyText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        textAlignVertical: 'top'
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
        alignContent: 'center',
        alignItems: 'center',
    },
    textValidation: {
        color: 'red'
    },
    optionalText: {
        color: colors.TRANSPARENCY.BLACK.small,
        fontWeight: 'normal',
        fontSize: 14
    },
    thumb: {
        width: 150,
        height: 75,
        marginVertical: 8,
    },
    renewal_text: {
        color: colors.TRANSPARENCY.BLACK.medium,
        fontWeight: 'bold',
        fontSize: 12,
    },
});