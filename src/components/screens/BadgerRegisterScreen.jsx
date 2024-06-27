import { Alert, Button, StyleSheet, Text, View, TextInput } from "react-native";
import { useState } from "react";
import CS571 from '@cs571/mobile-client'
import BadgerCard from '../helper/BadgerCard';

function BadgerRegisterScreen(props) {

    const [username, setUsername] = useState("");
    const [pin, setPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");
    const registerAPI = "https://cs571api.cs.wisc.edu/rest/su24/hw9/register"
    const loginAPI = "https://cs571api.cs.wisc.edu/rest/su24/hw9/login" // login after registration

    const onRegister = () => {
        if (!username || !pin || !confirmPin) {
            Alert.alert("Missing fields", "Please enter every field.");
            return;
        }

        if (pin !== confirmPin) {
            Alert.alert("Pins do not match", "Please match entered pins");
            return;
        }

        if (pin.length !== 7) {
            Alert.alert("Invalid pin", "The given pin is not 7 digits.");
            return;
        }

        fetch(registerAPI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "X-CS571-ID": CS571.getBadgerId() 
            },
            body: JSON.stringify({ 
                "username" : username, 
                "pin" : pin })
        })
        .then(response => {
            if (response.status === 200) {
                Alert.alert("Registration successful", "You may now enter BadgerChat.");
                onLogin();
                props.setIsRegistering(false);
            } else if (response.status === 409) {
                Alert.alert("Username Taken", "Please choose a different username.");
            } else {
                throw new Error("Failed to register");
            }
        })
        .then(data => {
            if (data && data?.token) {
                props.handleSignup(username, data.token);
            }
        })
        .catch(error => console.error('Registration Error:', error));
    };

    const onLogin = () => {

        fetch(loginAPI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "X-CS571-ID": CS571.getBadgerId() 
            },
            body: JSON.stringify({ 
                "username" : username, 
                "pin" : pin })
        })
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error("Failed to login");
            }
        })
        .then(data => {
            if (data && data?.token) {
                props.handleLogin(username, data.token);
            }
        })
        .catch(error => console.error('Login Error:', error));
    };

    const clearInputs = () => {
        setUsername("");
        setPin("");
        setConfirmPin("");
    };

    return (
        <View style={styles.container}>
        <BadgerCard>
            <Text style={{ fontSize: 36, marginBottom: 20 }}>BadgerChat Register </Text>
            <TextInput
                autoCapitalize="none"
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={[styles.textInputBorder, { marginBottom: 40, marginTop: 40 }]}
            />
            <TextInput
                placeholder="Pin"
                maxLength={7}
                keyboardType="number-pad"
                secureTextEntry={true}
                value={pin}
                onChangeText={setPin}
                style = { [styles.textInputBorder, {marginBottom: 40}]} 
            />
            <TextInput
                placeholder="Confirm Pin"
                maxLength={7}
                secureTextEntry={true}
                keyboardType="number-pad"
                value={confirmPin}
                onChangeText={setConfirmPin}
                style = { [styles.textInputBorder, {marginBottom: 40}]} 
            />
            <Button
                color="crimson"
                style={{borderRadius: 40}}
                title={"Register"}
                onPress={() => {
                    onRegister();
                    clearInputs();
                }}
            />
            <Button
                color="grey"
                style={{borderRadius: 40}}
                title={"Go to Login"}
                onPress={() => {
                    props.setIsRegistering(false);
                    clearInputs();
                }}
            />
        </BadgerCard>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textInputBorder: {
        borderWidth: 1,      
        borderColor: '#ccc',  
        borderRadius: 10,
        padding: 10,     
    }
});

export default BadgerRegisterScreen;