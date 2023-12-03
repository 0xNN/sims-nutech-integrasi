import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Text, SafeAreaView, Image, ScrollView, StatusBar } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { registrasi } from "../actions/auth";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button, Text as Text2 } from 'react-native-elements';

function SignUpScreen({ navigation }) {

    const [email, setEmail] = useState('');
    const [namaDepan, setNamaDepan] = useState('');
    const [namaBelakang, setNamaBelakang] = useState('');
    const [password, setPassword] = useState('');
    const [konfirmasiPassword, setKonfirmasiPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showKonfirmasiPassword, setShowKonfirmasiPassword] = useState(false);
    const [disabledButton, setDisabledButton] = useState(true);
    const auth = useSelector((state) => state.auth);
    const { errorMessage, successMessage } = auth;
    const dispatch = useDispatch();

    const valid = async () => {
        if (email.length > 0 && namaDepan.length > 0 && namaBelakang.length > 0 && password.length > 0 && konfirmasiPassword.length > 0 && password == konfirmasiPassword) {
            setDisabledButton(false)
        } else {
            setDisabledButton(true)
        }
    }

    useEffect(() => {
        valid()
    }, [email, namaDepan, namaBelakang, password, konfirmasiPassword])

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content"
                backgroundColor="#fff"
            />
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                        <Image
                            style={styles.imageStyle}
                            source={require('../../assets/Logo.png')}
                        />
                        <Text2 h4>SIMS PPOB</Text2>
                    </View>
                </View>
                <View style={{ alignItems: 'center', marginBottom: 40 }}>
                    <Text2 h3>Lengkapi data untuk</Text2>
                    <Text2 h3>membuat akun</Text2>
                    {errorMessage && <View style={{ 
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
                        ]}>{errorMessage}</Text>
                    </View>}
                    {successMessage && <View style={{ 
                        alignItems: 'center',
                        marginTop: 10,
                        backgroundColor: '#e6ffe6',
                        padding: 8,
                        borderRadius: 5,
                    }}>
                        <Text style={[
                            styles.successMessage,
                            {
                                fontSize: 16,
                            }
                        ]}>{successMessage}</Text>
                    </View>}
                    
                </View>
                <View style={styles.sectionStyle}>
                    <Icon
                        name='at'
                        size={18}
                        type='font-awesome'
                        color='#afafaf'
                    />
                    <TextInput
                        style={{ flex: 1, paddingStart: 10, color: '#000', }}
                        placeholder="masukan email anda"
                        underlineColorAndroid="transparent"
                        keyboardType={'email-address'}
                        autoCapitalize={'none'}
                        onChangeText={(text) => {
                            setEmail(text)
                            valid()
                        }}
                        placeholderTextColor={'#afafaf'}
                        value={email}
                    />
                </View>
                {email == '' ? <View style={{ alignItems: 'start' }}><Text2 style={{ color: '#f42619' }}>email tidak boleh kosong</Text2></View> : null}
                <View style={{ alignItems: 'center', marginTop: 10 }}>
                    <View style={styles.sectionStyle}>
                        <Icon
                            name='user'
                            size={18}
                            type='font-awesome'
                            color='#afafaf'
                        />
                        <TextInput
                            style={{ flex: 1, paddingStart: 10, color: '#000', }}
                            placeholder="nama depan"
                            underlineColorAndroid="transparent"
                            keyboardType={'default'}
                            autoCapitalize={'none'}
                            placeholderTextColor={'#afafaf'}
                            onChangeText={(text) => {
                                setNamaDepan(text)
                                valid()
                            }}
                            value={namaDepan}
                        />
                    </View>
                </View>
                {namaDepan == '' ? <View style={{ alignItems: 'start' }}><Text2 style={{ color: '#f42619' }}>nama depan tidak boleh kosong</Text2></View> : null}
                <View style={{ alignItems: 'center', marginTop: 10 }}>
                    <View style={styles.sectionStyle}>
                        <Icon
                            name='user'
                            size={18}
                            type='font-awesome'
                            color='#afafaf'
                        />
                        <TextInput
                            style={{ flex: 1, paddingStart: 10, color: '#000', }}
                            placeholder="nama belakang"
                            underlineColorAndroid="transparent"
                            keyboardType={'default'}
                            autoCapitalize={'none'}
                            placeholderTextColor={'#afafaf'}
                            onChangeText={(text) => {
                                setNamaBelakang(text)
                                valid()
                            }}
                            value={namaBelakang}
                        />
                    </View>
                </View>
                {namaBelakang == '' ? <View style={{ alignItems: 'start' }}><Text2 style={{ color: '#f42619' }}>nama belakang tidak boleh kosong</Text2></View> : null}
                <View style={{ alignItems: 'center', marginTop: 10, color: '#000', }}>
                    <View style={styles.sectionStyle}>
                        <Icon
                            name='lock'
                            size={18}
                            type='font-awesome'
                            color='#afafaf'
                        />
                        <TextInput
                            placeholder="buat password"
                            onChangeText={(text) => {
                                setPassword(text)
                                valid()
                            }}
                            secureTextEntry={!showPassword}
                            value={password}
                            autoCapitalize={'none'}
                            style={{ flex: 1, paddingStart: 10, paddingEnd: 10, color: '#000', }}
                            placeholderTextColor={'#afafaf'}
                            underlineColorAndroid="transparent"
                        />
                        <Icon
                            name={showPassword ? 'eye-slash' : 'eye'}
                            size={18}
                            type='font-awesome'
                            color='#afafaf'
                            style={{ marginEnd: 10 }}
                            onPress={() => {
                                setShowPassword(!showPassword)
                            }}
                        />
                    </View>
                </View>
                {password == '' ?
                    <View style={{ alignItems: 'start' }}><Text2 style={{ color: '#f42619' }}>password tidak boleh kosong</Text2></View>
                    : password.length < 8 ?
                        <View style={{ alignItems: 'start' }}><Text2 style={{ color: '#f42619' }}>password minimal 8 karakter</Text2></View> : null}
                <View style={{ alignItems: 'center', marginTop: 10 }}>
                    <View style={styles.sectionStyle}>
                        <Icon
                            name='lock'
                            size={18}
                            type='font-awesome'
                            color='#afafaf'
                        />
                        <TextInput
                            placeholder="konfirmasi password"
                            onChangeText={async (text) => {
                                setKonfirmasiPassword(text)
                                await valid()
                            }}
                            secureTextEntry={!showKonfirmasiPassword}
                            value={konfirmasiPassword}
                            autoCapitalize={'none'}
                            style={{ flex: 1, paddingStart: 10, paddingEnd: 10, color: '#000', }}
                            placeholderTextColor={'#afafaf'}
                            underlineColorAndroid="transparent"
                        />
                        <Icon
                            name={showKonfirmasiPassword ? 'eye-slash' : 'eye'}
                            size={18}
                            type='font-awesome'
                            color='#afafaf'
                            style={{ marginEnd: 10 }}
                            onPress={() => {
                                setShowKonfirmasiPassword(!showKonfirmasiPassword)
                            }}
                        />
                    </View>
                </View>
                {konfirmasiPassword == '' ?
                    <View style={{ alignItems: 'start' }}><Text2 style={{ color: '#f42619' }}>konfirmasi password tidak boleh kosong</Text2></View>
                    : konfirmasiPassword != password ?
                        <View style={{ alignItems: 'start' }}><Text2 style={{ color: '#f42619' }}>konfirmasi password tidak sama</Text2></View> : null}
                <View style={{ alignItems: 'center', marginTop: 50, flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <Button
                            loading={auth.loggingIn}
                            onPress={() => dispatch(registrasi({
                                email: email,
                                first_name: namaDepan,
                                last_name: namaBelakang,
                                password: password,
                            }))}
                            title="Registrasi"
                            disabled={disabledButton}
                            buttonStyle={{ backgroundColor: '#f42619', borderRadius: 5, padding: 12 }}
                        />
                    </View>
                </View>
                <View style={{ alignItems: 'center', marginTop: 20, flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <Text2 style={{ textAlign: 'center' }}>
                            sudah punya akun? login <Text2 style={{ textAlign: 'center', color: '#f42619', fontWeight: 'bold' }} onPress={() => navigation.replace('SignIn')}>di sini</Text2>
                        </Text2>
                    </View>
                </View>
            </ScrollView>
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
    successMessage: {
        color: '#189118'
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

export default SignUpScreen;