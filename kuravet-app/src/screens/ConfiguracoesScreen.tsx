import React, { useMemo } from 'react';
import {
    ActivityIndicator,
    Alert,
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../routes';
import { useAuth } from '../auth/AuthContext';
import { useTutor, useExcluirTutor } from '../hooks/useTutores';
import { getApiErrorMessage } from '../utils/apiErrorMessage';
import { useAppTheme } from '../theme';
import type { PaletaCores } from '../theme';

type ConfiguracoesNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Configuracoes'>;

export default function ConfiguracoesScreen() {
    const navigation = useNavigation<ConfiguracoesNavigationProp>();
    const { usuario, logout } = useAuth();
    const { colors } = useAppTheme();
    const styles = useMemo(() => criarEstilos(colors), [colors]);

    const { data: tutor, isLoading, isError, error } = useTutor(usuario?.idTutor ?? undefined);
    const { mutate: excluirConta, isPending: isExcluindo } = useExcluirTutor();

    const nomeExibido = usuario?.nomeTutor || usuario?.username || 'Usuário KuraVet';
    const perfilExibido = usuario?.perfil === 'VETERINARIO' ? 'Veterinário' : 'Tutor';

    function handleExcluirConta() {
        if (!usuario?.idTutor) return;

        Alert.alert(
            'Excluir conta',
            'Tem certeza que deseja excluir sua conta? Todos os seus dados de tutor serão removidos e você será desconectado. Essa ação não pode ser desfeita.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir conta',
                    style: 'destructive',
                    onPress: () => {
                        excluirConta(usuario.idTutor as number, {
                            onSuccess: async () => {
                                await logout();
                            },
                            onError: (erro) => {
                                Alert.alert('Não foi possível excluir sua conta', getApiErrorMessage(erro));
                            },
                        });
                    },
                },
            ]
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>

                <Text style={styles.sectionHeader}>Dados da Conta</Text>

                <View style={styles.infoCard}>
                    <Text style={styles.infoLabel}>Nome cadastrado</Text>
                    <Text style={styles.infoValue}>{nomeExibido}</Text>
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.infoLabel}>Usuário de acesso</Text>
                    <Text style={styles.infoValue}>{usuario?.username || 'Não informado'}</Text>
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.infoLabel}>Perfil</Text>
                    <Text style={styles.infoValue}>{perfilExibido}</Text>
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.infoLabel}>Senha</Text>
                    <Text style={styles.infoValue}>********</Text>
                    <Text style={styles.infoHint}>Por segurança, a senha é criptografada.</Text>
                </View>

                {usuario?.perfil === 'TUTOR' && (
                    <>
                        <Text style={[styles.sectionHeader, styles.sectionHeaderSpaced]}>
                            Dados de Tutor
                        </Text>

                        {isLoading && (
                            <View style={styles.centerBox}>
                                <ActivityIndicator color={colors.title} />
                            </View>
                        )}

                        {!isLoading && isError && (
                            <View style={styles.messageBox}>
                                <Text style={styles.errorText}>
                                    {getApiErrorMessage(
                                        error,
                                        'Não foi possível carregar seus dados completos agora. Verifique sua conexão e tente novamente.'
                                    )}
                                </Text>
                            </View>
                        )}

                        {!isLoading && !isError && tutor && (
                            <>
                                <View style={styles.infoCard}>
                                    <Text style={styles.infoLabel}>CPF</Text>
                                    <Text style={styles.infoValue}>{tutor.cpf}</Text>
                                </View>
                                <View style={styles.infoCard}>
                                    <Text style={styles.infoLabel}>Telefone</Text>
                                    <Text style={styles.infoValue}>{tutor.telefone || 'Não informado'}</Text>
                                </View>
                                <View style={styles.infoCard}>
                                    <Text style={styles.infoLabel}>E-mail</Text>
                                    <Text style={styles.infoValue}>{tutor.email || 'Não informado'}</Text>
                                </View>
                                <View style={styles.infoCard}>
                                    <Text style={styles.infoLabel}>Endereço</Text>
                                    <Text style={styles.infoValue}>{tutor.endereco || 'Não informado'}</Text>
                                </View>
                                <View style={styles.infoCard}>
                                    <Text style={styles.infoLabel}>Cadastro desde</Text>
                                    <Text style={styles.infoValue}>{tutor.dataCadastro}</Text>
                                </View>

                                <TouchableOpacity
                                    style={styles.editButton}
                                    activeOpacity={0.8}
                                    onPress={() => navigation.navigate('EditarPerfil')}
                                >
                                    <Text style={styles.editButtonText}>EDITAR PERFIL</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.deleteButton, isExcluindo && styles.buttonDisabled]}
                                    activeOpacity={0.8}
                                    onPress={handleExcluirConta}
                                    disabled={isExcluindo}
                                >
                                    {isExcluindo ? (
                                        <ActivityIndicator color={colors.error} />
                                    ) : (
                                        <Text style={styles.deleteButtonText}>EXCLUIR CONTA</Text>
                                    )}
                                </TouchableOpacity>
                            </>
                        )}
                    </>
                )}

            </ScrollView>
        </SafeAreaView>
    );
}

function criarEstilos(c: PaletaCores) {
    return StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: c.background,
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
            color: c.textSecondary,
            marginBottom: 12,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
        sectionHeaderSpaced: {
            marginTop: 8,
        },
        infoCard: {
            backgroundColor: c.card,
            borderRadius: 20,
            paddingVertical: 16,
            paddingHorizontal: 20,
            marginBottom: 12,
            shadowColor: c.title,
            shadowOpacity: 0.05,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 4,
            elevation: 2,
        },
        infoLabel: {
            fontSize: 12,
            fontWeight: '700',
            color: c.textSecondary,
            marginBottom: 4,
            textTransform: 'uppercase',
        },
        infoValue: {
            fontSize: 16,
            fontWeight: '700',
            color: c.title,
        },
        infoHint: {
            fontSize: 11,
            color: c.textTerciario,
            marginTop: 4,
        },

        centerBox: {
            paddingVertical: 24,
            alignItems: 'center',
            justifyContent: 'center',
        },
        messageBox: {
            backgroundColor: c.card,
            borderRadius: 16,
            padding: 16,
            marginBottom: 12,
        },
        errorText: {
            color: c.error,
            fontSize: 14,
            textAlign: 'center',
            lineHeight: 20,
        },

        editButton: {
            backgroundColor: c.primary,
            borderRadius: 14,
            paddingVertical: 15,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 8,
        },
        editButtonText: {
            fontSize: 15,
            fontWeight: '800',
            color: c.text,
            letterSpacing: 0.5,
        },
        deleteButton: {
            backgroundColor: c.errorBackground,
            borderRadius: 14,
            paddingVertical: 15,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 12,
            borderWidth: 1,
            borderColor: c.errorBorder,
        },
        buttonDisabled: {
            opacity: 0.7,
        },
        deleteButtonText: {
            fontSize: 15,
            fontWeight: '800',
            color: c.error,
            letterSpacing: 0.5,
        },
    });
}
