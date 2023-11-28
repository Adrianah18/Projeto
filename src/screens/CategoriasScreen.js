import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Button, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';

const CategoriasScreen = () => {
  const [categorias, setCategorias] = useState([]);
  const [novaCategoria, setNovaCategoria] = useState({
    nome: '',
    descricao: '',
    tipo: '',
    orcamento: '',
    prioridade: null,
  });
  const [editingIndex, setEditingIndex] = useState(null);

  const handleAdicionarCategoria = () => {
    if (!novaCategoria.nome || !novaCategoria.descricao || !novaCategoria.tipo || novaCategoria.prioridade === null) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (editingIndex !== null) {
      const updatedCategorias = [...categorias];
      updatedCategorias[editingIndex] = novaCategoria;
      setCategorias(updatedCategorias);
      setEditingIndex(null);
    } else {
      setCategorias((prevCategorias) => [...prevCategorias, novaCategoria]);
    }

    setNovaCategoria({
      nome: '',
      descricao: '',
      tipo: '',
      orcamento: '',
      prioridade: null,
    });
  };

  const handleExcluirCategoria = (index) => {
    const novasCategorias = [...categorias];
    novasCategorias.splice(index, 1);
    setCategorias(novasCategorias);
    setEditingIndex(null);
  };

  const handleEditarCategoria = (index) => {
    setNovaCategoria(categorias[index]);
    setEditingIndex(index);
  };

  const renderIcon = (tipo) => {
    switch (tipo) {
      case 'Despesas':
        return <Icon name="shopping-cart" size={20} color="red" />;
      case 'Receitas':
        return <Icon name="dollar" size={20} color="green" />;
      default:
        return null;
    }
  };

  const handlePrioridadeChange = (prioridade) => {
    setNovaCategoria((prevCategoria) => ({
      ...prevCategoria,
      prioridade: prioridade === novaCategoria.prioridade ? null : prioridade,
    }));
  };

  const getPrioridadeColor = (prioridade) => {
    switch (prioridade) {
      case 'Baixa':
        return 'green';
      case 'Média':
        return 'orange';
      case 'Alta':
        return 'red';
      default:
        return 'black';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Categorias</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Nome da Categoria<Text style={styles.asterisco}>*</Text>:</Text>
        <TextInput
          style={styles.input}
          value={novaCategoria.nome}
          onChangeText={(text) => setNovaCategoria({ ...novaCategoria, nome: text })}
          placeholder="Digite o nome da categoria"
        />
        <Text style={styles.label}>Descrição<Text style={styles.asterisco}>*</Text>:</Text>
        <TextInput
          style={styles.input}
          value={novaCategoria.descricao}
          onChangeText={(text) => setNovaCategoria({ ...novaCategoria, descricao: text })}
          placeholder="Digite a descrição"
        />
        <Text style={styles.label}>Tipo de Categoria<Text style={styles.asterisco}>*</Text>:</Text>
        <Picker
          selectedValue={novaCategoria.tipo}
          onValueChange={(value) => setNovaCategoria({ ...novaCategoria, tipo: value })}
        >
          <Picker.Item label="Despesas" value="Despesas" />
          <Picker.Item label="Receitas" value="Receitas" />
        </Picker>
        <Text style={styles.label}>Orçamento Mensal/Anual:</Text>
        <TextInput
          style={styles.input}
          value={novaCategoria.orcamento}
          onChangeText={(text) => setNovaCategoria({ ...novaCategoria, orcamento: text })}
          placeholder="Digite o orçamento (opcional)"
        />
        <Text style={styles.label}>Prioridade<Text style={styles.asterisco}>*</Text>:</Text>
        <View style={styles.prioridadeContainer}>
          <View style={styles.prioridadeItem}>
            <TouchableOpacity onPress={() => handlePrioridadeChange('Baixa')}>
              <View style={[styles.prioridade, novaCategoria.prioridade === 'Baixa' && styles.prioridadeBaixa]}>
              </View>
            </TouchableOpacity>
            <Text style={styles.prioridadeLabel}>Baixa</Text>
          </View>
          <View style={styles.prioridadeItem}>
            <TouchableOpacity onPress={() => handlePrioridadeChange('Média')}>
              <View style={[styles.prioridade, novaCategoria.prioridade === 'Média' && styles.prioridadeMedia]}>
              </View>
            </TouchableOpacity>
            <Text style={styles.prioridadeLabel}>Média</Text>
          </View>
          <View style={styles.prioridadeItem}>
            <TouchableOpacity onPress={() => handlePrioridadeChange('Alta')}>
              <View style={[styles.prioridade, novaCategoria.prioridade === 'Alta' && styles.prioridadeAlta]}>
              </View>
            </TouchableOpacity>
            <Text style={styles.prioridadeLabel}>Alta</Text>
          </View>
        </View>
        <Button title={editingIndex !== null ? 'Salvar Edição' : 'Adicionar Categoria'} onPress={handleAdicionarCategoria} />
      </View>

      <Text style={styles.heading}>Categorias Adicionadas</Text>

      {categorias.map((item, index) => (
        <View style={styles.categoryItem} key={index}>
          <Text style={{ color: getPrioridadeColor(item.prioridade) }}>
            {renderIcon(item.tipo)} {item.nome} - Descrição: {item.descricao} - Tipo: {item.tipo} - Orçamento: {item.orcamento} - Prioridade: {item.prioridade}
          </Text>
          <View style={styles.categoryButtons}>
            <TouchableOpacity onPress={() => handleEditarCategoria(index)}>
              <View style={styles.editButton}>
                <Text style={styles.textoBotaoAcao}>Editar</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleExcluirCategoria(index)}>
              <View style={styles.deleteButton}>
                <Text style={styles.textoBotaoAcao}>Excluir</Text>
              </View>
            </TouchableOpacity>
          </View>
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
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
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
  prioridadeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  prioridadeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  prioridade: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#000000',
    marginRight: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prioridadeBaixa: {
    backgroundColor: 'green',
    borderColor: 'green',
  },
  prioridadeMedia: {
    backgroundColor: 'orange',
    borderColor: 'orange',
  },
  prioridadeAlta: {
    backgroundColor: 'red',
    borderColor: 'red',
  },
  prioridadeLabel: {
    color: '#000000',
  },
  asterisco: {
    color: 'red',
    marginLeft: 2,
  },
  categoryItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  categoryButtons: {
    flexDirection: 'row',
    marginTop: 10,
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
  textoBotaoAcao: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CategoriasScreen;
