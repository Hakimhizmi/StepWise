import React, { createContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, LogBox, StatusBar, View } from 'react-native';
import Welcome from './src/Welcome/Welcome';
import { initDatabase, checkIfDatabaseExists } from './db';
import Routes from './src/Main/Routes';

export const myContext = createContext()
const Stack = createNativeStackNavigator();
LogBox.ignoreAllLogs();

function App() {
  const [username,setUserName] = useState()
  const [loading, setLoading] = useState(true)
  const [isSignedIn, setIsSignedIn] = useState(false)

  const setupDatabase = async () => {
    try {
      setLoading(true)
      // Check if the database exists
      const databaseExists = await checkIfDatabaseExists();
      if (databaseExists) {
        setUserName(databaseExists);
        setIsSignedIn(true)
      } else {
        await initDatabase()
      }
    } catch (error) {
      console.error('Error setting up database:', error);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    setupDatabase();
  }, []);

  function redirectToMainPage() {
    setupDatabase();
  }

  return (
    <myContext.Provider value={{ redirectToMainPage , username }} >
      <View style={{ flex: 1 }}>
        <StatusBar style="auto" />
        {loading ?
          (<View className="h-screen bg-white flex items-center justify-center">
            <Image source={require('./assets/images/loader.gif')} className="w-64" />
          </View>)
          :
          (<NavigationContainer>
            <Stack.Navigator initialRouteName={isSignedIn ? 'main' : 'welcome'} screenOptions={{ headerShown: false }}>
              {isSignedIn ?
                <Stack.Screen name='main' component={Routes} />
                :
                <Stack.Screen name='welcome' component={Welcome} />
              }
            </Stack.Navigator>
          </NavigationContainer>)
        }
      </View>
    </myContext.Provider>
  )
}
export default App;
