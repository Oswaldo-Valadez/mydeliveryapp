import React, { useEffect, useState } from 'react';
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
import { GeoFire } from 'geofire';
import * as firebase from 'firebase'
import { AnimatedRegion } from 'react-native-maps';
import { google_map_key } from '../common/key';
import I18n from '../common/lang/config';
import Geocoder from 'react-native-geocoding';

import MButton from '../components/MaterialButton';

import * as Icon from '@expo/vector-icons';

export default function RequesterMakeRequest(props) {

    useEffect(() => {
        Geocoder.init(google_map_key);
        _getLocationAsync();
        console.log("useEffect");
    }, []);

    const [requestData, setRequestData] = useState({
        deliver_text: "",
        deliver_latitude: 9.061460,
        deliver_longitude: 7.500640,
        pickup_text: "",
        pickup_latitude: 9.061460,
        pickup_longitude: 7.500640,
        types: [],
        date_time: '',
        notes: ''
    });

    const [pickupRegion, setPickupRegion] = useState({
        latitude: 9.061460,
        longitude: 7.500640,
        latitudeDelta: 0.9922,
        longitudeDelta: 0.9421,
    });

    const [deliverRegion, setDeliverRegion] = useState({
        latitude: 9.061460,
        longitude: 7.500640,
        latitudeDelta: 0.9922,
        longitudeDelta: 0.9421,
    });

    const [selectedPoint, setSelectedPoint] = useState('pickup');

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);

        if (status !== 'granted') {
            return null;
        }

        let location = await Location.getCurrentPositionAsync({})
        if (location) {
            var pos = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };

            if (pos) {
                let latlng = pos.latitude + ',' + pos.longitude;
                return fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latlng + '&key=' + google_map_key)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        //console.error(responseJson);
                        if (!props.route.params) {
                            Geocoder.from({
                                latitude: pos.latitude,
                                longitude: pos.longitude
                            }).then(json => {
                                const addressComponent = json.results[0].formatted_address;
                                setPickupRegion({
                                    ...pickupRegion,
                                    latitude: pos.latitude,
                                    longitude: pos.longitude,
                                    latitudeDelta: pos.latitudeDelta,
                                    longitudeDelta: pos.longitudeDelta,
                                });
                                setDeliverRegion({
                                    ...deliverRegion,
                                    latitude: pos.latitude,
                                    longitude: pos.longitude,
                                    latitudeDelta: pos.latitudeDelta,
                                    longitudeDelta: pos.longitudeDelta,
                                });
                                setRequestData({
                                    ...requestData,
                                    deliver_text: addressComponent,
                                    deliver_latitude: pos.latitude,
                                    deliver_longitude: pos.longitude,
                                    pickup_text: addressComponent,
                                    pickup_latitude: pos.latitude,
                                    pickup_longitude: pos.longitude,
                                });
                            }).catch(error => console.warn(error));
                        } else {
                            if (props.route.params.point == "pickup") {
                                setPickupRegion({
                                    ...pickupRegion,
                                    latitude: props.route.params.data.latitude,
                                    longitude: props.route.params.data.longitude,
                                    latitudeDelta: pos.latitudeDelta,
                                    longitudeDelta: pos.longitudeDelta,
                                });
                                setRequestData({
                                    ...requestData,
                                    deliver_text: addressComponent,
                                    deliver_latitude: pos.latitude,
                                    deliver_longitude: pos.longitude,
                                    pickup_text: addressComponent,
                                    pickup_latitude: pos.latitude,
                                    pickup_longitude: pos.longitude,
                                });
                            } else {

                            }
                        }
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
            props.navigation.navigate('RequesterSearchPlaceScreen', { from: selection, data: requestData });
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
                setRequestData({
                    ...requestData,
                    pickup_text: addressComponent,
                    pickup_latitude: region_map.latitude,
                    pickup_longitude: region_map.longitude,
                });
                setPickupRegion({
                    ...pickupRegion,
                    latitude: region_map.latitude,
                    longitude: region_map.longitude,
                    latitudeDelta: region_map.latitudeDelta,
                    longitudeDelta: region_map.longitudeDelta,
                });
            } else {
                setRequestData({
                    ...requestData,
                    deliver_text: addressComponent,
                    deliver_latitude: region_map.latitude,
                    deliver_longitude: region_map.longitude,
                });
                setDeliverRegion({
                    ...deliverRegion,
                    latitude: region_map.latitude,
                    longitude: region_map.longitude,
                    latitudeDelta: region_map.latitudeDelta,
                    longitudeDelta: region_map.longitudeDelta,
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
                            <Text numberOfLines={1} style={[styles.textStyle, selectedPoint == 'pickup' ? { fontSize: 20 } : { fontSize: 14 }]}>{requestData.pickup_text}</Text>
                            <Icon.MaterialIcons
                                name='gps-fixed'
                                color={colors.WHITE}
                                containerStyle={{ flex: 1 }}
                                style={selectedPoint == 'pickup' ? { fontSize: 24 } : { fontSize: 16 }}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => tapAddress('deliver')} style={styles.contentStyle}>
                        <View style={styles.textIconStyle}>
                            <Text numberOfLines={1} style={[styles.textStyle, selectedPoint == 'deliver' ? { fontSize: 20 } : { fontSize: 14 }]}>{requestData.deliver_text}</Text>
                            <Icon.MaterialIcons
                                name='location-searching'
                                color={colors.WHITE}
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
            <MButton opaque={true} buttonStyle="solid" caption={I18n.t('sign_up')} onPress={() => props.navigation.navigate('RequesterSelectRoutesScreen')} />

        </View>
    );
}

