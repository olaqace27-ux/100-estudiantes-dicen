import { Question } from '../types';

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q1',
    title: 'We asked 100 people: Name something you must bring to a barbecue.',
    category: 'Food & Cooking',
    answers: [
      { id: 'a1_1', text: 'Meat / Burgers / Ribs', points: 38, revealed: false },
      { id: 'a1_2', text: 'Charcoal / Firewood', points: 24, revealed: false },
      { id: 'a1_3', text: 'Beer / Cold Drinks', points: 16, revealed: false },
      { id: 'a1_4', text: 'Potato Salad / Chips', points: 11, revealed: false },
      { id: 'a1_5', text: 'BBQ Sauce / Ketchup', points: 7, revealed: false },
      { id: 'a1_6', text: 'Hamburger / Hot Dog Buns', points: 4, revealed: false },
    ],
  },
  {
    id: 'q2',
    title: 'We asked 100 people: What is the first thing you do when the power goes out?',
    category: 'Everyday Life',
    answers: [
      { id: 'a2_1', text: 'Find a flashlight or candles', points: 44, revealed: false },
      { id: 'a2_2', text: 'Turn on phone flashlight', points: 23, revealed: false },
      { id: 'a2_3', text: 'Check if neighbors lost power too', points: 15, revealed: false },
      { id: 'a2_4', text: 'Gasp / Complain', points: 11, revealed: false },
      { id: 'a2_5', text: 'Unplug sensitive electronics', points: 7, revealed: false },
    ],
  },
  {
    id: 'q3',
    title: 'We asked 100 people: Classic excuse for being late to work or school.',
    category: 'Work & Excuses',
    answers: [
      { id: 'a3_1', text: 'Heavy traffic or delayed bus/train', points: 41, revealed: false },
      { id: 'a3_2', text: 'Alarm didn\'t go off / Overslept', points: 26, revealed: false },
      { id: 'a3_3', text: 'Car wouldn\'t start or flat tire', points: 18, revealed: false },
      { id: 'a3_4', text: 'Plumbing leak or home emergency', points: 9, revealed: false },
      { id: 'a3_5', text: 'Lost my keys or wallet', points: 6, revealed: false },
    ],
  },
  {
    id: 'q4',
    title: 'We asked 100 people: Name something people eat or drink on a rainy day.',
    category: 'Comfort Food',
    answers: [
      { id: 'a4_1', text: 'Hot soup or stew', points: 48, revealed: false },
      { id: 'a4_2', text: 'Hot chocolate or tea', points: 21, revealed: false },
      { id: 'a4_3', text: 'Fresh baked cookies / Pastries', points: 15, revealed: false },
      { id: 'a4_4', text: 'Macaroni and cheese or pasta', points: 10, revealed: false },
      { id: 'a4_5', text: 'Popcorn', points: 6, revealed: false },
    ],
  },
  {
    id: 'q5',
    title: 'We asked 100 people: Name something that always gets lost inside the house.',
    category: 'Around the House',
    answers: [
      { id: 'a5_1', text: 'TV Remote Control', points: 39, revealed: false },
      { id: 'a5_2', text: 'House / Car Keys', points: 30, revealed: false },
      { id: 'a5_3', text: 'Cell Phone', points: 17, revealed: false },
      { id: 'a5_4', text: 'Reading Glasses or Sunglasses', points: 9, revealed: false },
      { id: 'a5_5', text: 'Single sock from a pair', points: 5, revealed: false },
    ],
  },
  {
    id: 'q6',
    title: 'We asked 100 people: Name something you carry in your bag for a long day out.',
    category: 'Daily Essentials',
    answers: [
      { id: 'a6_1', text: 'Phone charger / Power bank', points: 36, revealed: false },
      { id: 'a6_2', text: 'Water bottle / Thermos', points: 28, revealed: false },
      { id: 'a6_3', text: 'Tissues / Hand sanitizer', points: 16, revealed: false },
      { id: 'a6_4', text: 'Umbrella or jacket', points: 11, revealed: false },
      { id: 'a6_5', text: 'Snacks / Fruit', points: 9, revealed: false },
    ],
  },
  {
    id: 'q7',
    title: 'We asked 100 people: Name a profession that commands high respect.',
    category: 'Jobs & Careers',
    answers: [
      { id: 'a7_1', text: 'Doctor / Surgeon', points: 42, revealed: false },
      { id: 'a7_2', text: 'Firefighter', points: 25, revealed: false },
      { id: 'a7_3', text: 'Teacher / Professor', points: 18, revealed: false },
      { id: 'a7_4', text: 'Veterinarian', points: 9, revealed: false },
      { id: 'a7_5', text: 'Airplane Pilot', points: 6, revealed: false },
    ],
  },
  {
    id: 'q8',
    title: 'We asked 100 people: Name a place where people unexpectedly fall asleep.',
    category: 'Humor & Habits',
    answers: [
      { id: 'a8_1', text: 'On the bus, train, or subway', points: 43, revealed: false },
      { id: 'a8_2', text: 'On the couch watching TV', points: 31, revealed: false },
      { id: 'a8_3', text: 'At the movie theater', points: 13, revealed: false },
      { id: 'a8_4', text: 'In a boring meeting or class', points: 8, revealed: false },
      { id: 'a8_5', text: 'At the beach / Park grass', points: 5, revealed: false },
    ],
  },
];
