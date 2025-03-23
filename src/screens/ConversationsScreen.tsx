import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
  Animated,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {images} from '../assets';
import {CustomImage, CustomText} from '../components';
import {RootState} from '../store';

type RootStackParamList = {
  Chat: {
    conversationId: string;
    phoneNumber: string;
    avatar?: string;
  };
};

type ConversationsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const formatPhoneNumber = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return phone;
};

const ConversationsScreen = () => {
  const navigation = useNavigation<ConversationsScreenNavigationProp>();
  const {conversations, contacts} = useSelector((state: RootState) => state.chat);
  
  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const contactsSlideAnim = React.useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    // Parallel animations when screen loads
    Animated.parallel([
      // Fade in animation for conversations
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Scale animation for FAB
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
      // Slide in animation for contacts
      Animated.timing(contactsSlideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1B4B" />
      {/* Header */}
      <View style={styles.header}>
        <CustomText variant="title" color="#FFFFFF" style={styles.headerTitle}>
          Messages
        </CustomText>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton}>
            <CustomImage
              source={images.search}
              size={24}
              tintColor="#FFFFFF"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <CustomImage
              source={images.settings}
              size={24}
              tintColor="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Contacts */}
      <Animated.ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={[styles.recentContactsContainer, {
          transform: [{ translateX: contactsSlideAnim }]
        }]}
        contentContainerStyle={styles.recentContactsContent}>
        {contacts.map((contact) => (
          <TouchableOpacity
            key={contact.id}
            style={styles.recentContact}
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate('Chat', {
                conversationId: contact.id,
                phoneNumber: contact.phoneNumber,
                avatar: contact.avatar,
              })
            }>
            <CustomImage source={{uri: contact.avatar}} style={styles.recentAvatar} />
            <CustomText variant="caption" color="#FFFFFF" style={styles.recentPhone}>
              {formatPhoneNumber(contact.phoneNumber)}
            </CustomText>
          </TouchableOpacity>
        ))}
      </Animated.ScrollView>

      {/* Conversations */}
      <View style={styles.conversationsWrapper}>
        <Animated.ScrollView 
          style={[
            styles.conversationsContainer,
            { opacity: fadeAnim }
          ]}
          showsVerticalScrollIndicator={false}>
          {conversations.map((conversation) => (
            <TouchableOpacity
              key={conversation.id}
              style={styles.conversationItem}
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate('Chat', {
                  conversationId: conversation.id,
                  phoneNumber: conversation.phoneNumber,
                  avatar: conversation.avatar,
                })
              }>
              <CustomImage source={{uri: conversation.avatar}} style={styles.avatar} />
              <View style={styles.conversationContent}>
                <View style={styles.conversationHeader}>
                  <CustomText variant="title" style={styles.conversationName}>
                    {conversation.name || formatPhoneNumber(conversation.phoneNumber)}
                  </CustomText>
                  <CustomText variant="caption" style={styles.conversationDate}>
                    {conversation.date}
                  </CustomText>
                </View>
                <CustomText 
                  variant="body" 
                  style={styles.messagePreview}
                  numberOfLines={1}>
                  {conversation.lastMessage}
                </CustomText>
              </View>
            </TouchableOpacity>
          ))}
        </Animated.ScrollView>
      </View>

      {/* Animated FAB */}
      <Animated.View style={[
        styles.fab,
        {
          transform: [{ scale: scaleAnim }]
        }
      ]}>
        <TouchableOpacity
          onPress={() => {
            Animated.sequence([
              Animated.timing(scaleAnim, {
                toValue: 0.9,
                duration: 100,
                useNativeDriver: true,
              }),
              Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 40,
                friction: 7,
                useNativeDriver: true,
              })
            ]).start();
          }}>
          <Image
            source={images.plus}
            style={styles.fabIcon}
          />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1B4B',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  headerButton: {
    padding: 5,
  },
  recentContactsContainer: {
    marginTop: 20,
  },
  recentContactsContent: {
    paddingHorizontal: 20,
  },
  recentContact: {
    alignItems: 'center',
    marginRight: 20,
  },
  recentAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  recentPhone: {
    fontSize: 12,
    opacity: 0.8,
    fontWeight: '700',
  },
  conversationsWrapper: {
    height:'75%',
    backgroundColor: '#FFFFFF',
    marginTop: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  conversationsContainer: {
    flex: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  conversationDate: {
    color: '#666666',
    fontSize: 12,
  },
  messagePreview: {
    color: '#666666',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1E1B4B',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabIcon:{
    width:56,
    height:56,
    backgroundColor:'#FFFFFF',
    borderRadius:56/2
  }
});

export default ConversationsScreen;