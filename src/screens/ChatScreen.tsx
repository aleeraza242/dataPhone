import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RouteProp} from '@react-navigation/native';
import {images} from '../assets';
import {CustomImage, CustomText} from '../components';
import {RootState} from '../store';
import {
  sendMessage,
  setActiveConversation,
  markConversationAsRead,
} from '../store/chatSlice';

type RootStackParamList = {
  Chat: {
    conversationId: string;
    phoneNumber: string;
    avatar?: string;
  };
};

type ChatScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Chat'>;
type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

const ChatScreen = () => {
  const [messageText, setMessageText] = useState('');
  const [lastMessageId, setLastMessageId] = useState<string | null>(null);
  const navigation = useNavigation<ChatScreenNavigationProp>();
  const route = useRoute<ChatScreenRouteProp>();
  const dispatch = useDispatch();
  const {conversationId, phoneNumber, avatar} = route.params;
  const scrollViewRef = useRef<ScrollView>(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const headerFadeAnim = useRef(new Animated.Value(0)).current;

  const conversation = useSelector((state: RootState) =>
    state.chat.conversations.find(conv => conv.id === conversationId),
  );

  useEffect(() => {
    // Initial animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(headerFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    dispatch(setActiveConversation(conversationId));
    dispatch(markConversationAsRead(conversationId));
    return () => {
      dispatch(setActiveConversation(null));
    };
  }, [dispatch, conversationId]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage = {
        id: Date.now().toString(), // or however you generate message IDs
        text: messageText.trim(),
        // ... other message properties
      };
      dispatch(sendMessage({conversationId, text: messageText.trim()}));
      setLastMessageId(newMessage.id);
      setMessageText('');
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  };

  const MessageBubble = ({ message, isLast }: { message: any, isLast: boolean }) => {
    const bubbleScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      // Only animate if this is a newly sent message
      if (message.id === lastMessageId) {
        bubbleScale.setValue(0);
        Animated.spring(bubbleScale, {
          toValue: 1,
          tension: 40,
          friction: 7,
          useNativeDriver: true,
        }).start(() => {
          // Clear lastMessageId after animation
          setLastMessageId(null);
        });
      }
    }, [message.id, lastMessageId]);

    return (
      <Animated.View
        style={[
          styles.messageRow,
          message.sender === 'me' ? styles.myMessageRow : null,
          message.id === lastMessageId ? {
            transform: [{ scale: bubbleScale }],
            opacity: bubbleScale,
          } : undefined,
        ]}>
        {message.sender === 'them' && (
          <CustomImage source={{uri: avatar}} style={styles.avatar} />
        )}
        <View
          style={[
            styles.messageBubble,
            message.sender === 'me'
              ? styles.myMessageBubble
              : styles.theirMessageBubble,
          ]}>
          <CustomText color={"#F2F2F2"} style={styles.messageText}>
            {message.text}
          </CustomText>
        </View>
        <CustomText variant="caption" style={styles.messageTime}>
          {message.time}
        </CustomText>
      </Animated.View>
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={'padding'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
      <SafeAreaView style={styles.safeArea}>
        {/* Animated Header */}
        <Animated.View style={[styles.header, { opacity: headerFadeAnim }]}>
          <TouchableOpacity 
            onPress={() => {
              Animated.parallel([
                Animated.timing(fadeAnim, {
                  toValue: 0,
                  duration: 200,
                  useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                  toValue: 50,
                  duration: 200,
                  useNativeDriver: true,
                }),
              ]).start(() => navigation.goBack());
            }} 
            style={styles.backButton}>
            <CustomImage
              source={images.back}
              size={16}
              tintColor="#FFFFFF"
            />
          </TouchableOpacity>
          <CustomText variant="title" color="#FFFFFF" style={styles.headerTitle}>
            {phoneNumber}
          </CustomText>
          <TouchableOpacity style={styles.searchButton}>
            <CustomImage
              source={images.search}
              size={24}
              tintColor="#FFFFFF"
            />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View 
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}>
          {/* Messages */}
          <ScrollView 
            ref={scrollViewRef}
            style={styles.messagesContainer} 
            contentContainerStyle={styles.messagesContent}
            keyboardShouldPersistTaps="handled">
            {conversation?.messages.map((message, index) => (
              <MessageBubble 
                key={message.id} 
                message={message}
                isLast={index === conversation.messages.length - 1}
              />
            ))}
          </ScrollView>

          {/* Input - No animation */}
          <View style={styles.inputWrapper}>
            <View style={styles.inputContainer}>
              <TouchableOpacity style={styles.cameraButton}>
                <CustomImage
                  source={images.camera}
                  size={20}
                  tintColor="#666666"
                />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Message"
                placeholderTextColor="#FFFFFF"
                value={messageText}
                onChangeText={setMessageText}
                onSubmitEditing={handleSendMessage}
              />
              <TouchableOpacity 
                style={styles.sendButton}
                onPress={handleSendMessage}>
                <CustomImage
                  source={images.send}
                  size={18}
                  tintColor="#FFFFFF"
                  style={styles.sendIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1B4B',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    marginLeft: 12,
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchButton: {
    padding: 8,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  myMessageRow: {
    flexDirection: 'row-reverse',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 20,
  },
  myMessageBubble: {
    backgroundColor: '#3C0077',
    borderBottomRightRadius: 4,
  },
  theirMessageBubble: {
    backgroundColor: '#8464BC',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageTime: {
    fontSize: 10,
    fontWeight: '700',
    color: '#3D3D3D',
    marginHorizontal: 8,
    marginTop: 4,
  },
  inputWrapper: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A0A0A0',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cameraButton: {
    marginRight: 8,
    width: 35,
    height: 35,
    backgroundColor: '#FFFFFF',
    borderRadius: 35/2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    padding: 0,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#A0A0A0',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    marginRight: 4,
  },
});

export default ChatScreen; 