import React from 'react';

import {
    View,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Pressable,
    StatusBar,
    Text,
    Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../actions/auth';
import { userService } from '../services/userService';
import { Text as Text2 } from 'react-native-elements';
import { Card } from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Avatar } from 'react-native-elements';

const HomeScreen = ({ navigation }) => {
    const auth = useSelector(state => state.auth);

    if (!auth.user) {
        return null;
    }

    const { token } = auth;
    const dispatch = useDispatch();
    const [dataProfile, setDataProfile] = React.useState(null);
    const [dataBalance, setDataBalance] = React.useState(null);
    const [dataServices, setDataServices] = React.useState([]);
    const [dataBanner, setDataBanner] = React.useState([]);
    const [showSaldo, setShowSaldo] = React.useState(false);

    const profile = async () => {
        await userService.profile(token).then(async (res) => {
            setDataProfile(res.data);
        }).catch(async (err) => {
            if (err.response.status === 401) {
                dispatch(logout());
            }
        });
    };

    const balance = async () => {
        await userService.balance(token).then(async (res) => {
            const { balance } = res.data;
            setDataBalance(balance);
        }).catch(async (err) => {
            if (err.response.status === 401) {
                dispatch(logout());
            }
        });
    };

    const services = async () => {
        await userService.services(token).then(async (res) => {
            setDataServices(res.data);
        }).catch(async (err) => {
            if (err.response.status === 401) {
                dispatch(logout());
            }
        });
    };

    const banner = async () => {
        await userService.banner(token).then(async (res) => {
            setDataBanner(res.data);
        }).catch(async (err) => {
            if (err.response.status === 401) {
                dispatch(logout());
            }
        });
    };

    React.useEffect(() => {
        profile();
        balance();
        services();
        banner();
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
                marginBottom: 10,
            }}>
                <View style={{
                    marginLeft: 15,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <Image
                        style={styles.imageStyle}
                        source={require('../../assets/Logo.png')}
                    />
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>SIMS PPOB</Text>
                </View>
                <View style={{ marginRight: 20, }}>
                    <Avatar
                        size={32}
                        rounded
                        source={
                            dataProfile != null ? dataProfile.profile_image.includes('null') ? require('../../assets/ProfilePhoto-1.png') 
                            : 
                            { 
                                uri: dataProfile.profile_image 
                            } : require('../../assets/ProfilePhoto-1.png')
                        }
                        containerStyle={{
                            borderColor: '#CACACA',
                            borderStyle: 'solid',
                            borderWidth: 1,
                        }}
                    />
                </View>
            </View>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{
                    paddingTop: 20,
                    paddingStart: 20,
                    paddingEnd: 20,
                }}>
                    <Text2 style={{
                        fontSize: 18,
                    }}>Selamat Datang,</Text2>
                    <Text2
                        h4
                        style={{
                        }}
                    >
                        {`${dataProfile != null ? dataProfile.first_name : '-'}`} {`${dataProfile != null ? dataProfile.last_name : '-'}`}
                    </Text2>
                </View>
                <Card.Image
                    source={require('../../assets/BackgroundSaldo.png')}
                    style={{
                        marginTop: 30,
                        marginBottom: 20,
                        marginStart: 20,
                        marginEnd: 20,
                        borderRadius: 16
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
                        {showSaldo ? (
                            <Text style={{
                                color: '#fff',
                                fontSize: 24,
                                fontWeight: 'bold',
                            }}>Rp {dataBalance == null ? '-' : dataBalance.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</Text>
                        ) : (
                            <Text style={{
                                color: '#fff',
                                fontSize: 24,
                                fontWeight: 'bold',
                            }}>Rp {'\u25CF'} {'\u25CF'} {'\u25CF'} {'\u25CF'} {'\u25CF'} {'\u25CF'} {'\u25CF'}</Text>
                        )}
                    </View>
                    <View style={{
                        padding: 20,
                        alignContent: 'start',
                        alignItems: 'start',
                    }}>
                        <Text style={{
                            color: '#fff',
                            fontSize: 14,
                        }}>Lihat saldo <Icon
                                name={showSaldo ? 'eye-slash' : 'eye'}
                                size={14}
                                type='font-awesome'
                                color='white'
                                onPress={() => {
                                    setShowSaldo(!showSaldo);
                                }}
                            />
                        </Text>
                    </View>
                </Card.Image>
                <View style={{
                    marginTop: 20,
                    marginStart: 20,
                    marginEnd: 20,
                    // flex: 1,
                }}>
                    <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                    }}>
                        {dataServices.map((item, index) => {
                            return (
                                <Pressable
                                    onPress={() => {
                                        navigation.navigate('Payment', {
                                            service: item,
                                        });
                                    }}
                                    style={({ pressed }) => [{
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                        flexBasis: '16%',
                                        marginBottom: 30,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: pressed ? '#f0f0f0' : '#fff',
                                    }]}
                                    key={"view" + index}>
                                    <Card.Image
                                        source={{
                                            uri: item.service_icon,
                                        }}
                                        key={"image" + index}
                                        style={{
                                            marginTop: 0,
                                            width: 46,
                                            height: 46,
                                            borderRadius: 4,
                                        }}
                                    ></Card.Image>
                                    <View style={{
                                        justifyContent: 'center',
                                        alignContent: 'center',
                                        alignItems: 'center',
                                        textAlign: 'center',

                                    }}>
                                        <Text2 style={{
                                            color: '#000',
                                            fontSize: 10,
                                            fontWeight: 'bold',
                                            textAlign: 'center',
                                            marginTop: 5,
                                        }}>{item.service_name}</Text2>
                                    </View>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>
                <View style={{
                    marginTop: 15,
                    marginStart: 20,
                    marginEnd: 20,
                    marginBottom: 15,
                }}>
                    <Text2 style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                    }}>Temukan promo menarik</Text2>
                </View>
                <View style={{
                    marginBottom: 15,
                }}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        {dataBanner.map((item, index) => {
                            return (
                                <Card.Image
                                    source={{
                                        uri: item.banner_image,
                                    }}
                                    key={"imageBanner" + index}
                                    style={{
                                        marginTop: 0,
                                        width: 290,
                                        height: 130,
                                        borderRadius: 10,
                                        marginEnd: index == dataBanner.length - 1 ? 20 : 0,
                                        marginStart: 20,
                                    }}
                                ></Card.Image>
                            );
                        })}
                    </ScrollView>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 20,
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
});

export default HomeScreen;
