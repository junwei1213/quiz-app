import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import mainScreen from '../screens/main_screen'
import quizScreen from '../screens/quiz_screen'
import resultScreen from '../screens/result_screen'
import leaderBoardScreen from '../screens/leaderboard_screen'

const navigator = ()  => {
    const Stack = createStackNavigator()

  return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={ mainScreen } />
          <Stack.Screen name="Quiz" component={ quizScreen } />
          <Stack.Screen name="Result" component={ resultScreen } />
          <Stack.Screen name="Leaderboard" component={ leaderBoardScreen } />
        </Stack.Navigator>
      </NavigationContainer>
  )
}

export default navigator