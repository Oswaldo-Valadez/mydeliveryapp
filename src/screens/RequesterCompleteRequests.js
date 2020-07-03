import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    AsyncStorage,
} from 'react-native';

export default function RequesterCompleteRequests(props) {
    const [userToken, setUserToken] = useState({
        isLogin: false,
        uid: 'empty',
        usertype: 'empty',
    });

    useEffect(() => {
        _userTokenAsync();
    }, []);

    const _userTokenAsync = async () => {
        try {
            const stringify_value = await AsyncStorage.getItem('userToken');
            if (stringify_value != null) {
                const asyncUserToken = JSON.parse(stringify_value);
                setUserToken({
                    isLogin: asyncUserToken.isLogin,
                    uid: asyncUserToken.uid,
                    usertype: asyncUserToken.usertype,
                });
                console.log('_asyncUserTokenAsync not null: ' + stringify_value);
            } else {
                console.log('_asyncUserTokenAsync null');
            }

        } catch {
            console.log('An error has ocurred');
        }
    }

    return (

        <View>
            <Text>{userToken.usertype} + {userToken.uid}</Text>
        </View>

    );
}