import React, { useState, useEffect } from 'react';
import { View, Text, Button, Vibration, StyleSheet, TextInput, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

import { TextInputMask } from 'react-native-masked-text';

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: '',
    dueDate: '',
    category: 'Alimentação',
    frequency: 'Mensal',
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [paymentFrequency, setPaymentFrequency] = useState('Mensal');
  const navigation = useNavigation();

  useEffect(() => {
    loadExpenses();
  }, []);

  const saveExpenses = async (expensesToSave) => {
    try {
      const jsonExpenses = JSON.stringify(expensesToSave);
      await AsyncStorage.setItem('expenses', jsonExpenses);
    } catch (error) {
      console.error('Erro ao salvar despesas:', error);
    }
  };

  const loadExpenses = async () => {
    try {
      const jsonExpenses = await AsyncStorage.getItem('expenses');
      if (jsonExpenses) {
        const parsedExpenses = JSON.parse(jsonExpenses);
        setExpenses(parsedExpenses);
      }
    } catch (error) {
      console.error('Erro ao carregar despesas:', error);
    }
  };

  const validateFields = () => {
    if (!newExpense.name || !newExpense.amount || !newExpense.dueDate) {
      Vibration.vibrate([500, 500, 500]);
      alert('Por favor, preencha todos os campos obrigatórios.');
      return false;
    }

    // Adicione outras validações conforme necessário

    return true;
  };

  const handleInputChange = (name, value) => {
    setNewExpense((prevExpense) => ({
      ...prevExpense,
      [name]: value,
    }));
  };

  const handleAddExpense = () => {
    if (!validateFields()) {
      return;
    }

    if (editingIndex !== null) {
      const updatedExpenses = [...expenses];
      updatedExpenses[editingIndex] = newExpense;
      setExpenses(updatedExpenses);
      setEditingIndex(null);
    } else {
      setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
    }

    setNewExpense({
      name: '',
      amount: '',
      dueDate: '',
      category: 'Alimentação',
      frequency: 'Mensal',
    });

    saveExpenses(expenses);
  };

  const handleEditExpense = (index) => {
    setEditingIndex(index);
    setNewExpense(expenses[index]);
  };

  const handleDeleteExpense = async (index) => {
    const updatedExpenses = [...expenses];
    updatedExpenses.splice(index, 1);
    setExpenses(updatedExpenses);
    setEditingIndex(null);
    saveExpenses(updatedExpenses);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Nome da Despesa<Text style={styles.asterisco}>*</Text>:</Text>
        <TextInput
          style={styles.input}
          value={newExpense.name}
          onChangeText={(value) => handleInputChange('name', value)}
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
          value={newExpense.amount}
          onChangeText={(value) => handleInputChange('amount', value)}
          placeholder="Digite o valor da despesa"
        />
        <Text style={styles.label}>Data de Vencimento<Text style={styles.asterisco}>*</Text>:</Text>
        <TextInputMask
          style={styles.input}
          type={'datetime'}
          options={{
            format: 'DD/MM/YYYY',
          }}
          value={newExpense.dueDate}
          onChangeText={(value) => handleInputChange('dueDate', value)}
          placeholder="DD/MM/AAAA"
        />
        <Text style={styles.label}>Frequência de Pagamento:</Text>
        <Picker
          selectedValue={paymentFrequency}
          onValueChange={(value) => setPaymentFrequency(value)}
        >
          <Picker.Item label="Mensal" value="Mensal" />
          <Picker.Item label="Anual" value="Anual" />
          {/* Adicione mais opções conforme necessário */}
        </Picker>
        <Text style={styles.label}>Categoria:</Text>
        <Picker
          selectedValue={newExpense.category}
          onValueChange={(value) => handleInputChange('category', value)}
        >
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
        <Button title={editingIndex !== null ? 'Editar Despesa' : 'Adicionar Despesa'} onPress={handleAddExpense} />
      </View>

      <Text style={styles.heading}>Despesas Adicionadas</Text>

      {expenses.map((item, index) => (
        <View key={index} style={styles.expenseItem}>
          <Text style={styles.expenseText}>
            {item.name} - R$ {item.amount} - Vencimento: {item.dueDate} - Categoria: {item.category} - Frequência: {item.frequency}
          </Text>
          <Button title="Editar" onPress={() => handleEditExpense(index)} style={styles.editButton} />
          <Button title="Excluir" onPress={() => handleDeleteExpense(index)} style={styles.deleteButton} />
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
  expenseItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  expenseText: {
    fontSize: 16,
    marginBottom: 10,
  },
  asterisco: {
    color: 'red',
  },
});

export default ExpenseTracker;
