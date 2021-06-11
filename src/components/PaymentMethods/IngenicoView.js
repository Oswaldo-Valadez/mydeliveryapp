import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { cloud_function_server_url } from '../../common/serverUrl'

export default function IngenicoView(props) {

    useEffect(() => {
        fetch(cloud_function_server_url + 'create_hosted_checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                setGatewayResponse({
                    partialRedirectUrl: responseJson.res.body.partialRedirectUrl,
                    isSuccess: responseJson.res.isSuccess,
                    RETURNMAC: responseJson.res.body.RETURNMAC,
                });
            })
            .catch((error) => {
                console.error("error: " + error);
            });
    }, []);

    const [gatewayResponse, setGatewayResponse] = useState({
        partialRedirectUrl: "",
        isSuccess: false,
        RETURNMAC: "",
    });

    if (gatewayResponse.isSuccess) {
        var checkout_url = "https://payment." + gatewayResponse.partialRedirectUrl;
        return (
            <WebView
                cacheEnabled={false}
                //ref={webView => (this.webView = webView)}
                source={{ uri: checkout_url }}
                originWhitelist={['*']}
                javaScriptEnabled={true}
                //onMessage={this.onMessage}
            />
        );
    }
    return (
        <View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator size="large" color="red" />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
});