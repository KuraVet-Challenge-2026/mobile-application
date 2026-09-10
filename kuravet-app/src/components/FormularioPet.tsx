import React, { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import type { PetInput, Sexo } from '../types';

// Paleta oficial do KuraVet — mesma identidade visual das telas de autenticação (ver CLAUDE.md:
// ainda replicada por arquivo, sem tema centralizado; fora do escopo desta fase de CRUD).
export const FORM_PET_COLORS = {
  background: '#DDEBF7',
  card: '#F2F7FC',
  primary: '#C9DEF2',
  text: '#333333',
  textMuted: '#666666',
};

export const ESPECIES = ['Cachorro', 'Gato'] as const;
type Especie = (typeof ESPECIES)[number];

const SEXOS: Sexo[] = ['M', 'F'];

const DATA_NASCIMENTO_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export interface FormularioPetValoresIniciais {
  nome: string;
  especie: string;
  raca: string | null;
  sexo: Sexo;
  dataNascimento: string;
}

interface FormularioPetProps {
  /** Omitido no fluxo de Create (formulário em branco); passado pelo EditarPetScreen. */
  valoresIniciais?: FormularioPetValoresIniciais;
  titulo?: string;
  subtitulo?: string;
  textoBotao: string;
  isPending: boolean;
  /** Só é chamado depois da validação de campo passar — quem recebe decide POST ou PUT. */
  onSubmit: (payload: PetInput) => void;
}

// Formulário de dados do Pet (nome, espécie, raça, sexo, nascimento): validação de campo
// obrigatório/formato e emissão de um PetInput já validado. Compartilhado entre
// src/screens/CadastroPet.tsx (Create) e src/screens/EditarPetScreen.tsx (Update) — mesma UI e
// mesma regra de validação nos dois fluxos, sem duplicar componente. Não faz nenhuma chamada à
// API: quem chama `onSubmit` decide qual hook usar (useCriarPet/useAtualizarPet, ver
// src/hooks/usePets.ts) — este componente fica só na camada de apresentação (CLAUDE.md regra 2).
export default function FormularioPet({
  valoresIniciais,
  titulo = 'Dados do Pet',
  subtitulo = 'Conte um pouco sobre o seu companheiro',
  textoBotao,
  isPending,
  onSubmit,
}: FormularioPetProps) {
  const [nome, setNome] = useState(valoresIniciais?.nome ?? '');
  const [especie, setEspecie] = useState<Especie | null>(
    (valoresIniciais?.especie as Especie | undefined) ?? null
  );
  const [raca, setRaca] = useState(valoresIniciais?.raca ?? '');
  const [sexo, setSexo] = useState<Sexo | null>(valoresIniciais?.sexo ?? null);
  const [dataNascimento, setDataNascimento] = useState(valoresIniciais?.dataNascimento ?? '');
  const [formErro, setFormErro] = useState('');

  function handleSalvar() {
    if (isPending) return;

    if (!nome.trim() || !especie || !sexo) {
      setFormErro('Preencha todos os campos para continuar.');
      return;
    }
    if (
      !DATA_NASCIMENTO_REGEX.test(dataNascimento) ||
      Number.isNaN(new Date(dataNascimento).getTime())
    ) {
      setFormErro('Informe a data de nascimento no formato AAAA-MM-DD.');
      return;
    }
    if (new Date(dataNascimento).getTime() >= Date.now()) {
      setFormErro('A data de nascimento precisa estar no passado.');
      return;
    }
    setFormErro('');

    onSubmit({
      nome: nome.trim(),
      especie,
      raca: raca.trim() || undefined,
      dataNascimento,
      sexo,
    });
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{titulo}</Text>
      <Text style={styles.subtitle}>{subtitulo}</Text>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Nome do Pet</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Ex.: Thor"
          placeholderTextColor={FORM_PET_COLORS.textMuted}
          autoCapitalize="words"
          returnKeyType="next"
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Espécie</Text>
        <View style={styles.toggleRow}>
          {ESPECIES.map((opcao) => {
            const selecionada = especie === opcao;
            return (
              <TouchableOpacity
                key={opcao}
                style={[styles.toggleOption, selecionada && styles.toggleOptionSelecionada]}
                activeOpacity={0.8}
                onPress={() => setEspecie(opcao)}
              >
                <Text style={styles.toggleLabel}>{opcao}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Raça (opcional)</Text>
        <TextInput
          style={styles.input}
          value={raca}
          onChangeText={setRaca}
          placeholder="Ex.: Golden Retriever"
          placeholderTextColor={FORM_PET_COLORS.textMuted}
          autoCapitalize="words"
          returnKeyType="next"
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Sexo</Text>
        <View style={styles.toggleRow}>
          {SEXOS.map((opcao) => {
            const selecionado = sexo === opcao;
            return (
              <TouchableOpacity
                key={opcao}
                style={[styles.toggleOption, selecionado && styles.toggleOptionSelecionada]}
                activeOpacity={0.8}
                onPress={() => setSexo(opcao)}
              >
                <Text style={styles.toggleLabel}>{opcao === 'M' ? 'Macho' : 'Fêmea'}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Nascimento</Text>
        <TextInput
          style={styles.input}
          value={dataNascimento}
          onChangeText={setDataNascimento}
          placeholder="AAAA-MM-DD"
          placeholderTextColor={FORM_PET_COLORS.textMuted}
          keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'}
          maxLength={10}
          returnKeyType="done"
          onSubmitEditing={handleSalvar}
        />
      </View>

      {!!formErro && <Text style={styles.errorText}>{formErro}</Text>}

      <TouchableOpacity
        style={[styles.button, isPending && styles.buttonDisabled]}
        activeOpacity={0.8}
        onPress={handleSalvar}
        disabled={isPending}
      >
        {isPending ? (
          <ActivityIndicator color={FORM_PET_COLORS.text} />
        ) : (
          <Text style={styles.buttonText}>{textoBotao}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: FORM_PET_COLORS.card,
    borderRadius: 28,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: FORM_PET_COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: FORM_PET_COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 24,
  },

  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: FORM_PET_COLORS.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: FORM_PET_COLORS.card,
    borderWidth: 1.5,
    borderColor: FORM_PET_COLORS.primary,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: FORM_PET_COLORS.text,
  },

  toggleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: FORM_PET_COLORS.card,
    borderWidth: 1.5,
    borderColor: FORM_PET_COLORS.primary,
    borderRadius: 14,
    paddingVertical: 12,
    gap: 8,
  },
  toggleOptionSelecionada: {
    backgroundColor: FORM_PET_COLORS.primary,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: FORM_PET_COLORS.text,
  },

  errorText: {
    color: '#B3261E',
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },

  button: {
    backgroundColor: FORM_PET_COLORS.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '800',
    color: FORM_PET_COLORS.text,
    letterSpacing: 0.5,
  },
});
