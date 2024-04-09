import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Start from './Components/Start';
import Login from './Components/Login';
import Register from './Components/Register';
import FindPassword from './Components/FindPassword'; // FindPassword 컴포넌트를 import 합니다.

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen
          name="Start"
          component={Start}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FindPassword" // 새로 추가된 FindPassword 화면을 설정합니다.
          component={FindPassword}
          options={{title: '패스워드 찾기'}} // 헤더에 타이틀을 설정합니다.
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
