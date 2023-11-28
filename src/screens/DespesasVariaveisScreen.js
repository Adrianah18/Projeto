import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { TextInputMask } from 'react-native-masked-text';

const DespesasVariaveisScreen = () => {
  const [despesas, setDespesas] = useState([]);
  const [novaDespesa, setNovaDespesa] = useState({
    nome: '',
    valor: '',
    dataVencimento: '',
    recorrencia: 'Mensal',
    categoria: 'Alimentação',
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [recorrenciaPagamento, setRecorrenciaPagamento] = useState('Mensal');
  const navigation = useNavigation();

  useEffect(() => {
    // Adicione a lógica necessária aqui para carregar as despesas
  }, []);

  const saveDespesas = async (despesasToSave) => {
    try {
      const jsonDespesas = JSON.stringify(despesasToSave);
      await AsyncStorage.setItem('despesas', jsonDespesas);
    } catch (error) {
      console.error('Erro ao salvar despesas:', error);
    }
  };

  const loadDespesas = async () => {
    try {
      const jsonDespesas = await AsyncStorage.getItem('despesas');
      if (jsonDespesas) {
        const parsedDespesas = JSON.parse(jsonDespesas);
        setDespesas(parsedDespesas);
      }
    } catch (error) {
      console.error('Erro ao carregar despesas:', error);
    }
  };

  const validateFields = () => {
    if (!novaDespesa.nome || !novaDespesa.valor || !novaDespesa.dataVencimento) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return false;
    }
    return true;
  };

  const handleInputChange = (name, value) => {
    setNovaDespesa((prevDespesa) => ({
      ...prevDespesa,
      [name]: value,
    }));
  };

  const handleAdicionarDespesa = () => {
    if (!validateFields()) {
      return;
    }

    if (editingIndex !== null) {
      const updatedDespesas = [...despesas];
      updatedDespesas[editingIndex] = novaDespesa;
      setDespesas(updatedDespesas);
      setEditingIndex(null);
    } else {
      setDespesas((prevDespesas) => [...prevDespesas, novaDespesa]);
    }

    setNovaDespesa({
      nome: '',
      valor: '',
      dataVencimento: '',
      recorrencia: 'Mensal',
      categoria: 'Alimentação',
    });

    saveDespesas(despesas);
  };

  const handleEditarDespesa = (index) => {
    setEditingIndex(index);
    setNovaDespesa(despesas[index]);
  };

  const handleExcluirDespesa = async (index) => {
    const updatedDespesas = [...despesas];
    updatedDespesas.splice(index, 1);
    setDespesas(updatedDespesas);
    setEditingIndex(null);
    saveDespesas(updatedDespesas);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Nome da Despesa<Text style={styles.asterisco}>*</Text>:</Text>
        <TextInput
          style={styles.input}
          value={novaDespesa.nome}
          onChangeText={(value) => handleInputChange('nome', value)}
          placeholder="Digite o nome da despesa"
        />
        <Text style={styles.label}>Valor<Text style={styles.asterisco}>*</Text>:</Text>
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
          value={novaDespesa.valor}
          onChangeText={(value) => handleInputChange('valor', value)}
          placeholder="Digite o valor da despesa"
        />
        <Text style={styles.label}>Data de Vencimento<Text style={styles.asterisco}>*</Text>:</Text>
        <TextInputMask
          style={styles.input}
          type={'datetime'}
          options={{
            format: 'DD/MM/YYYY',
          }}
          value={novaDespesa.dataVencimento}
          onChangeText={(value) => handleInputChange('dataVencimento', value)}
          placeholder="DD/MM/AAAA"
        />
        <Text style={styles.label}>Recorrência de Pagamento:</Text>
        <Picker
          selectedValue={recorrenciaPagamento}
          onValueChange={(value) => setRecorrenciaPagamento(value)}
        >
          <Picker.Item label="Única" value="Única" />
          <Picker.Item label="Recorrente" value="Recorrente" />
          {/* Adicione mais opções conforme necessário */}
        </Picker>
        <Text style={styles.label}>Categoria:</Text>
        <Picker
          selectedValue={novaDespesa.categoria}
          onValueChange={(value) => handleInputChange('categoria', value)}
        >
          {/* Opções do Picker (código existente) */}
          <Picker.Item label="Alimentação" value="Alimentação" />
          <Picker.Item label="Moradia" value="Moradia" />
          <Picker.Item label="Higiene" value="Higiene" />
          <Picker.Item label="Contas" value="Contas" />
          <Picker.Item label="Vestuário" value="Vestuário" />
          <Picker.Item label="Saúde" value="Saúde" />
          <Picker.Item label="Carro" value="Carro" />
          <Picker.Item label="Entretenimento" value="Entretenimento" />
          <Picker.Item label="Combustível" value="Combustível" />
          <Picker.Item label="Geral" value="Geral" />
          <Picker.Item label="Férias" value="Férias" />
          <Picker.Item label="Presentes" value="Presentes" />
          <Picker.Item label="Manutenções" value="Manutenções" />
          <Picker.Item label="Beleza" value="Beleza" />

        </Picker>
        <Button title={editingIndex !== null ? 'Editar Despesa' : 'Adicionar Despesa'} onPress={handleAdicionarDespesa} />
      </View>

      <Text style={styles.heading}>Despesas Adicionadas</Text>

      {despesas.map((item, index) => (
        <View style={styles.despesaItem} key={index}>
          <Text style={styles.despesaText}>
            {item.nome} - R$ {item.valor} - Vencimento: {item.dataVencimento} - Categoria: {item.categoria} - Recorrência: {item.recorrencia}
          </Text>
          <Button title="Editar" onPress={() => handleEditarDespesa(index)} style={styles.editButton} />
          <Button title="Excluir" onPress={() => handleExcluirDespesa(index)} style={styles.deleteButton} />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 20,
  },

  form: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#d1d1d1',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  despesaItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  despesaText: {
    fontSize: 16,
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 5,
  },
  asterisco: {
    color: 'red',
  },
});

export default DespesasVariaveisScreen;
