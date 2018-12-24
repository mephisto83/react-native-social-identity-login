'use strict';

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    WebView,
    View
} from 'react-native';

// Change these to reflect

export default class ReactNativeLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            loadedCookie: false
        };
    }

    componentWillMount() {
        this._loadInitialState();

    }
    _loadInitialState = async () => {
        this.setState({
            loggedIn: false,
            loadedCookie: true
        });
    }
    getParmFromHash(navState, parm) {
        var accessToken = null;
        var accesst = '#access_token=';
        var accessIndex = navState.url.indexOf(accesst);
        if (accessIndex !== -1) {
            var accessIndexEnd = navState.url.indexOf('&');
            accessIndex = accessIndex !== -1 ? accessIndex : navState.url.length;
            accessToken = navState.url.substring(accessIndex + accesst.length, accessIndexEnd);
        }
        console.log(`accessToken : ${accessToken}`);
        return accessToken;
    }
    onNavigationStateChange(navState) {
        // If we get redirected back to the HOME_URL we know that we are logged in. If your backend does something different than this
        // change this line.
        var accessToken = this.getParmFromHash(navState, 'access_token');
        if (accessToken) {
            this.setState({
                loggedIn: true,
                accessToken
            });
            if (this.props.onAuthentification) {
                this.props.onAuthentification(accessToken);
            }
        }
        this.setState({ loginUrl: navState.url })
    }
    getLoginView() {
        var { loginView } = this.props;
        if (loginView) {
            console.log('returning loginview')
            return loginView
        }
        return (
            <View>
                <Text>
                    Logged in.
                </Text>
            </View>
        )
    }
    getInitialView() {
        var { initialview } = this.props;
        return initialview || null;
    }
    render() {
        var { loginUrl } = this.props;
        var loginview = this.getLoginView();
        var initialview = this.getInitialView();
        // If we have completed loading the cookie choose to show Login WebView or the LoggedIn component, else just show an empty View.
        if (this.state.loadedCookie) {
            if (this.state.loggedIn) {
                return (
                    <View style={[styles.container]}>
                        {loginview}
                    </View>
                );
            }
            else {
                return (
                    <View style={[styles.container]}>
                        <WebView
                            ref={'webview'}
                            automaticallyAdjustContentInsets={false}
                            style={styles.webView}
                            source={{ uri: loginUrl }}
                            javaScriptEnabled={true}
                            onNavigationStateChange={this.onNavigationStateChange.bind(this)}
                            startInLoadingState={true}
                            scalesPageToFit={true}
                            />
                    </View>
                );
            }
        }
        else {
            return (
                <View>
                    {initialview}
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        height: 300,
        width: 200
    },
    webView: {},
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        alignSelf: 'stretch',
        alignItems: 'stretch'
    }
});
