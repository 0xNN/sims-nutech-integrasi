import { View, StyleSheet, SafeAreaView, Image, StatusBar } from 'react-native';
import { Text as Text2 } from 'react-native-elements';

function SplashScreen() {
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
                </View>
                <Text2 style={{
                    fontSize: 24,
                    marginTop: 10,
                }} h3>SIMS PPOB</Text2>
                <Text2 style={{
                    fontSize: 20,
                    marginTop: 10,
                    color: '#a0a0a0',
                    fontWeight: 'bold'
                }}>MUHAMMAD SENDI NOVIANSYAH</Text2>
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
        height: 120,
        width: 120,
        resizeMode: 'stretch',
        alignItems: 'center',
    },
});

export default SplashScreen;