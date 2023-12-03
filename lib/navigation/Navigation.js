import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import HomeScreen from "../screens/HomeScreen";
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import * as React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from '@rneui/themed';
import { userService } from "../services/userService";
import { resetAuthAsyncStorage } from "../services/getAuthAsyncStorage";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TopUpScreen from "../screens/TopUpScreen";
import PaymentScreen from "../screens/PaymentScreen";
import TransactionScreen from "../screens/TransactionScreen";
import AkunScreen from "../screens/AkunScreen";
import { changeImageProfile } from "../actions/auth";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function Navigation(props) {
    const auth = useSelector((state) => state.auth);
    const userToken = auth.user ? auth.user.token : null;
    const { imageProfile } = auth;

    const dispatch = useDispatch();

    const [profileImage, setProfileImage] = React.useState(null);

    const load = async () => {
        const { token } = auth;
        await userService.profile(token).then(async (res) => {
            if (res.data.profile_image.includes('null')) {
                setProfileImage(null);
                return;
            }
            setProfileImage(res.data.profile_image);
            dispatch(changeImageProfile(res.data.profile_image));
        }).catch(async (err) => {
            if (err.response.status === 401) {
                await resetAuthAsyncStorage();
            }
        });
    };

    function StackNavigator() {
        return (
            <Stack.Navigator>
                <Stack.Screen
                    options={{
                        headerShown: false
                    }}
                    name="Home"
                    component={Home}
                />
                <Stack.Screen
                    options={{
                        headerShown: false
                    }}
                    name="Payment"
                    component={PaymentScreen}
                />
            </Stack.Navigator>
        );
    }

    function Home() {
        return (
            <Tab.Navigator>
                <Tab.Screen
                    name="HomeS"
                    component={HomeScreen}
                    options={{
                        headerShadowVisible: false,
                        headerTitleStyle: {
                            color: '#000',
                            fontSize: 20,
                        },
                        headerLeft: () => (
                            <View style={{
                                marginLeft: 20,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                                <Image
                                    style={styles.imageStyle}
                                    source={require('../../assets/Logo.png')}
                                />
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>SIMS PPOB</Text>
                            </View>
                        ),
                        headerRight: () => (
                            imageProfile == null ?
                                (profileImage == null ? (
                                    <View style={{ marginRight: 20, }}>
                                        <Avatar
                                            size={32}
                                            rounded
                                            source={require('../../assets/ProfilePhoto.png')}
                                            containerStyle={{
                                                borderColor: '#CACACA',
                                                borderStyle: 'solid',
                                                borderWidth: 1,
                                            }}
                                        />
                                    </View>
                                ) : (
                                    <View style={{ marginRight: 20, }}>
                                        <Avatar
                                            size={32}
                                            rounded
                                            source={{ uri: profileImage }}
                                            containerStyle={{
                                                borderColor: '#CACACA',
                                                borderStyle: 'solid',
                                                borderWidth: 1,
                                            }}
                                        />
                                    </View>
                                )) : profileImage == null ? (
                                    <View style={{ marginRight: 20, }}>
                                        <Avatar
                                            size={32}
                                            rounded
                                            source={require('../../assets/ProfilePhoto.png')}
                                            containerStyle={{
                                                borderColor: '#CACACA',
                                                borderStyle: 'solid',
                                                borderWidth: 1,
                                            }}
                                        />
                                    </View>
                                ) : (
                                    <View style={{ marginRight: 20, }}>
                                        <Avatar
                                            size={32}
                                            rounded
                                            source={{ uri: profileImage }}
                                            containerStyle={{
                                                borderColor: '#CACACA',
                                                borderStyle: 'solid',
                                                borderWidth: 1,
                                            }}
                                        />
                                    </View>
                                )
                        ),
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="home" color={color} size={size} />
                        ),
                        headerTitle: '',
                        tabBarLabel: 'Home',
                        tabBarLabelStyle: {
                            color: '#000',
                            fontSize: 14,
                            marginBottom: 2,
                        },
                    }}
                />
                <Tab.Screen
                    name="Top Up"
                    component={TopUpScreen}
                    options={{
                        headerShadowVisible: false,
                        headerTitleStyle: {
                            color: '#000',
                            fontSize: 20,
                        },
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => {
                                // props.navigation.navigate('Home');
                            }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{
                                    marginLeft: 20,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                    <MaterialCommunityIcons name="arrow-left" color={"black"} size={20} />
                                    <Text style={{ fontSize: 20, color: 'black', marginLeft: 10 }}>Kembali</Text>
                                </View>
                            </TouchableOpacity>
                        ),
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="credit-card" color={color} size={size} />
                        ),
                        headerTitle: 'Top Up',
                        headerTitleAlign: 'center',
                        tabBarLabel: 'Top Up',
                        tabBarLabelStyle: {
                            color: '#000',
                            fontSize: 14,
                            marginBottom: 2,
                        },
                        headerShown: false,
                    }}
                />
                <Tab.Screen
                    name="Transaction"
                    component={TransactionScreen}
                    options={{
                        headerShadowVisible: false,
                        headerTitleStyle: {
                            color: '#000',
                            fontSize: 20,
                        },
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => {
                                // props.navigation.navigate('Home');
                            }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{
                                    marginLeft: 20,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                    <MaterialCommunityIcons name="arrow-left" color={"black"} size={20} />
                                    <Text style={{ fontSize: 20, color: 'black', marginLeft: 10 }}>Kembali</Text>
                                </View>
                            </TouchableOpacity>
                        ),
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="card-bulleted-outline" color={color} size={size} />
                        ),
                        headerTitle: 'Transaction',
                        headerTitleAlign: 'center',
                        tabBarLabel: 'Transaction',
                        tabBarLabelStyle: {
                            color: '#000',
                            fontSize: 14,
                            marginBottom: 2,
                        },
                        headerShown: false,
                    }}
                />
                <Tab.Screen
                    name="Akun"
                    component={AkunScreen}
                    options={{
                        headerShadowVisible: false,
                        headerTitleStyle: {
                            color: '#000',
                            fontSize: 20,
                        },
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => {
                                // props.navigation.navigate('Home');
                            }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{
                                    marginLeft: 20,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                    <MaterialCommunityIcons name="arrow-left" color={"black"} size={20} />
                                    <Text style={{ fontSize: 20, color: 'black', marginLeft: 10 }}>Kembali</Text>
                                </View>
                            </TouchableOpacity>
                        ),
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="account" color={color} size={size} />
                        ),
                        headerTitle: 'Akun',
                        headerTitleAlign: 'center',
                        tabBarLabel: 'Akun',
                        tabBarLabelStyle: {
                            color: '#000',
                            fontSize: 14,
                            marginBottom: 2,
                        },
                        headerShown: false,
                    }}
                />
            </Tab.Navigator>
        )
    }

    React.useEffect(() => {
        load();
    }, []);
    return (
        userToken === null ? (
            <Stack.Navigator>
                <>
                    <Stack.Screen
                        options={{
                            headerShown: false
                        }}
                        name="SignIn"
                        component={SignInScreen}
                    />
                    <Stack.Screen
                        options={{
                            headerShown: false
                        }}
                        name="SignUp"
                        component={SignUpScreen}
                    />
                </>
            </Stack.Navigator>
        ) : (
            StackNavigator()
        )
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    errorMessage: {
        color: '#ff0000',
    },
    imageStyle: {
        marginRight: 10,
        height: 32,
        width: 32,
        resizeMode: 'stretch',
    },
});