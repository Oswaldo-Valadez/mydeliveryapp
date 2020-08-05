import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
    AsyncStorage,
    Dimensions
} from 'react-native';
import { Surface } from 'react-native-paper';
import { colors } from '../common/theme';
import I18n from '../common/lang/config';
import * as firebase from 'firebase';

const { height } = Dimensions.get('window');

function ListItem(props) {
    return (
        <Surface style={[styles.container]}>
            <TouchableOpacity style={{ width: '100%', height: '100%' }}>
                <View>
                    <Text style={styles.code}>#{props.itemData.name}</Text>
                    <Text style={styles.date}>{I18n.t('date')}: {props.itemData.start_date}</Text>
                </View>
                <View>
                    <Text style={styles.vehicleType}>{I18n.t('vehicle_type')}: {props.itemData.type}</Text>
                </View>
                <View>
                    <Text style={{ justifyContent: 'center', fontWeight: '100' }}>{I18n.t('pick_up_place')}: </Text>
                    <Text style={{ justifyContent: 'center', fontWeight: '100' }}>{I18n.t('delivery_place')}: </Text>
                </View>
            </TouchableOpacity>
        </Surface>
    );
}

export default function List(props) {

    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        const refProducts = firebase.database().ref('requests');
        refProducts.on('value', data => {
            const allProducts = [];
            const products = data.val();
            for (let key in products) {
                if (products[key].requester_uid == firebase.auth().currentUser.uid && products[key].status == props.status)
                    allProducts.push(
                        <ListItem itemData={products[key]} />
                    );
            }
            setAllProducts(allProducts);
        });
    }, []);

    return allProducts;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '96%',
        height: height * 0.2,
        alignSelf: 'center',
        marginVertical: 6,
        padding: 12,
        elevation: 6,
        borderRadius: 10,
        overflow: "visible"
    },
    date: {
        fontWeight: 'bold',
        fontSize: 16,
        alignSelf: 'flex-end',
    },
    code: {
        fontWeight: 'bold',
        fontSize: 18,
        color: colors.PRIMARY_COLOR,
    },
    vehicleType: {
        fontWeight: 'bold',
        fontSize: 14,
        alignSelf: 'flex-start',
    }
});