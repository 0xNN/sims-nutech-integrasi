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
    ToastAndroid,
    StatusBar,
} from 'react-native';
import { Avatar, Accessory, Button, Text as Text2 } from 'react-native-elements';
import { logout, changeImageProfile } from '../actions/auth';
import { launchImageLibrary } from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { userService } from '../services/userService';
import { Overlay } from '@rneui/themed';
import { Skeleton } from '@rneui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import 'moment/locale/id';

const AkunScreen = ({ navigation }) => {
    const auth = useSelector(state => state.auth);

    if (!auth.user) {
        return null;
    }

    const { token } = auth;
    const dispatch = useDispatch();
    const [dataProfile, setDataProfile] = React.useState(null);
    const [message, setMessage] = React.useState("-");
    const [email, setEmail] = React.useState('user500@nutech-integrasi.com');
    const [namaDepan, setNamaDepan] = React.useState('D500');
    const [namaBelakang, setNamaBelakang] = React.useState('B500');
    const [isEdit, setIsEdit] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [loadingImage, setLoadingImage] = React.useState(false);
    const [visible, setVisible] = React.useState(false);
    const [tempData, setTempData] = React.useState({});
    const [visibleSuccess, setVisibleSuccess] = React.useState(false);

    const profile = async () => {
        await userService.profile(token).then(async (res) => {
            setNamaDepan(res.data.first_name);
            setNamaBelakang(res.data.last_name);
            setEmail(res.data.email);
            setDataProfile(res.data);
            setTempData({
                ...tempData,
                first_name: res.data.first_name,
                last_name: res.data.last_name,
            });
        }).catch(async (err) => {
            if (err.response.status === 401) {
                dispatch(logout());
            }
        });
    };

    const profileUpdate = async () => {
        setLoading(true)
        await userService.profileUpdate(token, { first_name: namaDepan, last_name: namaBelakang }).then(async (res) => {
            setNamaDepan(res.data.first_name);
            setNamaBelakang(res.data.last_name);
            setDataProfile({
                ...dataProfile,
                first_name: res.data.first_name,
                last_name: res.data.last_name,
            });
            setTempData({
                ...tempData,
                first_name: res.data.first_name,
                last_name: res.data.last_name,
            });
            setMessage(res.message);
            setLoading(false)
            setVisibleSuccess(true)
        }).catch(async (err) => {
            if (err.response.status === 404) {
                setMessage('Url tidak ditemukan')
                setVisible(true)
            }
            setLoading(false)
            if (err.response.status === 401) {
                dispatch(logout());
            }
        });
    };

    const openImagePicker = async () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
        };

        launchImageLibrary(options, async (response) => {
            if (response.didCancel) {
                showToast('User cancelled image picker');
            } else if (response.error) {
                showToast('Image picker error: ' + response.error);
            } else {
                if (response.hasOwnProperty('assets')) {
                    if (response.assets[0].fileSize > 100000) {
                        showToast('Ukuran gambar tidak boleh lebih dari 100kb');
                        return;
                    }
                    if (response.assets[0].type != 'image/jpeg' && response.assets[0].type != 'image/png' && response.assets[0].type != 'image/jpg') {
                        showToast('Format gambar tidak didukung');
                        return;
                    }
                    let formData = new FormData();
                    formData.append('file', {
                        uri: response.assets[0].uri,
                        name: response.assets[0].fileName,
                        type: response.assets[0].type,
                    });
                    profileImageUpdate(formData);
                    return;
                }
                if (response.fileSize > 100000) {
                    showToast('Ukuran gambar tidak boleh lebih dari 100kb');
                    return;
                }
                if (response.type != 'image/jpeg' || response.type != 'image/png' || response.type != 'image/jpg') {
                    showToast('Format gambar tidak didukung');
                    return;
                }
                let formData = new FormData();
                formData.append('file', {
                    uri: response.uri,
                    name: response.fileName,
                    type: response.type,
                });
                await profileImageUpdate(formData);
                // setDataProfile({ ...dataProfile, profile_image: response.uri });
            }
        });
    };

    const profileImageUpdate = async (form) => {
        setLoadingImage(true)
        await userService.profileImageUpdate(token, form).then(async (res) => {
            setLoadingImage(false)
            setDataProfile({ ...dataProfile, profile_image: res.data.profile_image });
            dispatch(changeImageProfile(res.data.profile_image))
        }).catch(async (err) => {
            if (err.response.status === 404) {
                setMessage(err.message)
                setVisible(true)
            }
            setLoadingImage(false)
            if (err.response.status === 401) {
                dispatch(logout());
            }
        });
    };

    const showToast = (message) => {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    };

    const valid = async () => {
        if (namaDepan.length > 0 && namaBelakang.length > 0) {
            return true
        }
        return false
    }

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    const toggleOverlaySuccess = () => {
        setVisibleSuccess(!visibleSuccess);
    };

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
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
            }}>
                <Text style={{
                    fontSize: 20,
                    fontWeight: '600',
                    color: '#0d0d0d',
                    textAlign: 'center',
                }}>
                    {message}
                </Text>
            </View>
            <Pressable onPress={() => {
                setVisible(false)
            }} style={{ marginTop: 40, marginBottom: 20 }}>
                <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#f42619',
                    textAlign: 'center',
                }}>
                    Tutup
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
                {message}
            </Text>
            <Pressable onPress={() => {
                toggleOverlaySuccess();
            }} style={{ marginTop: 40, marginBottom: 20 }}>
                <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#f42619',
                    textAlign: 'center',
                }}>
                    Tutup
                </Text>
            </Pressable>
        </Overlay>
    }

    React.useEffect(() => {
        profile();
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
                    <Text style={{ fontSize: 18, color: 'black', fontWeight: 'bold' }}>Akun</Text>
                </View>
                <View style={{
                    flex: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Text style={{ fontSize: 18, color: 'white' }}></Text>
                </View>
            </View>
            <ScrollView>
                <View style={{
                    marginLeft: 20,
                    marginRight: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 20,
                }}>
                    {loadingImage ? 
                        <Skeleton circle width={100} height={100} animation='wave' /> :
                        <Avatar
                            size={100}
                            rounded
                            source={dataProfile != null ? 
                                (dataProfile.profile_image.includes('null') ? require('../../assets/ProfilePhoto-1.png'): { uri: dataProfile.profile_image }) 
                                : require('../../assets/ProfilePhoto-1.png')
                            }
                            containerStyle={{
                                borderColor: '#CACACA',
                                borderStyle: 'solid',
                                borderWidth: 1,
                            }}
                        >
                            <Accessory
                                size={26}
                                onPress={() => {
                                    openImagePicker()
                                }}
                                color={'#545454'}
                                underlayColor={'#CACACA'}
                                style={{
                                    backgroundColor: '#fff',
                                    borderWidth: 0.5,
                                    borderColor: '#CACACA',
                                }}
                                iconStyle={{
                                    fontSize: 16,
                                }}
                            />
                        </Avatar>
                    }
                </View>
                <View style={{
                    marginLeft: 20,
                    marginRight: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 20,
                }}>
                    {
                        dataProfile != null ?
                            <Text style={{ fontSize: 24, color: 'black', fontWeight: 'bold' }}>{dataProfile.first_name} {dataProfile.last_name}</Text> :
                            <Text style={{ fontSize: 24, color: 'black', fontWeight: 'bold' }}>-</Text>
                    }
                </View>
                <View style={{
                    marginLeft: 20,
                    marginRight: 20,
                    marginTop: 30,
                }}>
                    <Text style={{ fontSize: 16, color: 'black' }}>Email</Text>
                </View>
                <View style={[
                    styles.sectionStyle,
                    {
                        marginStart: 20,
                        marginEnd: 20,
                    }
                ]}>
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
                        editable={false}
                        placeholderTextColor={'#afafaf'}
                        value={email}
                    />
                </View>
                {email == '' ? <View style={{ alignItems: 'end' }}><Text2 style={{ color: '#f42619' }}>email tidak boleh kosong</Text2></View> : null}
                <View style={{
                    marginLeft: 20,
                    marginRight: 20,
                    marginTop: 30,
                }}>
                    <Text style={{ fontSize: 16, color: 'black' }}>Nama Depan</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <View style={[
                        styles.sectionStyle,
                        {
                            marginStart: 20,
                            marginEnd: 20,
                        }
                    ]}>
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
                            editable={isEdit}
                            value={namaDepan}
                        />
                    </View>
                </View>
                {namaDepan == '' ? <View style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end',
                    marginEnd: 20,
                }}>
                    <View style={{ alignItems: 'end' }}>
                        <Text2 style={{ color: '#f42619' }}>nama depan tidak boleh kosong</Text2>
                    </View>
                </View> : null}
                <View style={{
                    marginLeft: 20,
                    marginRight: 20,
                    marginTop: 30,
                }}>
                    <Text style={{ fontSize: 16, color: 'black' }}>Nama Belakang</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <View style={[
                        styles.sectionStyle,
                        {
                            marginStart: 20,
                            marginEnd: 20,
                        }
                    ]}>
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
                            editable={isEdit}
                            value={namaBelakang}
                        />
                    </View>
                </View>
                {namaBelakang == '' ? <View style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end',
                    marginEnd: 20,
                }}>
                    <View style={{ alignItems: 'end' }}>
                        <Text2 style={{ color: '#f42619' }}>nama belakang tidak boleh kosong</Text2>
                    </View>
                </View> : null}
                <View style={{
                    alignItems: 'center',
                    marginTop: 50,
                    marginBottom: 20,
                    marginStart: 20,
                    marginEnd: 20,
                    flexDirection: 'row',
                }}>
                    <View style={{ flex: 1 }}>
                        <Button
                            loading={loading}
                            loadingStyle={{
                                color: isEdit ? '#fff' : '#f42619',
                            }}
                            onPress={async () => {
                                if (isEdit) {
                                    if (!await valid()) {
                                        return
                                    }
                                    await profileUpdate()
                                    setIsEdit(false)
                                } else {
                                    setIsEdit(true)
                                }
                            }}
                            title={isEdit ? "Simpan" : "Edit Profile"}
                            titleStyle={{
                                color: isEdit ? '#fff' : '#f42619',
                            }}
                            buttonStyle={{
                                backgroundColor: isEdit ? '#f42619' : '#fff',
                                borderRadius: 5,
                                padding: 12,
                                borderColor: '#f42619',
                                borderWidth: 1,
                            }}
                        />
                    </View>
                </View>
                {isEdit ?
                    <View style={{
                        alignItems: 'center',
                        marginBottom: 20,
                        marginStart: 20,
                        marginEnd: 20,
                        flexDirection: 'row',
                    }}>
                        <View style={{ flex: 1 }}>
                            <Button
                                onPress={() => {
                                    setIsEdit(false)
                                    setNamaDepan(tempData.first_name)
                                    setNamaBelakang(tempData.last_name)
                                }}
                                title="Batalkan"
                                titleStyle={{ color: '#f42619' }}
                                buttonStyle={{
                                    backgroundColor: '#fff',
                                    borderRadius: 5,
                                    padding: 12,
                                    borderColor: '#f42619',
                                    borderWidth: 1,
                                }}
                            />
                        </View>
                    </View> :
                    <View style={{
                        alignItems: 'center',
                        marginBottom: 20,
                        marginStart: 20,
                        marginEnd: 20,
                        flexDirection: 'row',
                    }}>
                        <View style={{ flex: 1 }}>
                            <Button
                                loading={auth.loggingOut}
                                onPress={() => dispatch(logout())}
                                title="Logout"
                                buttonStyle={{ backgroundColor: '#f42619', borderRadius: 5, padding: 12 }}
                            />
                        </View>
                    </View>
                }
                {failedAlert()}
                {successAlert()}
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

export default AkunScreen;