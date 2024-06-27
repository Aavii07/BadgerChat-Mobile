import { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import CS571 from '@cs571/mobile-client'
import * as SecureStore from 'expo-secure-store';
import BadgerChatroomScreen from './screens/BadgerChatroomScreen';
import BadgerRegisterScreen from './screens/BadgerRegisterScreen'; // used just for when being redirected as guest
import BadgerLoginScreen from './screens/BadgerLoginScreen'; // login and register screens are here
import BadgerLandingScreen from './screens/BadgerLandingScreen';
import BadgerConversionScreen from './screens/BadgerConversionScreen';
import BadgerLogoutScreen from './screens/BadgerLogoutScreen';


const ChatDrawer = createDrawerNavigator();

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false);
  const [chatrooms, setChatrooms] = useState([]);
  const [username, setUsername] = useState(""); // hold username to pass down and check for your own posts

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
    // called after fetch
    setIsLoggedIn(true); 
    setUsername(username);
    SecureStore.setItemAsync('jwtToken', pin);
    SecureStore.setItemAsync('username', username);
    console.log(username);
  }

  function handleLoginGuest() {
    setIsLoggedIn(true);
    setUsername("");
  }

  function handleSignup(username, pin) {
    // called after fetch
    setIsLoggedIn(true); 
    setUsername(username);
    SecureStore.setItemAsync('jwtToken', pin);
    SecureStore.setItemAsync('username', username);
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setUsername("");
    SecureStore.deleteItemAsync('jwtToken');
    SecureStore.deleteItemAsync('username');
  }

  if (isLoggedIn) {
    return (
      <NavigationContainer>
        <ChatDrawer.Navigator>
          <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
          {
            chatrooms.map(chatroom => {
              return <ChatDrawer.Screen key={chatroom} name={chatroom}>
                {(props) => <BadgerChatroomScreen name={chatroom} username={username} />}
              </ChatDrawer.Screen>
            })
          }
          {(username) ? 
          <ChatDrawer.Screen name="Logout">
            {props => (
              <BadgerLogoutScreen
                {...props}
                handleLogout={handleLogout}
              />
            )}
          </ChatDrawer.Screen> :
          <ChatDrawer.Screen name="Sign up">
            {props => (
              <BadgerConversionScreen
                {...props}
                setIsRegistering={setIsRegistering}
                setIsLoggedIn={setIsLoggedIn}
              />
            )}
          </ChatDrawer.Screen>
              
        } 
        </ChatDrawer.Navigator>
      </NavigationContainer>
    );
  } else if (isRegistering) {
    return <BadgerRegisterScreen handleSignup={handleSignup} handleLogin={handleLogin} setIsRegistering={setIsRegistering} />
  } else {
    return <BadgerLoginScreen handleLogin={handleLogin} setIsRegistering={setIsRegistering} handleLoginGuest={handleLoginGuest} />
  }
}