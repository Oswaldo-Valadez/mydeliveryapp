import React from 'react';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import RequesterActiveRequests from '../screens/RequesterActiveRequests';
import RequesterCompleteRequests from '../screens/RequesterCompleteRequests';
import RequesterMakeRequest from '../screens/RequesterMakeRequest';

import ProviderActiveRequests from '../screens/ProviderActiveRequests';
import ProviderCompleteRequests from '../screens/ProviderCompleteRequests';

import * as Icon from '@expo/vector-icons';
import { colors } from '../common/theme';

const RootProviderTab = createMaterialTopTabNavigator();
export const ProviderTab = () => (
    <RootProviderTab.Navigator
        initialRouteName="ProviderMakeRequestScreen"
        tabBarPosition="bottom"
        tabBarOptions={{
            labelStyle: { fontSize: 8, color: colors.WHITE },
            style: { backgroundColor: colors.PRIMARY_COLOR },
            showIcon: true,
            indicatorStyle: {
                width: 0,
            }
        }}
    >
        <RootProviderTab.Screen
            name="ProviderActiveRequestsScreen"
            component={ProviderActiveRequests}
            options={{
                tabBarLabel: 'Active Requests',
                tabBarIcon: () => (
                    <Icon.MaterialIcons name="playlist-play" color={colors.WHITE} size={26} />
                )
            }}
        />
        <RootProviderTab.Screen
            name="ProviderCompleteRequestsScreen"
            component={ProviderCompleteRequests}
            options={{
                tabBarLabel: 'Complete Requests',
                tabBarIcon: () => (
                    <Icon.MaterialIcons name="playlist-add-check" color={colors.WHITE} size={26} />
                )
            }}
        />
    </RootProviderTab.Navigator>
);

const RootRequesterTab = createMaterialTopTabNavigator();
export const RequesterTab = () => (
    <RootRequesterTab.Navigator
        initialRouteName="RequesterMakeRequestScreen"
        tabBarPosition="bottom"
        tabBarOptions={{
            labelStyle: { fontSize: 8, color: colors.WHITE },
            style: { backgroundColor: colors.PRIMARY_COLOR },
            showIcon: true,
            indicatorStyle: {
                width: 0,
            }
        }}
    >
        <RootRequesterTab.Screen
            name="RequesterActiveRequestsScreen"
            component={RequesterActiveRequests}
            options={{
                tabBarLabel: 'Active Requests',
                tabBarIcon: () => (
                    <Icon.MaterialIcons name="playlist-play" color={colors.WHITE} size={26} />
                )
            }}
        />
        <RootRequesterTab.Screen
            name="RequesterMakeRequestScreen"
            component={RequesterMakeRequest}
            options={{
                tabBarLabel: 'Make Request',
                tabBarIcon: () => (
                    <Icon.Octicons name="diff-added" color={colors.WHITE} size={26} />
                )
            }}
        />
        <RootRequesterTab.Screen
            name="RequesterCompleteRequestsScreen"
            component={RequesterCompleteRequests}
            options={{
                tabBarLabel: 'Complete Requests',
                tabBarIcon: () => (
                    <Icon.MaterialIcons name="playlist-add-check" color={colors.WHITE} size={26} />
                )
            }}
        />
    </RootRequesterTab.Navigator>
);