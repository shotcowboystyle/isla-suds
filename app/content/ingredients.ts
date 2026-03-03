import {Palmtree, Leaf, Droplet, Circle, Sparkles, Milk, Flower} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';

export interface IngredientItem {
  id: number;
  name: string;
  scientificName?: string;
  description: string;
  videoSrc: string;
  iconOrder: number;
  icon: LucideIcon;
  startingPositionsMobile: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  startingPositions: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
}

export const INGREDIENTS: IngredientItem[] = [
  {
    id: 1,
    name: 'Coconut Oil',
    scientificName: '',
    description:
      'Coconut oil is a natural moisturizer that helps to hydrate and nourish the skin. It is also a natural anti-inflammatory, which can help to reduce redness and irritation.',
    videoSrc: '/videos/ingredient-video-1.mov',
    iconOrder: 1,
    icon: Palmtree,
    startingPositionsMobile: {
      top: 'auto',
      bottom: '19.5vw',
      left: '26.5vw',
    },
    startingPositions: {
      top: 'auto',
      bottom: '12.5vw',
      left: '-13.5vw',
    },
  },
  {
    id: 2,
    name: 'Palm Oil',
    scientificName: '',
    description:
      'Palm oil is a natural moisturizer that helps to hydrate and nourish the skin. It is also a natural anti-inflammatory, which can help to reduce redness and irritation.',
    videoSrc: '/videos/ingredient-video-1.mov',
    iconOrder: 1,
    icon: Leaf,
    startingPositionsMobile: {
      top: 'auto',
      bottom: '42.5vw',
      left: '22.5vw',
    },
    startingPositions: {
      top: 'auto',
      bottom: '42.5vw',
      left: '-0.5vw',
    },
  },
  {
    id: 3,
    name: 'Castor Oil',
    scientificName: '',
    description:
      'Castor oil is a natural moisturizer that helps to hydrate and nourish the skin. It is also a natural anti-inflammatory, which can help to reduce redness and irritation.',
    videoSrc: '/videos/ingredient-video-1.mov',
    iconOrder: 2,
    icon: Droplet,
    startingPositionsMobile: {
      top: '4vw',
      left: 'auto',
      right: '24.5vw',
    },
    startingPositions: {
      top: '42vw',
      left: 'auto',
      right: '-15.5vw',
    },
  },
  {
    id: 4,
    name: 'Olive Oil',
    scientificName: '',
    description:
      'Extra virgin organic olive oil naturally soothes skin inflammation. Its a natural moisturizer that helps to hydrate and nourish the skin. It is also a natural anti-inflammatory, which can help to reduce redness and irritation.',
    videoSrc: '/videos/ingredient-video-1.mov',
    iconOrder: 2,
    icon: Circle,
    startingPositionsMobile: {
      bottom: '40vw',
      left: 'auto',
      right: '24.5vw',
    },
    startingPositions: {
      bottom: '40vw',
      left: 'auto',
      right: '-15.5vw',
    },
  },
  {
    id: 5,
    name: 'Shea Butter',
    scientificName: '',
    description:
      "Shea butter is a natural moisturizer that helps to hydrate and nourish the skin. It is also a natural anti-inflammatory, which can help to reduce redness and irritation. We choose only the best unrefined butters that haven't been bleached or deodorized.",
    videoSrc: '/videos/ingredient-video-1.mov',
    iconOrder: 1,
    icon: Sparkles,
    startingPositionsMobile: {
      top: '21vw',
      left: '50.5vw',
    },
    startingPositions: {
      top: '37vw',
      left: '-3.5vw',
    },
  },
  {
    id: 6,
    name: 'Goats Milk',
    scientificName: '',
    description:
      'A powerhouse of fats, lipoproteins, and vitamins., goats milk is a natural moisturizer that helps to hydrate and nourish the skin. It is also a natural anti-inflammatory, which can help to reduce redness and irritation.',
    videoSrc: '/videos/ingredient-video-1.mov',
    iconOrder: 1,
    icon: Milk,
    startingPositionsMobile: {
      top: '47vw',
      left: '42vw',
    },
    startingPositions: {
      top: '47vw',
      left: '9vw',
    },
  },
  {
    id: 7,
    name: 'Pure Essential Oils',
    scientificName: '',
    description:
      'Pure essential oils are natural oils that are extracted from plants. They are used to add fragrance and flavor to products. ',
    videoSrc: '/videos/ingredient-video-1.mov',
    iconOrder: 2,
    icon: Flower,
    startingPositionsMobile: {
      top: '-6vw',
      left: 'auto',
      right: '64vw',
    },
    startingPositions: {
      top: '42vw',
      left: 'auto',
      right: '9vw',
    },
  },
];
