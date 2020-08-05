import React, { useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
    RequesterDrawer,
    ProviderDrawer
} from './DrawerNavigators';
import { AuthStack } from './StackNavigators';
import SplashLoading from '../screens/SplashLoading';
import SelectLanguage from '../screens/SelectLanguage';

const MainRootStack = createStackNavigator();

export default function AppContainer(props) {

    return (
        <NavigationContainer>
            <MainRootStack.Navigator headerMode='none'>
                {
                    props.isLoading ?
                        <MainRootStack.Screen name="SplashLoading" component={SplashLoading} />
                        :
                        !props.isLang ?
                            <MainRootStack.Screen name="SelectLanguageScreen" component={SelectLanguage} />
                            :
                            !props.isLogin ?
                                <MainRootStack.Screen name="RootAuthStack" component={AuthStack} />
                                :
                                props.usertype == 'provider' ?
                                    <MainRootStack.Screen name="RootProviderDrawer" component={ProviderDrawer} />
                                    :
                                    <MainRootStack.Screen name="RootRequesterDrawer" component={RequesterDrawer} />
                }
            </MainRootStack.Navigator>
        </NavigationContainer>
    );

}