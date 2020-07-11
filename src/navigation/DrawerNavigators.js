import React from 'react';
import { View, StyleSheet } from 'react-native';

import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';
import {
    RequesterStack,
    ProviderStack
} from './StackNavigators';

import MButton from '../components/MaterialButton';

import * as firebase from 'firebase';

function DrawerContent(props) {

    return (
        <View style={styles.drawerContainer}>
            <MButton caption="Sign Out" opaque={true} buttonStyle="solid" onPress={() => {
                firebase.auth().signOut();
            }} />
        </View>
    );
}

const RootRequesterDrawer = createDrawerNavigator();
export class RequesterDrawer extends React.Component {
    render() {
        return (
            <RootRequesterDrawer.Navigator headerMode='none' drawerContent={props => <DrawerContent {...props} />}>
                <RootRequesterDrawer.Screen name="RequesterStack" component={RequesterStack} />
            </RootRequesterDrawer.Navigator>
        );
    }
}

const RootProviderDrawer = createDrawerNavigator();
export class ProviderDrawer extends React.Component {
    render() {
        return (
            <RootProviderDrawer.Navigator headerMode='none' drawerContent={props => <DrawerContent {...props} />}>
                <RootProviderDrawer.Screen name="ProviderStack" component={ProviderStack} />
            </RootProviderDrawer.Navigator>
        );
    }
}

const styles = StyleSheet.create({
    drawerContainer: {
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
});