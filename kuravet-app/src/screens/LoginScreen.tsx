import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
