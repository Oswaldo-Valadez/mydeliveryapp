import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
    AsyncStorage,
    Dimensions,
} from 'react-native';
import { Surface } from 'react-native-paper';
import { colors } from '../common/theme';
import I18n from '../common/lang/config';
import * as firebase from 'firebase';
import Moment from 'moment/min/moment-with-locales';
import * as Icon from '@expo/vector-icons';

const { height } = Dimensions.get('window');

function ListItem(props) {

    useEffect(() => {
        Moment.locale(I18n.locale);
    });

    const onPressReject = (itemData) => {
        const final_list = [];
        const list = itemData.waiting_providers_list

        for (let key in list) {
            if (list[key] != firebase.auth().currentUser.uid) {
                final_list.push(list[key]);
            }
        }

        firebase.database().ref('requests/' + itemData.key).update({
            waiting_providers_list: final_list.length == 0 ? null : final_list,
            status: final_list.length == 0 ? 'inactive' : 'active',
        });
    }

    const onPressAccept = (itemData) => {
        firebase.database().ref('requests/' + itemData.key).update({
            waiting_providers_list: null,
            provider_uid: firebase.auth().currentUser.uid,
        });
    }

    return (
        <Surface style={[styles.container]}>
            <TouchableOpacity style={{ width: '100%' }} onPress={() => props.navigation.navigate('RequestFullDetailsScreen', { key: props.itemData.key })}>
                <View>
                    <Text style={styles.code}>#{props.itemData.key}</Text>
                </View>
                <View>
                    <Text style={styles.sub_title}>{I18n.t('pickup_address')}</Text>
                    <View style={styles.action}>
                        <Text numberOfLines={1} style={styles.inputText}>{props.itemData.pickup_point.text}</Text>
                        <Icon.MaterialIcons style={{ marginLeft: 8 }} name="location-searching" color={colors.PRIMARY_COLOR} size={16} />
                    </View>

                    <Text style={styles.sub_title}>{I18n.t('delivery_address')}</Text>
                    <View style={styles.action}>
                        <Text numberOfLines={1} style={styles.inputText}>{props.itemData.delivery_point.text}</Text>
                        <Icon.MaterialIcons style={{ marginLeft: 8 }} name="gps-fixed" color={colors.PRIMARY_COLOR} size={16} />
                    </View>
                </View>
                <Text style={styles.sub_title}>{I18n.t("date_and_time")}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <View style={[styles.action, { flex: 1, marginRight: 4 }]}>
                        <Text style={styles.inputText}>{Moment(props.itemData.date).format("LL")}</Text>
                        <Icon.MaterialCommunityIcons style={{ marginLeft: 8 }} name="calendar-month" color={colors.PRIMARY_COLOR} size={16} />
                    </View>
                    <View style={[styles.action, { flex: 1, marginLeft: 4 }]}>
                        <Text style={styles.inputText}>{Moment(props.itemData.time).format("LT")}</Text>
                        <Icon.MaterialCommunityIcons style={{ marginLeft: 8 }} name="clock" color={colors.PRIMARY_COLOR} size={16} />
                    </View>
                </View>
                {
                    props.makeQuestion ?
                        <View style={styles.containerMakeQuestion}>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity
                                    style={[styles.action, styles.actionMakeQuestion, { marginRight: 4, backgroundColor: colors.SKY }]}
                                    onPress={() => onPressAccept(props.itemData)}
                                >
                                    <Text style={[styles.inputText, { color: colors.WHITE.default, textAlign: 'center', fontWeight: 'bold' }]}>{I18n.t('accept')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.action, styles.actionMakeQuestion, { marginLeft: 4, backgroundColor: colors.RED }]}
                                    onPress={() => onPressReject(props.itemData)}
                                >
                                    <Text style={[styles.inputText, { color: colors.WHITE.default, textAlign: 'center', fontWeight: 'bold' }]}>{I18n.t('reject')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        :
                        null
                }
            </TouchableOpacity>
        </Surface>
    );
}

export default function List(props) {

    const [allRequests, setAllRequests] = useState([]);

    useEffect(() => {
        const pushRequests = [];
        const { requests } = props;

        for (let key in requests) {
            pushRequests.push(
                <ListItem key={key} itemData={requests[key]} navigation={props.navigation} makeQuestion={props.makeQuestion ? true : false} />
            );
        }

        setAllRequests(pushRequests);
    }, [props.requests]);

    return allRequests.length != 0 ? allRequests : null;
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignSelf: 'center',
        marginVertical: 6,
        padding: 12,
        elevation: 1,
        borderRadius: 0,
        overflow: "visible",
        backgroundColor: colors.WHITE.default
    },
    containerMakeQuestion: {
        borderTopWidth: 1,
        borderColor: colors.TRANSPARENCY.BLACK.small,
        marginTop: 8,
    },
    date: {
        fontWeight: 'bold',
        fontSize: 16,
        alignSelf: 'flex-end',
    },
    code: {
        fontWeight: 'bold',
        fontSize: 16,
        color: colors.PRIMARY_COLOR,
        marginBottom: 4,
    },
    sub_title: {
        marginLeft: 2,
        color: colors.TRANSPARENCY.BLACK.medium,
        fontSize: 12,
    },
    inputText: {
        flex: 9,
        fontSize: 10,
        textAlignVertical: 'center',
    },
    action: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: colors.TRANSPARENCY.BLACK.small,
        padding: 10,
        borderRadius: 8,
        marginVertical: 6,
    },
    actionMakeQuestion: {
        flex: 1,
        borderWidth: 0,
    },
});