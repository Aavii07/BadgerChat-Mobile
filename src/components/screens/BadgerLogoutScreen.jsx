import { Alert, Button, StyleSheet, Text, View } from "react-native";

function BadgerLogoutScreen(props) {

    const onLogout = () => {
        props.handleLogout();
        Alert.alert("Logged out", "Successfully logged out!");
    }

    return <View style={styles.container}>
        <Text style={{fontSize: 24, marginTop: -100}}>Are you sure you're done?</Text>
        <Text>Come back soon!</Text>
        <Text/>
        <Button title="Logout" color="darkred" onPress={onLogout}/>

    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 40,
        width: "50%",
        margin: 12,
        borderWidth: 1,
        padding: 10,
    }
});

export default BadgerLogoutScreen;