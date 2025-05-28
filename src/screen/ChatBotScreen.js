import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, Alert } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import BottomNavigation from '../navigator/BottomNavigation';
import { handleUserMessage, addToCart, searchName } from '../Firebase/FirebaseAPI';
import { UserContext } from '../Firebase/UserContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatBotScreen = () => {
    const { user } = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    // Load message history when component mounts
    useEffect(() => {
        loadMessageHistory();
    }, []);

    // Load message history from AsyncStorage
    const loadMessageHistory = async () => {
        try {
            const history = await AsyncStorage.getItem(`chat_history_${user.id}`);
            if (history) {
                setMessages(JSON.parse(history));
            }
        } catch (error) {
            console.error('Error loading message history:', error);
        }
    };

    // Save messages to AsyncStorage whenever messages change
    useEffect(() => {
        saveMessageHistory();
    }, [messages]);

    const saveMessageHistory = async () => {
        try {
            await AsyncStorage.setItem(`chat_history_${user.id}`, JSON.stringify(messages));
        } catch (error) {
            console.error('Error saving message history:', error);
        }
    };

    const handleBuyNow = async (foodItem) => {
        try {
            // Tìm kiếm thông tin đầy đủ của món ăn từ database
            const searchResult = await searchName(foodItem.foodName);
            
            if (!searchResult || searchResult.length === 0) {
                Alert.alert("Lỗi", "Không tìm thấy thông tin món ăn trong database");
                return;
            }

            const fullFoodInfo = searchResult[0]; // Lấy thông tin đầy đủ của món ăn

            const foodPriceNumber = parseInt(fullFoodInfo.foodPrice) || 0; // Chuyển đổi giá sang số

            const cartItem = {
                foodItem: {
                    foodId: fullFoodInfo.id,
                    foodName: fullFoodInfo.foodName,
                    foodPrice: foodPriceNumber,
                    restaurantName: fullFoodInfo.restaurantName,
                    image: fullFoodInfo.image || null,
                    description: fullFoodInfo.description || null
                },
                soLuong: 1,
                tongGia: foodPriceNumber // Sử dụng giá trị số
            };

            const result = await addToCart(user.id, cartItem);

            if (result.success) {
                Alert.alert("Thành công", "Đã thêm món ăn vào giỏ hàng!");
            } else {
                Alert.alert("Lỗi", result.message || "Không thể thêm món ăn vào giỏ hàng");
            }
        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ hàng:", error);
            Alert.alert("Lỗi", "Có lỗi xảy ra khi thêm vào giỏ hàng");
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;
        const newMessage = {
            text: input,
            sender: 'user',
            timestamp: new Date().toISOString(),
        };
        const botResponse = await handleUserMessage(user.id, input);
        const botMessage = {
            text: botResponse.replyText,
            sender: 'bot',
            timestamp: new Date().toISOString(),
            foodItems: botResponse.foundFoodItems || null
        };
        setMessages(prevMessages => [...prevMessages, newMessage, botMessage]);
        setInput("");
    };

    const extractFoodItems = (text) => {
        const foodItems = [];
        const lines = text.split('\n');
        let currentItem = null;

        lines.forEach(line => {
            if (line.match(/^\d+\./)) {
                if (currentItem) {
                    foodItems.push(currentItem);
                }
                const match = line.match(/(.+?) - (.+?) tại quán (.+)/);
                if (match) {
                    const [_, name, price, restaurant] = match;
                    currentItem = {
                        foodName: name.trim(),
                        price: price.trim(),
                        restaurantName: restaurant.trim()
                    };
                }
            } else if (currentItem && line.includes('Mô tả:')) {
                currentItem.description = line.replace('Mô tả:', '').trim();
            }
        });

        if (currentItem) {
            foodItems.push(currentItem);
        }

        return foodItems;
    };

    const renderMessage = ({ item }) => {
        if (item.sender === 'bot' && item.foodItems) {
            return (
                <View style={styles.botMessageContainer}>
                    <Text style={styles.messageText}>{item.text}</Text>
                    {item.foodItems.map((food, index) => (
                        <View key={index} style={styles.foodItemContainer}>
                            <View style={styles.foodItemInfo}>
                                <Text style={styles.foodName}>{food.foodName || 'Không có tên'}</Text>
                                <Text style={styles.foodPrice}>{food.foodPrice ? `${food.foodPrice.toLocaleString()} VNĐ` : 'Không có giá'}</Text>
                                <Text style={styles.restaurantName}>Quán: {food.restaurantName || 'Không xác định'}</Text>
                                {food.description && (
                                    <Text style={styles.foodDescription}>{food.description}</Text>
                                )}
                            </View>
                            <TouchableOpacity
                                style={styles.buyButton}
                                onPress={() => handleBuyNow(food)}
                            >
                                <Text style={styles.buyButtonText}>Mua ngay</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            );
        }

        return (
            <View style={[
                styles.messageBubble,
                item.sender === "bot" ? styles.botMessage : styles.userMessage
            ]}>
                <Text style={[
                    styles.messageText,
                    item.sender === "bot" ? styles.botMessageText : styles.userMessageText
                ]}>
                    {item.text}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.botAvatar}>
                        <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
                    </View>
                    <View style={styles.headerText}>
                        <Text style={styles.headerTitle}>Food Assistant</Text>
                        <Text style={styles.headerSubtitle}>Online</Text>
                    </View>
                </View>
            </View>

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={80}
            >
                <View style={styles.chatContainer}>
                    <FlatList
                        data={[...messages].reverse()}
                        keyExtractor={(_, i) => i.toString()}
                        contentContainerStyle={styles.messageList}
                        renderItem={renderMessage}
                    />
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={input}
                            onChangeText={setInput}
                            placeholder="Nhập câu hỏi..."
                            placeholderTextColor="#999"
                        />
                        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                            <Ionicons name="send" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
                <BottomNavigation />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ChatBotScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#fff',
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    botAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#007bff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerText: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#666',
    },
    keyboardView: {
        flex: 1,
    },
    chatContainer: {
        flex: 1,
        padding: 16,
        paddingBottom: 70,
    },
    messageList: {
        paddingVertical: 10,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 20,
        marginVertical: 4,
    },
    botMessage: {
        backgroundColor: '#fff',
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 4,
    },
    userMessage: {
        backgroundColor: '#007bff',
        alignSelf: 'flex-end',
        borderBottomRightRadius: 4,
    },
    messageText: {
        fontSize: 16,
        color: '#333',
    },
    botMessageText: {
        color: '#333',
    },
    userMessageText: {
        color: '#fff',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginTop: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        paddingVertical: 8,
    },
    sendButton: {
        backgroundColor: '#007bff',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    botMessageContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 12,
        marginVertical: 4,
        alignSelf: 'flex-start',
        maxWidth: '90%',
    },
    foodItemContainer: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 12,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    foodItemInfo: {
        marginBottom: 8,
    },
    foodName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    foodPrice: {
        fontSize: 14,
        color: '#007bff',
        marginBottom: 4,
    },
    restaurantName: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    foodDescription: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
    },
    buyButton: {
        backgroundColor: '#28a745',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignSelf: 'flex-end',
    },
    buyButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
