export interface Conversation {
  id: string;
  phoneNumber: string;
  name?: string;
  message: string;
  date: string;
  avatar?: string;
}

export interface Contact {
  id: string;
  phoneNumber: string;
  name?: string;
  avatar?: string;
} 