const styles = StyleSheet.create({
    headerStyle: {
        backgroundColor: colors.GREY.default,
        borderBottomWidth: 0
    },
    headerTitleStyle: {
        color: colors.WHITE,
        fontSize: 18
    },
    mapcontainer: {
        flex: 1,
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
    },
    inrContStyle: {
        marginLeft: 10,
        marginRight: 10
    },
    mainViewStyle: {
        flex: 1,
        backgroundColor: colors.WHITE,
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
        borderBottomColor: colors.WHITE,
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
        color: colors.WHITE,
        marginTop: 10,
        marginBottom: 10
    },
    searchClickStyle: {
        //flex: 1, 
        justifyContent: 'center'
    },
    compViewStyle: {
        flex: 1,
    },
    pickCabStyle: {
        flex: 0.3,
        fontSize: 15,
        fontWeight: '500',
        color: colors.BLACK
    },
    sampleTextStyle: {
        flex: 0.2,
        fontSize: 13,
        fontWeight: '300',
        color: colors.GREY.secondary
    },
    adjustViewStyle: {
        flex: 9,
        flexDirection: 'row',
        //justifyContent: 'space-around',
        marginTop: 8
    },
    cabDivStyle: {
        flex: 1,
        width: width / 3,
        alignItems: 'center'
    },
    imageViewStyle: {
        flex: 2.7,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    imageStyle: {
        height: height / 14,
        width: height / 14,
        borderRadius: height / 14 / 2,
        borderWidth: 3,
        borderColor: colors.YELLOW.secondary,
        //backgroundColor: colors.WHITE, 
        justifyContent: 'center',
        alignItems: 'center'
    },
    textViewStyle: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    text1: {

        fontSize: 14,
        fontWeight: '900',
        color: colors.BLACK
    },
    text2: {
        fontSize: 12,
        fontWeight: '900',
        color: colors.GREY.secondary
    },
    imagePosition: {
        height: height / 14,
        width: height / 14,
        borderRadius: height / 14 / 2,
        borderWidth: 3,
        borderColor: colors.YELLOW.secondary,
        //backgroundColor: colors.YELLOW.secondary, 
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageStyleView: {
        height: height / 14,
        width: height / 14,
        borderRadius: height / 14 / 2,
        borderWidth: 3,
        borderColor: colors.YELLOW.secondary,
        //backgroundColor: colors.WHITE, 
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageStyle1: {
        height: height / 20.5,
        width: height / 20.5
    },
    imageStyle2: {
        height: height / 20.5,
        width: height / 20.5
    },
    buttonContainer: {
        flex: 1
    },

    buttonTitleText: {
        color: colors.GREY.default,
        fontSize: 20,
        alignSelf: 'flex-end'
    },

    cancelButtonStyle: {
        backgroundColor: "#edede8",
        elevation: 0,
        width: "60%",
        borderRadius: 5,
        alignSelf: "center"
    }

});