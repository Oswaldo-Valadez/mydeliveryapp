import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Dimensions,
    Text,
} from 'react-native';
import { TouchableOpacity, BaseButton } from 'react-native-gesture-handler';
import MapComponent from '../components/MapComponent';
import { colors } from '../common/theme';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
var { height, width } = Dimensions.get('window');

import { google_map_key } from '../common/key';
import I18n from '../common/lang/config';
import Geocoder from 'react-native-geocoding';

import BottomButton from '../components/BottomButton';

import * as Icon from '@expo/vector-icons';

export default function SelectRoutes({ navigation, route }) {

    useLayoutEffect(() => {
        Geocoder.init(google_map_key, { language: I18n.locale });
        _getLocationAsync();
    }, []);

    useLayoutEffect(() => {
        if (route.params?.pickupData && route.params?.deliverData && route.params?.from) {
            const { pickupData, deliverData, from } = route.params;
            setPickupRegion({
                ...pickupRegion,
                latitude: pickupData.latitude,
                longitude: pickupData.longitude,
                text: pickupData.text,
            });
            setDeliverRegion({
                ...pickupRegion,
                latitude: deliverData.latitude,
                longitude: deliverData.longitude,
                text: deliverData.text,
            });
            setSelectedPoint(from);
        }
    }, [route.params?.pickupData, route.params?.deliverData, route.params?.from]);

    const [pickupRegion, setPickupRegion] = useState({
        text: "",
        latitude: 9.061460,
        longitude: 7.500640,
        latitudeDelta: 0.0628,
        longitudeDelta: 0.0447,
    });

    const [deliverRegion, setDeliverRegion] = useState({
        text: "",
        latitude: 9.061460,
        longitude: 7.500640,
        latitudeDelta: 0.0628,
        longitudeDelta: 0.0447,
    });

    const [selectedPoint, setSelectedPoint] = useState('pickup');

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);

        if (status !== 'granted') {
            return null;
        }

        const location = await Location.getCurrentPositionAsync({});
        if (location) {
            const pos = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };

            if (pos) {
                const latlng = pos.latitude + ',' + pos.longitude;
                return fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latlng + '&key=' + google_map_key)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        //console.error(responseJson);
                        if (!route.params)
                            Geocoder.from({
                                latitude: pos.latitude,
                                longitude: pos.longitude
                            }).then(json => {
                                const addressComponent = json.results[0].formatted_address;
                                setPickupRegion({
                                    ...pickupRegion,
                                    latitude: pos.latitude,
                                    longitude: pos.longitude,
                                    text: addressComponent,
                                });
                                setDeliverRegion({
                                    ...deliverRegion,
                                    latitude: pos.latitude,
                                    longitude: pos.longitude,
                                    text: addressComponent,
                                });
                            }).catch(error => console.warn(error));
                    }).catch((error) => {
                        //console.error(error);
                    });
            }
        }
    }

    //Go to confirm booking page
    onPressBook = () => {

    }

    const tapAddress = (selection) => {
        if (selection === selectedPoint) {
            navigation.navigate('RequesterSearchPlaceScreen', { from: selection, pickupData: pickupRegion, deliverData: deliverRegion });
        } else {
            setSelectedPoint(selection);
        }
    };

    const onRegionChangeComplete = (region_map) => {
        Geocoder.from({
            latitude: region_map.latitude,
            longitude: region_map.longitude
        }).then(json => {
            var addressComponent = json.results[0].formatted_address;
            if (selectedPoint == 'pickup') {
                setPickupRegion({
                    ...pickupRegion,
                    latitude: region_map.latitude,
                    longitude: region_map.longitude,
                    latitudeDelta: region_map.latitudeDelta,
                    longitudeDelta: region_map.longitudeDelta,
                    text: addressComponent
                });
            } else {
                setDeliverRegion({
                    ...deliverRegion,
                    latitude: region_map.latitude,
                    longitude: region_map.longitude,
                    latitudeDelta: region_map.latitudeDelta,
                    longitudeDelta: region_map.longitudeDelta,
                    text: addressComponent
                });
            }
        }).catch(error => console.warn(error));
    }

    return (
        <View style={styles.mainViewStyle}>
            <View style={styles.myViewStyle}>
                <View style={styles.coverViewStyle}>
                    <View style={styles.viewStyle1} />
                    <View style={styles.viewStyle2} />
                    <View style={styles.viewStyle3} />
                </View>
                <View style={styles.iconsViewStyle}>
                    <TouchableOpacity onPress={() => tapAddress('pickup')} style={styles.contentStyle}>
                        <View style={styles.textIconStyle}>
                            <Text numberOfLines={1} style={[styles.textStyle, selectedPoint == 'pickup' ? { fontSize: 20 } : { fontSize: 14 }, I18n.locale == 'ar' ? { marginRight: 8 } : null]}>{pickupRegion.text}</Text>
                            <Icon.MaterialIcons
                                name='location-searching'
                                color={colors.WHITE.default}
                                containerStyle={{ flex: 1 }}
                                style={selectedPoint == 'pickup' ? { fontSize: 24 } : { fontSize: 16 }}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => tapAddress('deliver')} style={styles.contentStyle}>
                        <View style={styles.textIconStyle}>
                            <Text numberOfLines={1} style={[styles.textStyle, selectedPoint == 'deliver' ? { fontSize: 20 } : { fontSize: 14 }, I18n.locale == 'ar' ? { marginRight: 8 } : null]}>{deliverRegion.text}</Text>
                            <Icon.MaterialIcons
                                name='gps-fixed'
                                color={colors.WHITE.default}
                                containerStyle={{ flex: 1 }}
                                style={selectedPoint == 'deliver' ? { fontSize: 24 } : { fontSize: 16 }}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.mapcontainer}>
                <MapComponent
                    mapRegion={selectedPoint == 'pickup' ? pickupRegion : deliverRegion}
                    onRegionChangeComplete={onRegionChangeComplete}
                />
                {
                    selectedPoint == 'pickup' ?
                        <View pointerEvents="none" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
                            <Image pointerEvents="none" style={{ marginBottom: 40, height: 40, resizeMode: "contain" }} source={require('../../assets/images/red_pin.png')} />
                        </View>
                        :
                        <View pointerEvents="none" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
                            <Image pointerEvents="none" style={{ marginBottom: 40, height: 40, resizeMode: "contain" }} source={require('../../assets/images/green_pin.png')} />
                        </View>
                }
            </View>
            <View style={styles.bottomButtonContainer}>
                <BottomButton style={styles.bottomBigButton} caption={I18n.t('confirm_addresses')} onPress={() => {
                    navigation.navigate('RootTabScreen', {
                        screen: 'RequesterMakeRequestScreen',
                        params: {
                            deliverPoint: deliverRegion,
                            pickupPoint: pickupRegion
                        }
                    });
                }} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    bottomBigButton: {
        backgroundColor: colors.PRIMARY_COLOR,
        flex: 2,
        flexDirection: 'row',
    },
    bottomSmallButton: {
        flex: 1.25,
        backgroundColor: colors.WHITE.default,
        borderTopWidth: 1,
        borderColor: colors.PRIMARY_COLOR,
        flexDirection: 'row',
    },
    bottomButtonContainer: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
    },
    mapcontainer: {
        flex: 1,
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainViewStyle: {
        flex: 1,
        backgroundColor: colors.WHITE.default,
    },
    myViewStyle: {
        flexDirection: 'row',
        borderTopWidth: 0,
        alignItems: 'center',
        backgroundColor: colors.PRIMARY_COLOR,
        paddingEnd: 20,
        height: 110,
    },
    coverViewStyle: {
        flex: 1.5,
        alignItems: 'center'
    },
    viewStyle1: {
        height: 12,
        width: 12,
        borderRadius: 15 / 2,
        backgroundColor: colors.YELLOW.light
    },
    viewStyle2: {
        height: height / 25,
        width: 1,
        backgroundColor: colors.YELLOW.light
    },
    viewStyle3: {
        height: 14,
        width: 14,
        backgroundColor: colors.GREY.iconPrimary
    },
    iconsViewStyle: {
        flex: 9.5,
        justifyContent: 'space-between'
    },
    contentStyle: {
        //flex: 1, 
        justifyContent: 'center',
        borderBottomColor: colors.WHITE.default,
        borderBottomWidth: 1
    },
    textIconStyle: {
        // flex: 1, 
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    textStyle: {
        flex: 9,
        fontSize: 14,
        fontWeight: '400',
        color: colors.WHITE.default,
        marginTop: 10,
        marginBottom: 10,
        writingDirection: I18n.locale == 'ar' ? 'rtl' : 'ltr',
    },
});