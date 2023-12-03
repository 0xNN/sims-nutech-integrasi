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
    Image,
    StatusBar,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { userService } from '../services/userService';
import { Card, Overlay } from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from 'react-native-elements';
import { changeBalance, logout } from '../actions/auth';

const PaymentScreen = ({ navigation, route }) => {
    const auth = useSelector(state => state.auth);

    if (!auth.user) {
        return null;
    }

    const { token } = auth;
    const { service } = route.params;
    const dispatch = useDispatch();
    const [dataBalance, setDataBalance] = React.useState(null);
    const [nominal, setNominal] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [visible, setVisible] = React.useState(false);
    const [visibleSuccess, setVisibleSuccess] = React.useState(false);
    const [visibleConfirm, setVisibleConfirm] = React.useState(false);
    const [message, setMessage] = React.useState("Pembayaran berhasil");

    const balance = async () => {
        await userService.balance(token).then(async (res) => {
            const { balance } = res.data;
            setDataBalance(balance);
            dispatch(changeBalance(balance));
        }).catch((err) => {
            if (err.response.status == 401) {
                dispatch(logout());
                return;
            }
        });
    };

    const bayar = async () => {
        setLoading(true);
        await userService.transaction(token, { service_code: service.service_code }).then(async (res) => {
            const { message } = res.data
            await balance();
            dispatch(changeBalance(dataBalance));
            setLoading(false);
            setMessage(message);
            setVisibleSuccess(true);
        }).catch((err) => {
            if (err.response.status == 401) {
                dispatch(logout());
                return;
            }
            setMessage(err.response.data.message);
            setVisible(true);
            setLoading(false);
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
                    Beli
                </Text>
                <Image source={{ uri: service.service_icon }} style={{ width: 25, height: 25, alignSelf: 'center', marginEnd: 5, marginStart: 5 }} />
                <Text style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: '#0d0d0d',
                    textAlign: 'center',
                }}>
                    {service.service_name} senilai
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
                bayar();
            }} style={{ marginTop: 40 }}>
                <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#f42619',
                    textAlign: 'center',
                }}>
                    Ya, Lanjutkan Bayar
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
            width: '90%',
            height: 'auto',
            borderRadius: 10,
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
                {message}
            </Text>
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
                    Pembayaran {service.service_name} sebesar
                </Text>
            </View>
            <Text style={{
                marginTop: 10,
                fontSize: 32,
                fontWeight: 'bold',
                color: '#0c0c0c',
                textAlign: 'center',
            }}>
                Rp{nominal}
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

    const failedAlert = () => {
        return <Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={{
            width: '90%',
            height: 'auto',
            borderRadius: 10,
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
                {message}
            </Text>
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
                    Pembayaran {service.service_name} sebesar
                </Text>
            </View>
            <Text style={{
                marginTop: 10,
                fontSize: 32,
                fontWeight: 'bold',
                color: '#0c0c0c',
                textAlign: 'center',
            }}>
                Rp{nominal}
            </Text>
            <Pressable onPress={() => {
                toggleOverlayConfirm();
                navigation.navigate('HomeS');
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
        setNominal(service.service_tariff.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'));
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
                    navigation.navigate('HomeS');
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
                    <Text style={{ fontSize: 18, color: 'black', fontWeight: 'bold' }}>PemBayaran</Text>
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
                    }}>PemBayaran</Text>
                </View>
                <View style={{
                    marginTop: 15,
                    marginBottom: 40,
                    marginStart: 20,
                    marginEnd: 20,
                    flexDirection: 'row',
                }}>
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Image source={{ uri: service.service_icon }} style={{ width: 30, height: 30 }} />
                    </View>
                    <Text style={{
                        fontSize: 22,
                        fontWeight: '600',
                        color: '#000',
                        marginStart: 10,
                    }}>{service.service_name}</Text>
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
                            color='#1B1C1C'
                        />
                        <TextInput
                            style={{ flex: 1, paddingStart: 10, paddingEnd: 10, color: '#1B1C1C' }}
                            underlineColorAndroid="transparent"
                            keyboardType={'numeric'}
                            editable={false}
                            value={nominal}
                        />
                    </View>
                </View>
                <View style={{ alignItems: 'center', marginTop: 150, marginEnd: 20, marginStart: 20, flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <Button
                            loading={loading}
                            onPress={() => {
                                setVisibleConfirm(true);
                            }}
                            disabled={nominal == null || nominal == ""}
                            title="Bayar"
                            titleStyle={{ color: '#fff', fontSize: 20 }}
                            buttonStyle={{ backgroundColor: '#f42619', borderRadius: 5, padding: 12 }}
                        />
                    </View>
                </View>
                {failedAlert()}
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

export default PaymentScreen;