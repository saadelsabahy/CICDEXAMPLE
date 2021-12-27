import {generateTestCrash, hasCrashedInLastSession} from 'appcenter-crashes';
import React, {useEffect} from 'react';
import {
  Alert,
  Button,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Input from './src/components/Input';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: Colors.lighter,
  };
  useEffect(() => {
    checkPreviousSessionCrash();
    return () => {};
  }, []);
  const checkPreviousSessionCrash = async () => {
    const hasCrashedBefore = await hasCrashedInLastSession();
    if (hasCrashedBefore) {
      Alert.alert('sorry,we are working on the issue handling');
    }
  };
  return (
    <SafeAreaView style={[backgroundStyle, styles.container]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Input />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
