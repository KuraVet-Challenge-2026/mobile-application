import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../routes';

import { auth } from '../config/firebaseConfig';

type ConfiguracoesNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Configuracoes'>;

export default function ConfiguracoesScreen() {
    const navigation = useNavigation<ConfiguracoesNavigationProp>();
    const [userData, setUserData] = useState({
        nome: '',
        email: '',
    });

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUserData({
                nome: currentUser.displayName || 'Usuário KuraVet',
                email: currentUser.email || 'Não informado',
            });
        }
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>

                <Text style={styles.sectionHeader}>Dados da Conta</Text>

                {/* Nome */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoLabel}>Nome cadastrado</Text>
                    <Text style={styles.infoValue}>{userData.nome}</Text>
                </View>

                {/* E-mail */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoLabel}>E-mail de acesso</Text>
                    <Text style={styles.infoValue}>{userData.email}</Text>
                </View>

                {/* Senha */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoLabel}>Senha</Text>
                    <Text style={styles.infoValue}>********</Text>
                    <Text style={styles.infoHint}>Por segurança, a senha é criptografada.</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#DDEBF7',
    },
    container: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 40,
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: '700',
        color: '#4C7EA8',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    infoCard: {
        backgroundColor: '#F2F7FC',
        borderRadius: 20,
        paddingVertical: 16,
        paddingHorizontal: 20,
        marginBottom: 12,
        shadowColor: '#1E4E79',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    infoLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#4C7EA8',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E4E79',
    },
    infoHint: {
        fontSize: 11,
        color: '#8CAECF',
        marginTop: 4,
    },
});