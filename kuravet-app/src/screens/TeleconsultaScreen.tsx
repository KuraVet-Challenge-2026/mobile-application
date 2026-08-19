import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function TeleconsultaScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Teleconsulta</Text>
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
