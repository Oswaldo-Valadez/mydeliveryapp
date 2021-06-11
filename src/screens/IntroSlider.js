import React, { useEffect, useState } from 'react';
import * as Icon from '@expo/vector-icons';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';

import { colors } from '../common/theme';
import I18n from '../common/lang/config';
import Image from 'react-native-remote-svg';

export default function IntroSlider(props) {
    const usertype = props.route.params.usertype;

    const slides_requester = [
        {
            key: 1,
            title: I18n.t('slider_requester_title_one'),
            text: I18n.t('slider_requester_text_one'),
            image: require('../../assets/images/slider-requester-1.svg'),
            backgroundColor: '#800B19',
        },
        {
            key: 2,
            title: I18n.t('slider_requester_title_two'),
            text: I18n.t('slider_requester_text_two'),
            image: require('../../assets/images/slider-requester-2.svg'),
            backgroundColor: '#CC1228',
        },
        {
            key: 3,
            title: I18n.t('slider_requester_title_three'),
            text: I18n.t('slider_requester_text_three'),
            image: require('../../assets/images/slider-requester-3.svg'),
            backgroundColor: '#80323B',
        }
    ];

    const slides_provider = [
        {
            key: 1,
            title: I18n.t('slider_provider_title_one'),
            text: I18n.t('slider_provider_text_one'),
            image: require('../../assets/images/slider-provider-1.svg'),
            backgroundColor: '#800B19',
        },
        {
            key: 2,
            title: I18n.t('slider_provider_title_two'),
            text: I18n.t('slider_provider_text_two'),
            image: require('../../assets/images/slider-provider-2.svg'),
            backgroundColor: '#80323B',
        },
        {
            key: 3,
            title: I18n.t('slider_provider_title_three'),
            text: I18n.t('slider_provider_text_three'),
            image: require('../../assets/images/slider-provider-3.svg'),
            backgroundColor: '#CC1228',
        }
    ];

    const _renderItem = ({ item }) => {
        return (
            <View style={{ flex: 1, backgroundColor: item.backgroundColor, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.title}>{item.title}</Text>
                <Image style={{ width: '90%', flex: 2, marginLeft: '2.5%' }} source={item.image} />
                <Text style={styles.text}>{item.text}</Text>
            </View>
        );
    }

    const _renderButton = (label) => {
        return (
            <View style={styles.buttonCircle}>
                <Icon.Ionicons
                    name={label}
                    color={colors.PRIMARY_COLOR}
                    size={24}
                />
            </View>
        );
    };

    return (
        <AppIntroSlider
            data={usertype == 'provider' ? slides_provider : slides_requester}
            renderItem={_renderItem}
            renderDoneButton={() => _renderButton('md-checkmark')}
            renderNextButton={() => _renderButton('md-arrow-round-forward')}
            renderSkipButton={() => _renderButton('ios-skip-forward')}
            renderPrevButton={() => _renderButton('md-arrow-round-back')}
            showSkipButton={true}
            showPrevButton={true}
            dotStyle={{ backgroundColor: colors.WHITE.default }}
            activeDotStyle={{ borderColor: colors.WHITE.default, borderWidth: 1.5 }}
            onDone={() => props.navigation.navigate('LoginScreen', { usertype: usertype })}
            onSkip={() => props.navigation.navigate('LoginScreen', { usertype: usertype })}
        />
    );
}

const styles = StyleSheet.create({
    buttonCircle: {
        width: 40,
        height: 40,
        backgroundColor: colors.WHITE.default,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        flex: 1,
        color: colors.WHITE.default,
        fontSize: 36,
        textAlign: 'center',
        textAlignVertical: 'center',
        marginHorizontal: 32,
        fontFamily: 'Pacifico-Regular',
    },
    text: {
        flex: 1,
        color: colors.WHITE.default,
        fontSize: 20,
        textAlign: 'center',
        marginHorizontal: 32,
        fontFamily: 'OpenSans-Regular',
    }
});