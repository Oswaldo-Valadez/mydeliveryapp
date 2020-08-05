import React, { useState } from 'react';
import { Platform, StatusBar } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { colors } from '../common/theme';
import { google_map_key } from '../common/key';

export default function SearchPlace(props) {

    const { from, pickupData, deliverData } = props.route.params;

    const goMap = (data, details) => {
        if (from == "pickup") {
            const newData = {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                text: details.formatted_address
            }

            props.navigation.replace('RequesterSelectRoutesScreen', { from: from, pickupData: newData, deliverData: deliverData });
        } else {
            const newData = {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                text: details.formatted_address
            }

            props.navigation.replace('RequesterSelectRoutesScreen', { from: from, pickupData: pickupData, deliverData: newData });
        }

    }
    return (
        <GooglePlacesAutocomplete
            placeholder='Search'
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
                language: 'es',
            }}
            styles={{
                container: {
                    backgroundColor: colors.BACKGROUND_COLOR
                },
                description: {
                    fontWeight: 'bold'
                },
                textInputContainer: {
                    width: '100%',
                    height: 65,
                    backgroundColor: colors.BACKGROUND_COLOR
                },
                textInput: {
                    height: 50,
                    borderWidth: 1,
                    borderColor: colors.TRANSPARENCY.BLACK.small
                },
                loader: {
                    borderColor: colors.PRIMARY_COLOR
                },
                listView: {
                },
                predefinedPlacesDescription: {
                },
                poweredContainer: {
                    borderBottomWidth: 1,
                    borderColor: colors.TRANSPARENCY.BLACK.small
                },
                separator: {
                    height: 2,
                    backgroundColor: colors.BACKGROUND_COLOR
                },
                row: {
                    backgroundColor: colors.WHITE
                }
            }}
            renderDescription={(row) => row.description || row.formatted_address || row.name}
            currentLocation={true}
            currentLocationLabel="Current location"
            nearbyPlacesAPI='GoogleReverseGeocoding'
            GoogleReverseGeocodingQuery={{
                key: google_map_key,
                language: 'en',
            }}
            GooglePlacesSearchQuery={{
                rankby: 'distance',
                types: 'establishment'
            }}
            debounce={200}
        />
    );
}