import { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import CS571 from '@cs571/mobile-client'
import * as SecureStore from 'expo-secure-store';
import BadgerChatroomScreen from './screens/BadgerChatroomScreen';
import BadgerRegisterScreen from './screens/BadgerRegisterScreen';
import BadgerLoginScreen from './screens/BadgerLoginScreen';
import BadgerLandingScreen from './screens/BadgerLandingScreen';


const ChatDrawer = createDrawerNavigator();

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false);
  const [chatrooms, setChatrooms] = useState([]);

  const chatroomsAPI = "https://cs571api.cs.wisc.edu/rest/su24/hw9/chatrooms"

  useEffect(() => {
    fetch(chatroomsAPI, {
        headers: {
            "X-CS571-ID": CS571.getBadgerId() 
        },  
    })
    .then(response => response.json()) 
    .then(data => {
        setChatrooms(data);
    })
    .catch(error => console.error('Error:', error));
  }, []);

  function handleLogin(username, pin) {
    // hmm... maybe this is helpful!
    setIsLoggedIn(true); // I should really do a fetch to login first!
    SecureStore.setItemAsync('jwt', pin);
    SecureStore.setItemAsync('username', username);
  }

  function handleSignup(username, pin) {
    // hmm... maybe this is helpful!
    setIsLoggedIn(true); // I should really do a fetch to register first!
    SecureStore.setItemAsync('jwt', pin);
    SecureStore.setItemAsync('username', username);
  }

  if (isLoggedIn) {
    return (
      <NavigationContainer>
        <ChatDrawer.Navigator>
          <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
          {
            chatrooms.map(chatroom => {
              return <ChatDrawer.Screen key={chatroom} name={chatroom}>
                {(props) => <BadgerChatroomScreen name={chatroom} />}
              </ChatDrawer.Screen>
            })
          }
        </ChatDrawer.Navigator>
      </NavigationContainer>
    );
  } else if (isRegistering) {
    return <BadgerRegisterScreen handleSignup={handleSignup} setIsRegistering={setIsRegistering} />
  } else {
    return <BadgerLoginScreen handleLogin={handleLogin} setIsRegistering={setIsRegistering} />
  }
}