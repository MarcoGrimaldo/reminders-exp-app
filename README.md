# Reminders App

A modern, intuitive task management application built with Expo and React Native. This app helps you organize your tasks with labels, scheduling, and a beautiful user interface that supports both light and dark themes.

![Reminders App](assets/images/icon.png)

## Features

- **Task Management**: Create, edit, and delete tasks with ease
- **Labels & Categories**: Organize tasks with customizable labels
- **Scheduling**: Set tasks for today or schedule them for future dates
- **Recurring Tasks**: Create tasks that repeat on specific days
- **Theme Support**: Light and dark themes with automatic system preference detection
- **Responsive Design**: Works on both iOS and Android devices
- **Gesture Controls**: Swipe to delete tasks
- **Persistent Storage**: Your tasks are saved locally on your device

## Screenshots

(Screenshots would be added here)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/reminders-exp-app.git
   cd reminders-exp-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

4. Run on your preferred platform:
   - Press `i` to open in iOS simulator
   - Press `a` to open in Android emulator
   - Scan the QR code with the Expo Go app on your physical device

## Usage

### Adding Tasks
- Tap the "+" button in the top right corner
- Enter task details including title, label, and schedule
- Save your task

### Managing Tasks
- Tasks are automatically organized into "For Today", "To Do Also", and "Upcoming" sections
- Tap the checkbox to mark a task as complete
- Swipe left on a task to delete it

### Changing Theme
- Tap the sun/moon icon in the top right to toggle between light and dark themes
- The app will also respect your system theme preferences

## Development

### Project Structure
- `/app`: Main application screens using Expo Router
- `/components`: Reusable UI components
- `/constants`: App constants and theme configuration
- `/context`: React Context providers
- `/hooks`: Custom React hooks
- `/utils`: Utility functions

### Key Technologies
- [Expo](https://expo.dev/): React Native development platform
- [Expo Router](https://docs.expo.dev/router/introduction/): File-based routing
- [React Native](https://reactnative.dev/): Cross-platform UI framework
- [Moti](https://moti.fyi/): Animation library
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/): Gesture recognition
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/): Local data persistence

### Building for Production
```bash
# For iOS
npx expo build:ios

# For Android
npx expo build:android
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons provided by [Expo Vector Icons](https://docs.expo.dev/guides/icons/)
- Inspired by modern task management applications
