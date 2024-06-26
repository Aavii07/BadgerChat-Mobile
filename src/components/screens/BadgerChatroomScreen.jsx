import { StyleSheet, Text, View, FlatList } from "react-native";
import { useState, useEffect } from 'react';
import CS571 from '@cs571/mobile-client'
import BadgerChatMessage from '../helper/BadgerChatMessage';

function BadgerChatroomScreen(props) {
    const [messages, setMessages] = useState([]);
    const messagesAPI = `https://cs571api.cs.wisc.edu/rest/su24/hw9/messages?chatroom=${props.name}`;

    const loadMessages = () => {
        fetch(messagesAPI, {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        }).then(res => res.json()).then(json => {
            setMessages(json.messages)
        })
    };
    useEffect(() => {
        loadMessages();
    }, []);

    return <View style={{ flex: 1 }}>
        <View style={styles.container}>
            <FlatList
                data={messages}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <BadgerChatMessage
                        title={item.title}
                        content={item.content}
                        created={item.created}
                        poster={item.poster}
                    />
                )}
                ListHeaderComponent={() => (
                    <Text style={styles.headerText}> BadgerChat Messages </Text>
                )}
            />
        </View>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    headerText: {
        margin: 20,
        fontSize: 16,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
});

export default BadgerChatroomScreen;