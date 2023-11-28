import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

const MetasEconomiaScreen = () => {
  const [metas, setMetas] = useState([]);
  const [novaMeta, setNovaMeta] = useState({
    nome: '',
    valorTotal: '',
    dataLimite: '',
    dataInicio: '', // Adicionado campo para a data de início
    valorEconomizado: 0,
    contribuicao: '',
  });
  const [mensagemContribuicao, setMensagemContribuicao] = useState('');
  const [indiceEdicao, setIndiceEdicao] = useState(null);

  const handleAdicionarMeta = () => {
    if (!novaMeta.nome || !novaMeta.valorTotal || !novaMeta.dataLimite || !novaMeta.dataInicio) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos obrigatórios.');
      return;
    }

    const novaMetaComContribuicao = { ...novaMeta, contribuicao: 0 };

    if (indiceEdicao !== null) {
      const novasMetas = [...metas];
      novasMetas[indiceEdicao] = novaMetaComContribuicao;
      setMetas(novasMetas);
      setIndiceEdicao(null);
      setMensagemContribuicao('Meta atualizada');
    } else {
      setMetas((prevMetas) => [...prevMetas, novaMetaComContribuicao]);
      setMensagemContribuicao('Meta adicionada');
    }

    setNovaMeta({
      nome: '',
      valorTotal: '',
      dataLimite: '',
      dataInicio: '',
      valorEconomizado: 0,
      contribuicao: 0,
    });
  };

  const handleAdicionarContribuicao = (index) => {
    const novasMetas = [...metas];
    const contribuicaoNumerica = parseFloat(novasMetas[index].contribuicao);

    if (isNaN(contribuicaoNumerica)) {
      Alert.alert('Valor inválido', 'Insira um valor numérico válido para a contribuição.');
      return;
    }

    novasMetas[index].valorEconomizado += contribuicaoNumerica;
    setMetas(novasMetas);
    setMensagemContribuicao('Contribuição adicionada');
  };

  const handleEditarMeta = (index) => {
    const metaParaEditar = metas[index];
    setNovaMeta(metaParaEditar);
    setIndiceEdicao(index);
  };

  const handleExcluirMeta = (index) => {
    const novasMetas = [...metas];
    novasMetas.splice(index, 1);
    setMetas(novasMetas);
    setMensagemContribuicao('Meta excluída');
  };

  const calcularProgresso = (meta) => {
    const valorTotalNumerico = parseFloat(meta.valorTotal);
    const valorEconomizadoNumerico = parseFloat(meta.valorEconomizado);

    if (!isNaN(valorTotalNumerico) && !isNaN(valorEconomizadoNumerico)) {
      return (valorEconomizadoNumerico / valorTotalNumerico) * 100;
    }

    return 0;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Metas de Economia</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Nome da Meta<Text style={styles.asterisco}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome da meta"
          value={novaMeta.nome}
          onChangeText={(text) => setNovaMeta({ ...novaMeta, nome: text })}
        />
        <Text style={styles.label}>Valor Total<Text style={styles.asterisco}>*</Text></Text>
        <TextInputMask
          style={styles.input}
          type={'money'}
          options={{
            precision: 2,
            separator: ',',
            delimiter: '.',
            unit: 'R$',
            suffixUnit: '',
          }}
          value={novaMeta.valorTotal}
          onChangeText={(text) => setNovaMeta({ ...novaMeta, valorTotal: text })}
          placeholder="Digite o valor total"
        />
        <Text style={styles.label}>Data Limite<Text style={styles.asterisco}>*</Text></Text>
        <TextInputMask
          style={styles.input}
          type={'datetime'}
          options={{
            format: 'MM/YYYY',
          }}
          value={novaMeta.dataLimite}
          onChangeText={(text) => setNovaMeta({ ...novaMeta, dataLimite: text })}
          placeholder="MM/AAAA"
        />
        <Text style={styles.label}>Data de Início<Text style={styles.asterisco}>*</Text></Text>
        <TextInputMask
          style={styles.input}
          type={'datetime'}
          options={{
            format: 'DD/MM/YYYY',
          }}
          value={novaMeta.dataInicio}
          onChangeText={(text) => setNovaMeta({ ...novaMeta, dataInicio: text })}
          placeholder="DD/MM/AAAA"
        />
        <Button title="Adicionar/Editar Meta" onPress={handleAdicionarMeta} />
      </View>

      {/* Lista de Metas de Economia */}
      <View>
        <Text style={styles.heading}>Lista de Metas de Economia:</Text>
        {metas.map((item, index) => (
          <View key={index} style={styles.listItem}>
            <Text>Nome: {item.nome}</Text>
            <Text>Valor Total: R$ {item.valorTotal}</Text>
            <Text>Data Limite: {item.dataLimite}</Text>
            <Text>Data de Início: {item.dataInicio}</Text>
            <Text>Valor Economizado: R$ {item.valorEconomizado}</Text>
            <Text>Progresso: {calcularProgresso(item).toFixed(2)}%</Text>
            <TextInput
              style={styles.input}
              placeholder="Contribuição"
              value={item.contribuicao.toString()}
              onChangeText={(text) => {
                setMensagemContribuicao('');
                const novasMetas = [...metas];
                novasMetas[index].contribuicao = text;
                setMetas(novasMetas);
              }}
              keyboardType="numeric"
            />
            <Button title="Adicionar Contribuição" onPress={() => handleAdicionarContribuicao(index)} />
            <Button title="Editar Meta" onPress={() => handleEditarMeta(index)} />
            <Button title="Excluir Meta" onPress={() => handleExcluirMeta(index)} />
          </View>
        ))}
        {mensagemContribuicao ? <Text>{mensagemContribuicao}</Text> : null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  form: {
    marginTop: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: '#333333',
  },
  listItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  asterisco: {
    color: 'red',
    marginLeft: 2,
  },
});

export default MetasEconomiaScreen;
