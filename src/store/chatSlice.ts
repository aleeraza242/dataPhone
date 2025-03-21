import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {Conversation, Message, Contact} from '../types/chat';
import {conversations as mockConversations, recentContacts as mockContacts} from '../data/mockData';

interface ChatState {
  conversations: Conversation[];
  contacts: Contact[];
  activeConversationId: string | null;
}

const initialState: ChatState = {
  conversations: mockConversations,
  contacts: mockContacts,
  activeConversationId: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload;
    },
    sendMessage: (state, action: PayloadAction<{conversationId: string; text: string}>) => {
      const conversation = state.conversations.find(
        conv => conv.id === action.payload.conversationId,
      );
      if (conversation) {
        const newMessage: Message = {
          id: Date.now().toString(),
          text: action.payload.text,
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          sender: 'me',
        };
        conversation.messages.push(newMessage);
        conversation.lastMessage = action.payload.text;
        conversation.date = 'Just now';
      }
    },
    receiveMessage: (
      state,
      action: PayloadAction<{conversationId: string; text: string}>,
    ) => {
      const conversation = state.conversations.find(
        conv => conv.id === action.payload.conversationId,
      );
      if (conversation) {
        const newMessage: Message = {
          id: Date.now().toString(),
          text: action.payload.text,
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          sender: 'them',
        };
        conversation.messages.push(newMessage);
        conversation.lastMessage = action.payload.text;
        conversation.date = 'Just now';
        if (conversation.id !== state.activeConversationId) {
          conversation.unreadCount = (conversation.unreadCount || 0) + 1;
        }
      }
    },
    markConversationAsRead: (state, action: PayloadAction<string>) => {
      const conversation = state.conversations.find(
        conv => conv.id === action.payload,
      );
      if (conversation) {
        conversation.unreadCount = 0;
      }
    },
  },
});

export const {
  setActiveConversation,
  sendMessage,
  receiveMessage,
  markConversationAsRead,
} = chatSlice.actions;

export default chatSlice.reducer; 