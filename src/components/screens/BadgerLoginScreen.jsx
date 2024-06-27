import { Alert, Button, StyleSheet, Text, View, TextInput } from "react-native";
import { useState } from "react";
import CS571 from '@cs571/mobile-client'
import BadgerCard from '../helper/BadgerCard';

function BadgerLoginScreen(props) {
    const [username, setUsername] = useState("");
    const [pin, setPin] = useState("");
    const loginAPI = "https://cs571api.cs.wisc.edu/rest/su24/hw9/login"

    const clearInputs = () => {
        setUsername("");
        setPin("");
    };
    const onLogin = () => {
        console.log("onLogin");
        console.log(username, pin);
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
            body: JSON.stringify({ 
                "username" : username, 
                "pin" : pin })
        })
        .then(response => {
            console.log("qeubof");
            if (response.status === 200) {
                console.log("ji3");
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
                console.log("ji");
                props.handleLogin(username, data.token);
            }
        })
        .catch(error => console.error('Login Error:', error));
    };

    const onLoginGuest = () => {
        fetch(loginAPI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "X-CS571-ID": CS571.getBadgerId() 
            },
            body: JSON.stringify({ 
                "username" : null, 
                "pin" : null })
        })
        .then(response => response.json())
        .then(data => {
            props.handleLoginGuest();
        })
        .catch(error => console.error('Login Error:', error));
    }
    
    return (
        <View style={styles.container}>
            <BadgerCard>
                <Text style={{ fontSize: 36, marginBottom: 20 }}>BadgerChat Login</Text>
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
                <Button
                    color="crimson"
                    style={{borderRadius: 40}}
                    title={"Login"}
                    onPress={() => {
                        onLogin();
                        clearInputs();
                    }}
                />
                <Button
                    color="grey"
                    style={{borderRadius: 40}}
                    title={"Sign Up"}
                    onPress={() => {
                        props.setIsRegistering(true);
                        clearInputs();
                    }}
                />
                <View style={{marginTop: 40}}>
                    <Button
                        color="grey"
                        style={{borderRadius: 40}}
                        title="Continue as Guest"
                        onPress={onLoginGuest}
                    />
                </View>
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

export default BadgerLoginScreen;