import { StyleSheet, Text, View, FlatList, Modal, TextInput, Button, Alert, ScrollView } from "react-native";
import { useState, useEffect } from 'react';
import CS571 from '@cs571/mobile-client'
import BadgerChatMessage from '../helper/BadgerChatMessage';
import BadgerCard from '../helper/BadgerCard';
import * as SecureStore from 'expo-secure-store';

function BadgerChatroomScreen(props) {
    const [messages, setMessages] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [jwtToken, setJwtToken] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const messagesAPI = `https://cs571api.cs.wisc.edu/rest/su24/hw9/messages?chatroom=${props.name}`;

    const loadMessages = () => {
        fetch(messagesAPI, {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        }).then(res => res.json()).then(json => {
            setMessages(json.messages)
        }).finally(() => {
            setRefreshing(false);
        });
    };
    useEffect(() => {
        SecureStore.getItemAsync('jwtToken').then(token => {
            setJwtToken(token);
        })
        .catch(error => console.error('Error fetching token:', error));
        loadMessages();
    }, []);

    const createPost = () => {
        if (title && body) {
            fetch(messagesAPI, {
                method: 'POST',
                headers: {
                    "X-CS571-ID": CS571.getBadgerId(),
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${jwtToken}`
                },
                body: JSON.stringify({
                   "title" : title,
                   "content" : body
                })
            }).then(res => res.json()).then(json => {
                Alert.alert("Success", "Post succesfully created!");
                setModalVisible(false);
                setTitle('');
                setBody('');
                loadMessages();   
            })
            .catch(error => console.error('Error creating post', error)); 
        }
    };

    const deletePost = (postId) => {
        fetch(`https://cs571api.cs.wisc.edu/rest/su24/hw9/messages?id=${postId}`, {
            method: 'DELETE',
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Authorization": `Bearer ${jwtToken}`
            }
        })
        .then(() => {
            Alert.alert("Success", "Post successfully deleted!");
            loadMessages();
        })
        .catch(error => console.error('Error deleting post:', error));
    };

    const handleCancel = () => {
        setModalVisible(false);
        setTitle('');
        setBody('');
    };

    const refresh = () => {
        setRefreshing(true);
        loadMessages(); 
    };

    return (
    <View style={{ flex: 1, width: '100%' }}>
        <View style={styles.container}>
            <FlatList
                data={messages}
                refreshing={refreshing} 
                onRefresh={refresh}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                        <View style={{width: '100%'}}>
                            <View style={{marginBottom: 5}}>
                                <BadgerChatMessage
                                    title={item.title}
                                    content={item.content}
                                    created={item.created}
                                    poster={item.poster}
                                />
                            </View>
                            {props.username === item.poster && (
                                <View style = {{ width: '95%', alignSelf: 'center'}}>
                                    <Button title="Delete Post" 
                                    onPress={() => deletePost(item.id)} 
                                    color="red"
                                    style={{ width: '100%', borderRadius: 20 }}/>
                                </View>
                            )}
                        </View>
                )}
                ListHeaderComponent={() => (
                    <Text style={styles.headerText}> BadgerChat Messages </Text>
                )}
            />
            {props.username && (  
                <View style={{width: '100%'}}> 
                    <Button title="Create Post" style={{width: '100%'}} 
                    onPress={() => setModalVisible(true)} />
                </View>
            )}
            
        </View>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}>
            <View style={styles.modalContainer}>
                <BadgerCard
                    style={styles.badgerCard}>
                    <Text style={styles.headerText}>Create a Post</Text>
                    <View style={styles.modalContent}>
                        <TextInput
                            style={[styles.textInputBorder, { marginBottom: 10, width: '100%' }]}
                            placeholder="Enter a title"
                            onChangeText={setTitle}
                            value={title}
                        />
                        <ScrollView
                            style={[styles.textInputBorder, {maxHeight : 100, marginBottom: 25, width: '100%'}, ]}>
                            <TextInput
                                style={{ marginBottom: 100 }}
                                placeholder="Enter a body"
                                onChangeText={setBody}
                                value={body}
                                multiline
                            />
                        </ScrollView>
                        <View style={styles.verticalViewButtons}>
                            <Button
                                title="Create Post"
                                onPress={createPost}
                                disabled={!title || !body}
                            />
                            <Button title="Cancel" onPress={handleCancel} color="red"/>
                        </View>
                    </View>
                </BadgerCard>
            </View>
        </Modal>
    </View>);
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
    modalContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
        padding: 20,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    badgerCard : {
        width: 300,
        height: 400, 
        alignItems: 'center',
    },
    textInputBorder: {
        borderWidth: 1,      
        borderColor: '#ccc',  
        borderRadius: 10,
        padding: 10,     
    },
    verticalViewButtons: {
        flexDirection: "row",
        justifyContent: 'space-around',
        width: '100%',
    }
});

export default BadgerChatroomScreen;