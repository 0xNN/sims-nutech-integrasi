import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Text, SafeAreaView, Image, StatusBar } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { login } from "../actions/auth";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button, Text as Text2 } from 'react-native-elements';

function SignInScreen({ navigation }) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [emailFocus, setEmailFocus] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const auth = useSelector((state) => state.auth);
    const { errorMessageLogin } = auth;
    const dispatch = useDispatch();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content"
                backgroundColor="#fff"
            />
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                    <Image
                        style={styles.imageStyle}
                        source={require('../../assets/Logo.png')}
                    />
                    <Text2 h4>SIMS PPOB</Text2>
                </View>
            </View>
            <View style={{ alignItems: 'center', marginBottom: 50 }}>
                <Text2 h3>Masuk atau buat akun</Text2>
                <Text2 h3>untuk Memulai</Text2>
                {errorMessageLogin && <View style={{
                    alignItems: 'center',
                    marginTop: 10,
                    backgroundColor: '#ffe6e6',
                    padding: 8,
                    borderRadius: 5,
                }}>
                    <Text style={[
                        styles.errorMessage,
                        {
                            fontSize: 16,
                        }
                    ]}>{errorMessageLogin}</Text>
                </View>}
            </View>
            <View style={styles.sectionStyle}>
                <Icon
                    name='at'
                    size={18}
                    type='font-awesome'
                    color={passwordFocus ? '#afafaf' : '#a0a0a0'}
                />
                <TextInput
                    style={{ 
                        flex: 1,
                        paddingStart: 10,
                        color: '#000',
                    }}
                    placeholder="masukan email anda"
                    underlineColorAndroid="transparent"
                    keyboardType={'email-address'}
                    autoCapitalize={'none'}
                    onChangeText={(text) => {
                        setUsername(text)
                    }}
                    onFocus={() => {
                        setEmailFocus(true)
                        setPasswordFocus(false)
                    }}
                    placeholderTextColor={'#afafaf'}
                    value={username}
                />
            </View>
            <View style={{ alignItems: 'center', marginTop: 10 }}>
                <View style={styles.sectionStyle}>
                    <Icon
                        name='lock'
                        size={18}
                        type='font-awesome'
                        color={emailFocus ? '#afafaf' : '#a0a0a0'}
                    />
                    <TextInput
                        placeholder="masukan password anda"
                        onChangeText={(text) => {
                            setPassword(text)
                        }}
                        onFocus={() => {
                            setEmailFocus(false)
                            setPasswordFocus(true)
                        }}
                        secureTextEntry={!showPassword}
                        value={password}
                        autoCapitalize={'none'}
                        style={{ 
                            flex: 1, 
                            paddingStart: 10, paddingEnd: 10,
                            color: '#000',
                        }}
                        placeholderTextColor={'#afafaf'}
                        underlineColorAndroid="transparent"
                    />
                    <Icon
                        name={showPassword ? 'eye-slash' : 'eye'}
                        size={18}
                        type='font-awesome'
                        color={emailFocus ? '#afafaf' : '#a0a0a0'}
                        style={{ marginEnd: 10 }}
                        onPress={() => {
                            setShowPassword(!showPassword)
                        }}
                    />
                </View>
            </View>
            <View style={{ alignItems: 'center', marginTop: 50, flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                    <Button
                        loading={auth.loggingIn}
                        onPress={() => dispatch(login(username, password))}
                        title="Masuk"
                        buttonStyle={{ backgroundColor: '#f42619', borderRadius: 5, padding: 12 }}
                    />
                </View>
            </View>
            <View style={{ alignItems: 'center', marginTop: 20, flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                    <Text2 style={{ textAlign: 'center' }}>
                        belum punya akun? registrasi <Text2 style={{ textAlign: 'center', color: '#f42619', fontWeight: 'bold' }} onPress={() => navigation.replace('SignUp')}>di sini</Text2>
                    </Text2>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    submitButton: {
        width: '96%',
    },
    errorMessage: {
        color: '#ff0000'
    },
    sectionStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderColor: '#a0a0a0',
        height: 50,
        borderRadius: 5,
        paddingStart: 15,
        marginTop: 10,
    },
    imageStyle: {
        padding: 10,
        margin: 5,
        height: 32,
        width: 32,
        resizeMode: 'stretch',
        alignItems: 'center',
    },
});

export default SignInScreen;