import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import DespesasVariaveisScreen from './src/screens/DespesasVariaveisScreen';
import ExpenseTracker from './src/screens/ExpenseTracker';
import ReceitasScreen from './src/screens/ReceitasScreen';
import CategoriasScreen from './src/screens/CategoriasScreen';
import MetasEconomiaScreen from './src/screens/MetasEconomiaScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const DespesasVariaveisStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Despesas Fixas"
      component={ExpenseTracker}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Despesa Variaveis"
      component={DespesasVariaveisScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Receita"
      component={ReceitasScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Categorias"
      component={CategoriasScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
    nome="Metas"
    component={MetasEconomiaScreen}
    options={{headerShown: false}}
    />
  </Stack.Navigator>
);

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
       
        <Tab.Screen
          name="Despesas Fixas"
          component={ExpenseTracker}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Despesas Variáveis"
          component={DespesasVariaveisScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="pricetag" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Receitas"
          component={ReceitasScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cash-outline" size={size} color={color} />
            ),
          }}
        /> 
        <Tab.Screen
          name="Categorias"
          component={CategoriasScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="folder" size={size} color={color} />
            ),
          }}
        /> 
        <Tab.Screen
          name="Metas"
          component={MetasEconomiaScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="flag" size={size} color={color} />
            ),
          }}
        /> 
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
