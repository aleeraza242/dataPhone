import type {Conversation, Contact} from '../types/chat';

export const recentContacts: Contact[] = [
  {
    id: '1',
    phoneNumber: '9296009611',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    phoneNumber: '9297170303',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    phoneNumber: '9297170304',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: '4',
    phoneNumber: '9297170305',
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
];

export const conversations: Conversation[] = [
  {
    id: '1',
    phoneNumber: '5166046735',
    lastMessage: "I'll call you right back",
    date: '08:43',
    avatar: 'https://i.pravatar.cc/150?img=5',
    messages: [
      {
        id: '1',
        text: "I'll call you right back",
        time: '08:43',
        sender: 'them',
      },
    ],
  },
  {
    id: '2',
    phoneNumber: '7188510642',
    lastMessage: 'This is your direct number',
    date: 'Tue',
    avatar: 'https://i.pravatar.cc/150?img=6',
    messages: [
      {
        id: '1',
        text: 'This is your direct number',
        time: '12:00',
        sender: 'them',
      },
    ],
  },
  {
    id: '3',
    phoneNumber: '9297170304',
    name: 'Nate Klein',
    lastMessage: 'got it',
    date: 'Sun',
    avatar: 'https://i.pravatar.cc/150?img=7',
    messages: [
      {
        id: '1',
        text: 'got it',
        time: '14:30',
        sender: 'them',
      },
    ],
  },
  {
    id: '4',
    phoneNumber: '9297170305',
    name: 'Ahron Greenberg',
    lastMessage: 'Bonei Olam Dreidel for a Chance...',
    date: '23 Mar',
    avatar: 'https://i.pravatar.cc/150?img=8',
    messages: [
      {
        id: '1',
        text: 'Bonei Olam Dreidel for a Chance...',
        time: '15:45',
        sender: 'them',
      },
    ],
  },
  {
    id: '5',
    phoneNumber: '8332665655',
    lastMessage: "I'm Sarah from Marriott Internatio...",
    date: '18 Mar',
    avatar: 'https://i.pravatar.cc/150?img=9',
    messages: [
      {
        id: '1',
        text: "I'm Sarah from Marriott International...",
        time: '16:20',
        sender: 'them',
      },
    ],
  },
  {
    id: '6',
    phoneNumber: '9294412489',
    lastMessage: 'How can I undo the damage?',
    date: '01 Feb',
    avatar: 'https://i.pravatar.cc/150?img=10',
    messages: [
      {
        id: '1',
        text: 'How can I undo the damage?',
        time: '09:15',
        sender: 'them',
      },
    ],
  },
  {
    id: '7',
    phoneNumber: '7185342672',
    lastMessage: 'This is a test message.',
    date: '01 Feb',
    avatar: 'https://i.pravatar.cc/150?img=11',
    messages: [
      {
        id: '1',
        text: 'This is a test message.',
        time: '10:00',
        sender: 'them',
      },
    ],
  },
  {
    id: '8',
    phoneNumber: '7188510642',
    lastMessage: 'This is your direct number',
    date: '23 Mar',
    avatar: 'https://i.pravatar.cc/150?img=12',
    messages: [
      {
        id: '1',
        text: 'This is your direct number',
        time: '11:30',
        sender: 'them',
      },
    ],
  },
]; 