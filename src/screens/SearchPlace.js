import React, { useState } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { colors } from '../common/theme';
import { google_map_key } from '../common/key';

import I18n from '../common/lang/config';

export default function SearchPlace({navigation, route}) {

    const { from, pickupData, deliverData } = route.params;

    const goMap = (data, details) => {
        if (from == "pickup") {
            const newData = {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                text: details.formatted_address
            }

            navigation.navigate('RequesterSelectRoutesScreen', { from: from, pickupData: newData, deliverData: deliverData });
        } else {
            const newData = {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                text: details.formatted_address
            }

            navigation.navigate('RequesterSelectRoutesScreen', { from: from, pickupData: pickupData, deliverData: newData });
        }

    }
    return (
        <GooglePlacesAutocomplete
            placeholder={I18n.t('search')}
            minLength={2}
            autoFocus={true}
            returnKeyType={'search'}
            listViewDisplayed='auto'
            fetchDetails={true}
            renderDescription={row => row.description}
            textInputProps={{ clearButtonMode: 'while-editing' }}
            onPress={(data, details = null) => {
                goMap(data, details);
            }}
            getDefaultValue={() => ''}
            query={{
                key: google_map_key,
                language: I18n.locale,
            }}
            styles={{
                container: {
                    backgroundColor: colors.WHITE.background
                },
                description: {
                    fontWeight: 'bold'
                },
                textInputContainer: {
                    width: '100%',
                    height: 65,
                    backgroundColor: colors.WHITE.background
                },
                textInput: {
                    height: 50,
                    borderWidth: 1,
                    borderColor: colors.TRANSPARENCY.BLACK.small
                },
                loader: {
                    borderColor: colors.PRIMARY_COLOR
                },
                poweredContainer: {
                    borderBottomWidth: 1,
                    borderColor: colors.TRANSPARENCY.BLACK.small
                },
                separator: {
                    height: 2,
                    backgroundColor: colors.WHITE.background
                },
                row: {
                    backgroundColor: colors.WHITE.default
                }
            }}
            renderDescription={(row) => row.description || row.formatted_address || row.name}
            currentLocation={true}
            currentLocationLabel={I18n.t('current_location')}
            nearbyPlacesAPI='GoogleReverseGeocoding'
            GoogleReverseGeocodingQuery={{
                key: google_map_key,
                language: I18n.location,
            }}
            GooglePlacesSearchQuery={{
                rankby: 'distance',
                types: 'establishment'
            }}
            debounce={200}
        />
    );
}