import { StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from './screens/login';  
import Home from './screens/home'; 
import AltaCarga from './screens/altaCarga';
import Perfil from './screens/perfil'; 
import register from './screens/register';
import Navbar from './components/navbar';
import Catalogo from './screens/catalogo'
import HomeDriver from './screens/home_driver';
import { AuthProvider } from './context/auth';


const Stack = createStackNavigator();

export default function App() {
  function MyStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="login" component={Login} 
        options={{
          title:'HAUL',
          headerTintColor:'white',
          headerTitleAlign:'center',
          herderStyle: {backgroundColor:'#525FE1'},
          headerShown:false
        }}/>
        <Stack.Screen name="register" component={register} 
        options={{
          headerShown:false
        }}/>   
        <Stack.Screen name="home" component={Home}
        options={{
          headerShown:false,
          
        }}
        />
        <Stack.Screen name="altaCarga" component={AltaCarga}
        options={{
          headerShown:false,
          
        }}
        />
        <Stack.Screen name="navbar" component={Navbar}
        options={{
          headerShown:false,
        }}
        />

        <Stack.Screen name="Perfil" component={Perfil}
        options={{
          headerShown:false,
        }}
        />

        <Stack.Screen name="catalogo" component={Catalogo}
        options={{
          headerShown:false,
        }}
        />
        <Stack.Screen name="driver" component={HomeDriver}
        options={{
          headerShown:false,
        }}
        />
         <Stack.Screen name="driver" component={HomeDriver}
        options={{
          headerShown:false,
        }}
        />
       
        
      </Stack.Navigator>
    );
  }

  return (
<AuthProvider>
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
