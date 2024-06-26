import { Alert, Button, StyleSheet, Text, View, TextInput } from "react-native";
import { useState } from "react";
import CS571 from '@cs571/mobile-client'
import * as SecureStore from 'expo-secure-store';
import BadgerCard from '../helper/BadgerCard';

function BadgerLoginScreen(props) {
    const [username, setUsername] = useState("");
    const [pin, setPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const loginAPI = "https://cs571api.cs.wisc.edu/rest/su24/hw9/login"
    const registerAPI = "https://cs571api.cs.wisc.edu/rest/su24/hw9/register"

    const clearInputs = () => {
        setUsername("");
        setPin("");
        setConfirmPin("");
    };
    const onLogin = () => {
        if (!username || !pin) {
            Alert.alert("Missing Fields", "Please enter every field.");
            return;
        }

        fetch(loginAPI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "X-CS571-ID": CS571.getBadgerId() 
            },
            body: JSON.stringify({ username, pin })
        })
        .then(response => {
            if (response.status === 200) {
                return response.json();
            }  
            if (response.status === 401) {
                Alert.alert("Invalid Login", "Please check your username and password.");
                return;
            }
            else {
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
            body: JSON.stringify({ username, pin })
        })
        .then(response => {
            if (response.status === 200) {
                Alert.alert("Registration successful", "You may now enter badger chat.");
                onLogin();
                setIsRegistering(false);
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

    return (
        <View style={styles.container}>
            <BadgerCard>
                <Text style={{ fontSize: 36, marginBottom: 20 }}>BadgerChat {isRegistering ? "Register" : "Login"}</Text>
                <TextInput
                    autoCapitalize="none"
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    style = {{marginBottom: 40, marginTop: 40}} 
                />
                <TextInput
                    placeholder="Pin"
                    maxLength={7}
                    keyboardType="number-pad"
                    secureTextEntry={true}
                    value={pin}
                    onChangeText={setPin}
                    style = {{marginBottom: 40}} 
                />
                {isRegistering && (
                    <TextInput
                        placeholder="Confirm Pin"
                        maxLength={7}
                        secureTextEntry={true}
                        keyboardType="number-pad"
                        value={confirmPin}
                        onChangeText={setConfirmPin}
                        style = {{marginBottom: 40}} 
                    />
                )}
                <Button
                    color="crimson"
                    style={{borderRadius: 40}}
                    title={isRegistering ? "Register" : "Login"}
                    onPress={() => {
                        if (isRegistering) {
                            onRegister();
                        } else {
                            onLogin();
                        }
                        clearInputs();
                    }}
                />
                <Button
                    color="grey"
                    style={{borderRadius: 40}}
                    title={isRegistering ? "Go to Login" : "Signup"}
                    onPress={() => {
                        setIsRegistering(!isRegistering)
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
    }
});

export default BadgerLoginScreen;