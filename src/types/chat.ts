export interface Message {
  id: string;
  text: string;
  time: string;
  sender: 'me' | 'them';
}

export interface Conversation {
  id: string;
  phoneNumber: string;
  name?: string;
  lastMessage?: string;
  date: string;
  avatar?: string;
  messages: Message[];
  unreadCount?: number;
}

export interface Contact {
  id: string;
  phoneNumber: string;
  name?: string;
  avatar?: string;
} 