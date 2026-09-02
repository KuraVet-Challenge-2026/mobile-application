import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Switch,
    ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../routes';

type ConfiguracoesNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Configuracoes'>;

export default function ConfiguracoesScreen() {
    const navigation = useNavigation<ConfiguracoesNavigationProp>();

    // Estados para os botões de alternância (Switches)
    const [notificacoes, setNotificacoes] = useState(true);
    const [modoEscuro, setModoEscuro] = useState(false);
    const [localizacao, setLocalizacao] = useState(true);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>

                <Text style={styles.sectionHeader}>Preferências do Aplicativo</Text>

                {/* Opção de Notificações */}
                <View style={styles.settingItem}>
                    <View style={styles.settingTextWrap}>
                        <Text style={styles.settingTitle}>Notificações Push</Text>
                        <Text style={styles.settingSubtext}>Receber alertas de consultas e vacinas</Text>
                    </View>
                    <Switch
                        trackColor={{ false: '#C9DEF2', true: '#9FC6EA' }}
                        thumbColor={notificacoes ? '#1E4E79' : '#f4f3f4'}
                        onValueChange={() => setNotificacoes(previousState => !previousState)}
                        value={notificacoes}
                    />
                </View>

                {/* Opção de Modo Escuro */}
                <View style={styles.settingItem}>
                    <View style={styles.settingTextWrap}>
                        <Text style={styles.settingTitle}>Modo Escuro</Text>
                        <Text style={styles.settingSubtext}>Ajustar a aparência visual do app</Text>
                    </View>
                    <Switch
                        trackColor={{ false: '#C9DEF2', true: '#9FC6EA' }}
                        thumbColor={modoEscuro ? '#1E4E79' : '#f4f3f4'}
                        onValueChange={() => setModoEscuro(previousState => !previousState)}
                        value={modoEscuro}
                    />
                </View>

                {/* Opção de Localização */}
                <View style={styles.settingItem}>
                    <View style={styles.settingTextWrap}>
                        <Text style={styles.settingTitle}>Usar Localização</Text>
                        <Text style={styles.settingSubtext}>Encontrar clínicas parceiras próximas</Text>
                    </View>
                    <Switch
                        trackColor={{ false: '#C9DEF2', true: '#9FC6EA' }}
                        thumbColor={localizacao ? '#1E4E79' : '#f4f3f4'}
                        onValueChange={() => setLocalizacao(previousState => !previousState)}
                        value={localizacao}
                    />
                </View>

                <Text style={[styles.sectionHeader, { marginTop: 32 }]}>Suporte e Informações</Text>

                {/* Links de navegação ou modais informativos */}
                <View style={styles.menuContainer}>
                    <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                        <Text style={styles.menuText}>Política de Privacidade</Text>
                        <Text style={styles.chevron}>&gt;</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                        <Text style={styles.menuText}>Termos de Uso</Text>
                        <Text style={styles.chevron}>&gt;</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} activeOpacity={0.7}>
                        <Text style={styles.menuText}>Sobre o KuraVet</Text>
                        <Text style={styles.chevron}>&gt;</Text>
                    </TouchableOpacity>
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
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F2F7FC',
        borderRadius: 20,
        paddingVertical: 14,
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    settingTextWrap: {
        flex: 1,
        marginRight: 16,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E4E79',
    },
    settingSubtext: {
        fontSize: 12,
        color: '#4C7EA8',
        marginTop: 2,
    },
    menuContainer: {
        backgroundColor: '#F2F7FC',
        borderRadius: 20,
        paddingVertical: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E2EAF2',
    },
    menuText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1E4E79',
    },
    chevron: {
        fontSize: 18,
        fontWeight: '600',
        color: '#A3C1DA',
    },
});