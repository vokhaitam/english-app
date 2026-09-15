import { topic as greetingsTopic, words as greetingsWords } from './vocab/greetings.js';
import { topic as numbersTimeTopic, words as numbersTimeWords } from './vocab/numbersTime.js';
import { topic as familyTopic, words as familyWords } from './vocab/family.js';
import { topic as bodyHealthTopic, words as bodyHealthWords } from './vocab/bodyHealth.js';
import { topic as foodDrinksTopic, words as foodDrinksWords } from './vocab/foodDrinks.js';
import { topic as homePlacesTopic, words as homePlacesWords } from './vocab/homePlaces.js';
import { topic as schoolWorkTopic, words as schoolWorkWords } from './vocab/schoolWork.js';
import { topic as travelDailyTopic, words as travelDailyWords } from './vocab/travelDaily.js';
import { topic as animalsNatureTopic, words as animalsNatureWords } from './vocab/animalsNature.js';
import { topic as clothesFashionTopic, words as clothesFashionWords } from './vocab/clothesFashion.js';
import { topic as sportsHobbiesTopic, words as sportsHobbiesWords } from './vocab/sportsHobbies.js';
import { topic as emotionsPersonalityTopic, words as emotionsPersonalityWords } from './vocab/emotionsPersonality.js';
import { topic as technologyMediaTopic, words as technologyMediaWords } from './vocab/technologyMedia.js';
import { topic as environmentSocietyTopic, words as environmentSocietyWords } from './vocab/environmentSociety.js';
import { topic as transportationTopic, words as transportationWords } from './vocab/transportation.js';
import { topic as weatherTopic, words as weatherWords } from './vocab/weather.js';
import { topic as householdItemsTopic, words as householdItemsWords } from './vocab/householdItems.js';
import { topic as shoppingTopic, words as shoppingWords } from './vocab/shopping.js';
import { topic as natureTopic, words as natureWords } from './vocab/nature.js';
import { topic as directionsTopic, words as directionsWords } from './vocab/directions.js';
import { topic as phoneInternetTopic, words as phoneInternetWords } from './vocab/phoneInternet.js';
import { topic as servicesTopic, words as servicesWords } from './vocab/services.js';
import { topic as emergenciesTopic, words as emergenciesWords } from './vocab/emergencies.js';
import { topic as workplaceTopic, words as workplaceWords } from './vocab/workplace.js';
import { topic as scienceTopic, words as scienceWords } from './vocab/science.js';
import { topic as newsMediaTopic, words as newsMediaWords } from './vocab/newsMedia.js';

export const levels = [
  {
    id: 'basic',
    label: 'Từ vựng cơ bản',
    icon: '🌱',
    color: '#66BB6A',
    desc: 'Bắt đầu với những từ vựng quan trọng nhất',
  },
  {
    id: 'communication',
    label: 'Từ vựng giao tiếp',
    icon: '💬',
    color: '#29B6F6',
    desc: 'Từ vựng dùng nhiều trong giao tiếp hằng ngày',
  },
  {
    id: 'advanced',
    label: 'Từ vựng nâng cao',
    icon: '🚀',
    color: '#F06292',
    desc: 'Từ vựng khó hơn giúp nâng trình độ',
  },
];

export const topics = [
  greetingsTopic,
  numbersTimeTopic,
  familyTopic,
  bodyHealthTopic,
  foodDrinksTopic,
  homePlacesTopic,
  schoolWorkTopic,
  travelDailyTopic,
  animalsNatureTopic,
  clothesFashionTopic,
  sportsHobbiesTopic,
  emotionsPersonalityTopic,
  technologyMediaTopic,
  environmentSocietyTopic,
  transportationTopic,
  weatherTopic,
  householdItemsTopic,
  shoppingTopic,
  natureTopic,
  directionsTopic,
  phoneInternetTopic,
  servicesTopic,
  emergenciesTopic,
  workplaceTopic,
  scienceTopic,
  newsMediaTopic,
];

export const vocabulary = {
  greetings: greetingsWords,
  'numbers-time': numbersTimeWords,
  family: familyWords,
  'body-health': bodyHealthWords,
  'food-drinks': foodDrinksWords,
  'home-places': homePlacesWords,
  'school-work': schoolWorkWords,
  'travel-daily': travelDailyWords,
  'animals-nature': animalsNatureWords,
  'clothes-fashion': clothesFashionWords,
  'sports-hobbies': sportsHobbiesWords,
  'emotions-personality': emotionsPersonalityWords,
  'technology-media': technologyMediaWords,
  'environment-society': environmentSocietyWords,
  'transportation': transportationWords,
  'weather': weatherWords,
  'household-items': householdItemsWords,
  'shopping': shoppingWords,
  'nature': natureWords,
  'directions': directionsWords,
  'phone-internet': phoneInternetWords,
  'services': servicesWords,
  'emergencies': emergenciesWords,
  'workplace': workplaceWords,
  'science': scienceWords,
  'news-media': newsMediaWords,
};

export const getAllWords = () => {
  return Object.entries(vocabulary).flatMap(([topicId, words]) =>
    words.map(w => ({ ...w, topicId }))
  );
};