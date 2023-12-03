import React from 'react';

import {
    View,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Text,
    Pressable,
    StatusBar,
    Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { userService } from '../services/userService';
import { Card, Overlay } from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from 'react-native-elements';
import { changeBalance, logout } from '../actions/auth';

const TopUpScreen = ({ navigation }) => {
    const auth = useSelector(state => state.auth);

    if (!auth.user) {
        return null;
    }

    const { token } = auth;
    const dispatch = useDispatch();
    const [dataBalance, setDataBalance] = React.useState(null);
    const [nominal, setNominal] = React.useState(null);
    const [focus, setFocus] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [visible, setVisible] = React.useState(false);
    const [visibleSuccess, setVisibleSuccess] = React.useState(false);
    const [visibleConfirm, setVisibleConfirm] = React.useState(false);
    const [message, setMessage] = React.useState("Top Up berhasil");

    const balance = async () => {
        await userService.balance(token).then(async (res) => {
            const { balance } = res.data;
            setDataBalance(balance);
        }).catch((err) => {
            if (err.response.status === 401) {
                dispatch(logout());
            }
        });
    };

    const topup = async () => {
        setLoading(true);
        const nom = parseInt(nominal.replace(/\./g, ''));
        if (nom < 10000 || nom > 1000000) {
            setVisible(true);
            setLoading(false);
            return;
        }
        await userService.topup(token, { top_up_amount: nom }).then(async (res) => {
            const { balance } = res.data.data
            const { message } = res.data
            setVisibleSuccess(true);
            setDataBalance(balance);
            setLoading(false);
            setMessage(message);
        }).catch((err) => {
            setLoading(false);
            if (err.response.status === 401) {
                dispatch(logout());
            }
        });
    };

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    const toggleOverlaySuccess = () => {
        setVisibleSuccess(!visibleSuccess);
    };

    const toggleOverlayConfirm = () => {
        setVisibleConfirm(!visibleConfirm);
    };

    const confirmAlert = () => {
        return <Overlay isVisible={visibleConfirm} onBackdropPress={toggleOverlayConfirm} overlayStyle={{
            width: '90%',
            height: 'auto',
            borderRadius: 10,
            padding: 20,
        }}>
            <Image source={require('../../assets/Logo.png')} style={{ width: 60, height: 60, alignSelf: 'center', marginTop: 10 }} />
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
            }}>
                <Text style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: '#0d0d0d',
                    textAlign: 'center',
                }}>
                    Top Up senilai
                </Text>
            </View>
            <Text style={{
                marginTop: 10,
                fontSize: 32,
                fontWeight: 'bold',
                color: '#0c0c0c',
                textAlign: 'center',
            }}>
                Rp{nominal} ?
            </Text>
            <Pressable onPress={() => {
                toggleOverlayConfirm();
                topup();
            }} style={{ marginTop: 40 }}>
                <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#f42619',
                    textAlign: 'center',
                }}>
                    Ya, Lanjutkan TopUp
                </Text>
            </Pressable>
            <Pressable onPress={() => {
                toggleOverlayConfirm();
            }} style={{ marginTop: 20, marginBottom: 20 }}>
                <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#C6C6C6',
                    textAlign: 'center',
                }}>
                    Batalkan
                </Text>
            </Pressable>
        </Overlay>
    }

    const successAlert = () => {
        return <Overlay isVisible={visibleSuccess} onBackdropPress={toggleOverlaySuccess} overlayStyle={{
            width: '80%',
            height: 'auto',
            borderRadius: 20,
            padding: 20,
        }}>
            <Icon
                name='check-circle'
                size={80}
                type='font-awesome'
                color='#00BB78'
                style={{
                    alignSelf: 'center',
                    marginTop: 10,
                    marginBottom: 10,
                }}
            />
            <Text style={{
                fontSize: 24,
                fontWeight: '600',
                color: '#00BB78',
                textAlign: 'center',
            }}>
                Successfully
            </Text>
            <Text style={{
                marginTop: 10,
                fontSize: 20,
                fontWeight: '400',
                color: '#0c0c0c',
                textAlign: 'center',
            }}>
                {message}
            </Text>
            <Pressable onPress={() => {
                toggleOverlayConfirm();
                dispatch(changeBalance(dataBalance));
                navigation.navigate({
                    name: 'HomeS',
                    params: { balance: true },
                    merge: true,
                })
            }} style={{ marginTop: 40, marginBottom: 20 }}>
                <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#f42619',
                    textAlign: 'center',
                }}>
                    Kembali ke Beranda
                </Text>
            </Pressable>
        </Overlay>
    }

    React.useEffect(() => {
        balance();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content"
                backgroundColor="#fff"
            />
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 15,
                marginBottom: 15,
            }}>
                <TouchableOpacity onPress={() => {
                    dispatch(changeBalance(dataBalance));
                    navigation.navigate({
                        name: 'HomeS',
                        params: { balance: true },
                        merge: true,
                    });
                }} style={{
                    alignItems: 'center',
                    flex: 2,
                }}>
                    <View style={{
                        marginLeft: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <MaterialCommunityIcons name="arrow-left" color={"black"} size={18} />
                        <Text style={{ fontSize: 18, color: 'black', marginLeft: 10 }}>Kembali</Text>
                    </View>
                </TouchableOpacity>
                <View style={{
                    flex: 3,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Text style={{ fontSize: 18, color: 'black', fontWeight: 'bold' }}>Top Up</Text>
                </View>
                <View style={{
                    flex: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Text style={{ fontSize: 18, color: 'white' }}></Text>
                </View>
            </View>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Card.Image
                    source={require('../../assets/BackgroundSaldo.png')}
                    style={{
                        marginTop: 10,
                        marginBottom: 20,
                        marginStart: 20,
                        marginEnd: 20,
                        borderRadius: 16,
                        height: 110,
                    }}
                >
                    <View style={{
                        padding: 20,
                    }}>
                        <Text style={{
                            color: '#fff',
                            fontSize: 18,
                            fontWeight: 'bold',
                        }}>Saldo anda</Text>
                    </View>
                    <View style={{
                        paddingStart: 20,
                        paddingEnd: 20,
                    }}>
                        <Text style={{
                            color: '#fff',
                            fontSize: 24,
                            fontWeight: 'bold',
                        }}>Rp {dataBalance == null ? '-' : dataBalance.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</Text>
                    </View>
                </Card.Image>
                <View style={{
                    marginTop: 30,
                    marginStart: 20,
                    marginEnd: 20,
                }}>
                    <Text style={{
                        fontSize: 18,
                        fontWeight: '400',
                        color: '#000',
                    }}>Silahkan masukan</Text>
                </View>
                <View style={{
                    marginTop: 4,
                    marginBottom: 40,
                    marginStart: 20,
                    marginEnd: 20,
                }}>
                    <Text style={{
                        fontSize: 22,
                        fontWeight: '600',
                        color: '#000',
                    }}>nominal Top Up</Text>
                </View>
                <View style={{
                    marginStart: 20,
                    marginEnd: 20,
                }}>
                    <View style={styles.sectionStyle}>
                        <Icon
                            name='credit-card'
                            size={18}
                            type='font-awesome'
                            color={!focus || nominal == null ? '#afafaf' : '#000'}
                        />
                        <TextInput
                            style={{ flex: 1, paddingStart: 10, color: '#000', }}
                            placeholder="masukan nominal Top Up"
                            underlineColorAndroid="transparent"
                            keyboardType={'numeric'}
                            onChangeText={(text) => {
                                if (text == "") {
                                    setNominal(null);
                                    return;
                                }
                                let formattedText = Intl.NumberFormat('id-ID').format(parseInt(text.replace(/\./g, '')));
                                setNominal(formattedText);
                            }}
                            onFocus={() => {
                                setFocus(true)
                            }}
                            onBlur={() => {
                                setFocus(false)
                            }}
                            placeholderTextColor={'#afafaf'}
                            value={nominal}
                        />
                    </View>
                </View>
                <View style={{
                    marginTop: 30,
                    marginStart: 20,
                    marginEnd: 20,
                }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <Pressable
                            onPress={() => {
                                setNominal("10.000");
                            }}
                            style={({ pressed }) => [{
                                flex: 1,
                                backgroundColor: pressed ? '#f0f0f0' : '#fff',
                                borderWidth: 0.5,
                                borderColor: '#a0a0a0',
                                height: 45,
                                borderRadius: 5,
                                marginEnd: 10,
                            }]}>
                            <Text style={{
                                fontSize: 14,
                                fontWeight: '400',
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                flex: 1,
                                color: '#000',
                            }}>
                                Rp10.000
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => {
                                setNominal("20.000");
                            }}
                            style={({ pressed }) => [{
                                flex: 1,
                                backgroundColor: pressed ? '#f0f0f0' : '#fff',
                                borderWidth: 0.5,
                                borderColor: '#a0a0a0',
                                height: 45,
                                borderRadius: 5,
                                marginEnd: 10,
                            }]}>
                            <Text style={{
                                fontSize: 14,
                                fontWeight: '400',
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                flex: 1,
                                color: '#000',
                            }}>
                                Rp20.000
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => {
                                setNominal("50.000");
                            }}
                            style={({ pressed }) => [{
                                flex: 1,
                                backgroundColor: pressed ? '#f0f0f0' : '#fff',
                                borderWidth: 0.5,
                                borderColor: '#a0a0a0',
                                height: 45,
                                borderRadius: 5,
                            }]}>
                            <Text style={{
                                fontSize: 14,
                                fontWeight: '400',
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                flex: 1,
                                color: '#000',
                            }}>
                                Rp50.000
                            </Text>
                        </Pressable>
                    </View>
                </View>
                <View style={{
                    marginTop: 20,
                    marginStart: 20,
                    marginEnd: 20,
                }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <Pressable
                            onPress={() => {
                                setNominal("100.000");
                            }}
                            style={({ pressed }) => [{
                                flex: 1,
                                backgroundColor: pressed ? '#f0f0f0' : '#fff',
                                borderWidth: 0.5,
                                borderColor: '#a0a0a0',
                                height: 45,
                                borderRadius: 5,
                                marginEnd: 10,
                            }]}>
                            <Text style={{
                                fontSize: 14,
                                fontWeight: '400',
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                flex: 1,
                                color: '#000',
                            }}>
                                Rp100.000
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => {
                                setNominal("250.000");
                            }}
                            style={({ pressed }) => [{
                                flex: 1,
                                backgroundColor: pressed ? '#f0f0f0' : '#fff',
                                borderWidth: 0.5,
                                borderColor: '#a0a0a0',
                                height: 45,
                                borderRadius: 5,
                                marginEnd: 10,
                            }]}>
                            <Text style={{
                                fontSize: 14,
                                fontWeight: '400',
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                flex: 1,
                                color: '#000',
                            }}>
                                Rp250.000
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => {
                                setNominal("500.000");
                            }}
                            style={({ pressed }) => [{
                                flex: 1,
                                backgroundColor: pressed ? '#f0f0f0' : '#fff',
                                borderWidth: 0.5,
                                borderColor: '#a0a0a0',
                                height: 45,
                                borderRadius: 5,
                            }]}>
                            <Text style={{
                                fontSize: 14,
                                fontWeight: '400',
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                flex: 1,
                                color: '#000',
                            }}>
                                Rp500.000
                            </Text>
                        </Pressable>
                    </View>
                </View>
                <View style={{ alignItems: 'center', marginTop: 50, marginEnd: 20, marginStart: 20, flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <Button
                            loading={loading}
                            onPress={() => {
                                setVisibleConfirm(true);
                            }}
                            disabled={nominal == null || nominal == ""}
                            title="Top Up"
                            titleStyle={{ color: '#fff', fontSize: 20 }}
                            buttonStyle={{ backgroundColor: '#f42619', borderRadius: 5, padding: 12 }}
                        />
                    </View>
                </View>
                <Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={{
                    width: '80%',
                    height: 'auto',
                    borderRadius: 20,
                    padding: 20,
                }}>
                    <Icon
                        name='times-circle'
                        size={80}
                        type='font-awesome'
                        color='#f42619'
                        style={{
                            alignSelf: 'center',
                            marginTop: 10,
                            marginBottom: 10,
                        }}
                    />
                    <Text style={{
                        fontSize: 24,
                        fontWeight: '600',
                        color: '#f42619',
                        textAlign: 'center',
                    }}>
                        Perhatian!
                    </Text>
                    <Text style={{
                        marginTop: 10,
                        fontSize: 20,
                        fontWeight: '400',
                        color: '#0c0c0c',
                        textAlign: 'center',
                    }}>
                        Nominal Top Up minimal Rp10.000 dan maksimal Rp1.000.000
                    </Text>
                    <View style={{ alignItems: 'center', marginTop: 50, marginEnd: 20, marginStart: 20, flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                            <Button
                                onPress={toggleOverlay}
                                title="OKE"
                                titleStyle={{ color: '#f42619', fontWeight: 'bold' }}
                                buttonStyle={{ backgroundColor: '#FFD8D6', borderRadius: 5, padding: 12 }}
                            />
                        </View>
                    </View>
                </Overlay>
                {successAlert()}
                {confirmAlert()}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'start',
        backgroundColor: '#fff',
    },
    errorMessage: {
        color: '#ff0000',
    },
    imageStyle: {
        padding: 10,
        margin: 5,
        height: 32,
        width: 32,
        resizeMode: 'stretch',
        alignItems: 'center',
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
});

export default TopUpScreen;