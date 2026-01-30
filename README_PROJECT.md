# MyDrama - React Native Project

A React Native application built with Expo, featuring navigation, components, and a modern development setup.

## Project Structure

```
mydrama/
├── app/                 # App navigation and screens
├── components/          # Reusable React components
├── constants/           # App constants
├── hooks/               # Custom React hooks
├── scripts/             # Build and utility scripts
├── assets/              # Images, fonts, and other assets
├── app.json             # Expo configuration
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (installed via npm)

### Installation

All dependencies are already installed. If you need to reinstall them:

```bash
npm install
```

### Running the Project

Start the development server:

```bash
npm start
```

This will start the Expo development server. You can then:

- Press `a` to open on Android
- Press `i` to open on iOS (macOS only)
- Press `w` to open in web browser

### Available Scripts

- `npm start` - Start the development server
- `npm run android` - Build and run on Android emulator
- `npm run ios` - Build and run on iOS simulator (macOS only)
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint for code quality checks
- `npm run reset-project` - Reset project to default state

## Key Libraries

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform for React Native
- **React Navigation** - Navigation library with bottom tabs
- **Reanimated** - Animation library
- **TypeScript** - Type-safe JavaScript
- **Expo Router** - File-based routing

## Development

This project uses:

- **TypeScript** for type safety
- **ESLint** for code quality
- **Expo Router** for file-based routing
- **React Navigation** for screen navigation

### Code Quality

To check code quality:

```bash
npm run lint
```

## Building for Production

### iOS

```bash
npx eas build --platform ios
```

### Android

```bash
npx eas build --platform android
```

## Project Features

- Bottom tab navigation
- Navigation between screens
- Custom hooks for state management
- TypeScript support
- ESLint configuration
- Responsive design for multiple screen sizes

## Troubleshooting

If you encounter issues:

1. Clear cache: `npm run reset-project`
2. Clear node_modules: `rm -rf node_modules && npm install`
3. Clear Expo cache: `expo start -c`

## Learn More

- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [React Navigation Docs](https://reactnavigation.org)

---

**Project Status**: Ready for development  
**Last Updated**: January 30, 2026
