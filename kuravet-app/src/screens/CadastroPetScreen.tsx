import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function CadastroPetScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Cadastro de Pet</Text>
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
