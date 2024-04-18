import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Start from './Components/Start';
import Login from './Components/Login';
import Register from './Components/Register';
import FindPassword from './Components/FindPassword';
import ChangePassword from './Components/ChangePassword';
import Board from './Components/Board';
import BestBoard from './Components/BestBoard';
import MyPage from './Components/MyPage';
import MyWritePage from './Components/MyWritePage';
import Feedback from './Components/Feedback';
import ImageFullScreen from './Components/ImageFullScreen'; // ImageFullScreen을 import 합니다.
import DamageReportViewer from './Components/DamageReportViewer';
import NewPost from './Components/NewPost';
import Fixing from './Components/Fixing';

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
          name="FindPassword"
          component={FindPassword}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Board"
          component={Board}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BestBoard"
          component={BestBoard}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MyPage"
          component={MyPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MyWritePage"
          component={MyWritePage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Feedback"
          component={Feedback}
          options={{headerShown: false}}
        />
        {/* ImageFullScreen 화면을 추가합니다. */}
        <Stack.Screen
          name="ImageFullScreen"
          component={ImageFullScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DamageReportViewer"
          component={DamageReportViewer}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="NewPost"
          component={NewPost}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Fixing"
          component={Fixing}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
