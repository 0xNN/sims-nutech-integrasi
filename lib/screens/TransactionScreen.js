import React from 'react';

import {
    View,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Text,
    Pressable,
    StatusBar,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { userService } from '../services/userService';
import { Card } from '@rneui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { logout } from '../actions/auth';
import 'moment/locale/id';

const TransactionScreen = ({ navigation }) => {
    const auth = useSelector(state => state.auth);

    if (!auth.user) {
        return null;
    }

    const { token } = auth;
    const dispatch = useDispatch();
    const [dataBalance, setDataBalance] = React.useState(null);
    const [offset, setOffset] = React.useState(0);
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

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

    const showMore = async () => {
        setLoading(true);
        await userService.transactionHistory(token, offset).then(async (res) => {
            const { records } = res.data
            setData([...data, ...records]);
            setLoading(false);
        }).catch((err) => {
            setMessage(err.response.data.message);
            setLoading(false);
            if (err.response.status === 401) {
                dispatch(logout());
            }
        });
    };

    React.useEffect(() => {
        balance();
        showMore();
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
                    <Text style={{ fontSize: 18, color: 'black', fontWeight: 'bold' }}>Transaksi</Text>
                </View>
                <View style={{
                    flex: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Text style={{ fontSize: 18, color: 'white' }}></Text>
                </View>
            </View>
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
                marginBottom: 20,
            }}>
                <Text style={{
                    fontSize: 18,
                    fontWeight: '400',
                    color: '#000',
                }}>Transaksi</Text>
            </View>
            {data.length == 0 ? (
                <View style={{
                    marginTop: 20,
                    marginStart: 20,
                    marginEnd: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: '400',
                        color: '#000',
                    }}>Maaf tidak ada histori transaksi saat ini</Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={{
                        marginTop: 20,
                        marginStart: 20,
                        marginEnd: 20,
                    }}>
                        {data.map((item, index) => {
                            return (
                                <View style={{
                                    width: '100%',
                                    backgroundColor: '#fff',
                                    borderRadius: 10,
                                    borderColor: '#a0a0a0',
                                    borderWidth: 0.5,
                                    padding: 15,
                                    marginBottom: 20,
                                }}
                                    key={index}>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                    }}>
                                        <Text style={{
                                            fontSize: 24,
                                            fontWeight: 'bold',
                                            color: item.transaction_type == 'TOPUP' ? '#00AE0D' : '#f42619',
                                            textAlign: 'left',
                                            textAlignVertical: 'bottom',
                                        }}>
                                            {item.transaction_type == 'TOPUP' ? '+' : '-'} Rp{item.total_amount.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}
                                        </Text>
                                        <Text style={{
                                            fontSize: 14,
                                            fontWeight: 'bold',
                                            color: '#4D4D4D',
                                            textAlign: 'right',
                                            textAlignVertical: 'bottom',
                                        }}>
                                            {item.description}
                                        </Text>
                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                    }}>
                                        <Text style={{
                                            fontSize: 14,
                                            fontWeight: '400',
                                            color: '#4D4D4D',
                                            textAlign: 'left',
                                            textAlignVertical: 'bottom',
                                            marginTop: 5,
                                        }}>
                                            {moment(item.created_on).format('DD MMMM YYYY, h:mm')} WIB
                                        </Text>
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 20,
                    }}>
                        <View style={{
                            marginTop: 10,
                            marginBottom: 10,
                        }}>
                            {loading ?
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    color: '#d1d1d1',
                                }}>Loading...</Text>
                                :
                                <Pressable onPress={() => {
                                    setOffset(offset + 1);
                                    showMore();
                                }}>
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                        color: '#f42619',
                                    }}>Show More</Text>
                                </Pressable>
                            }
                        </View>
                    </View>
                </ScrollView>
            )}
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

export default TransactionScreen;