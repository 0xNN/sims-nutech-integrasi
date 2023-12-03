import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getAuthAsyncStorage() {
    const token = await AsyncStorage.getItem('userToken');
    const user = await AsyncStorage.getItem('userData');
    return {
        token,
        user,
    };
}

export async function setAuthAsyncStorage(response) {
    await AsyncStorage.setItem('userToken', response.token);
    await AsyncStorage.setItem('userData', response.user);
}

export async function resetAuthAsyncStorage() {
    await AsyncStorage.removeItem('userData');
    await AsyncStorage.removeItem('userToken');
}