import React, { useState } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import {
    StyleSheet,
} from 'react-native';

export default function MapComponent(props) {

    const [marginBottom, setMarginBotton] = useState(0);

    const { mapRegion, onRegionChangeComplete } = props;

    return (
        <MapView
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            loadingEnabled
            showsMyLocationButton={true}
            style={[styles.map, { marginBottom: marginBottom }]}
            region={mapRegion}
            onRegionChangeComplete={onRegionChangeComplete}
            onMapReady={() => setMarginBotton(1)}
        >
        </MapView>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
    },
});
