import React, { useState, useEffect } from 'react'
import { Text, SafeAreaView, Button, TextInput, View, ScrollView } from 'react-native'
import {Picker} from '@react-native-community/picker';
import axios from 'axios'
import * as SQLite from 'expo-sqlite'

import globalStyles from '../styles/global_styles'

const db = SQLite.openDatabase('quiz_app.db')

const mainScreen = ({ route, navigation }) => {  
  const params = route.params

  if (params) {
    console.log(params.message)
  }

  const [categories, setCategories] = useState([])
  const [selectCategory, setSelectCategory] = useState('')

  const [totalQuestions, setTotalQuestions] = useState(2)
  const [difficulty, setDifficulty] = useState('')
  const [quizType, setQuizType] = useState('')
  const [startQuiz, setStartQuiz] = useState(true)

  useEffect(() => {
    (async () => {
      await new Promise((resolve, reject) => db.transaction(tx => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS leaderboard (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, date TEXT, timer INTEGER, score INTEGER);`,
          [],
          (_, { rows: { _array } }) => resolve(_array),
          (_, err) => reject(err)
        )
      }))

      const url = 'https://opentdb.com/api_category.php'
      const response = await axios.get(url)

      setCategories(response.data.trivia_categories)
      setSelectCategory(response.data.trivia_categories[0].id)
      
      setDifficulty('easy')
      setQuizType('multiple')
      setStartQuiz(false) 
    })();
  }, [])

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView style={globalStyles.scrollContainer}>
        <Text style={globalStyles.textStyle}>{`Choose your quiz category`}</Text>
        <Picker
          selectedValue={selectCategory}
          style={globalStyles.pickerStyle}
          mode='dropdown'
          onValueChange={(value, index) => setSelectCategory(value)} >

          {
            categories.map((item) => (<Picker.Item key={item.id} value={item.id} label={item.name}/>))
          }
        </Picker>

        <Text style={globalStyles.textStyle}>{`Choose quiz type`}</Text>
        <Picker
          selectedValue={quizType}
          style={globalStyles.pickerStyle}
          itemStyle={globalStyles.pickerItemStyle}
          mode='dropdown'
          onValueChange={(value, index) => setQuizType(value)} >
            
            <Picker.Item label="True / False" value="boolean" />
            <Picker.Item label="Multiple Choice" value="multiple" />  
        </Picker>

        <Text style={globalStyles.textStyle}>{`Choose difficulty level`}</Text>
        <Picker
            selectedValue={difficulty}
            style={globalStyles.pickerStyle}
            mode='dropdown'
            onValueChange={(value, index) => setDifficulty(value)} >

            <Picker.Item label="Easy" value="easy" />
            <Picker.Item label="Medium" value="medium" />
            <Picker.Item label="Hard" value="hard" />
        </Picker>

        <Text style={globalStyles.textStyle}>{`Total quiz questions`}</Text>
        <TextInput 
          style={globalStyles.textInput} 
          placeholder="10" 
          keyboardType="numeric" 
          maxLength={2} 
          onChangeText={(input) => setTotalQuestions(input)} 
          value={totalQuestions.toString()} 
        />

        <View style={globalStyles.startQuizButton}>
          <Button
            onPress={() => {
              const data =  {
                selectCategory, 
                difficulty, 
                quizType,
                totalQuestions
              }

              console.log(data)

              navigation.push('Quiz Screen', data)
            }}
            title="Start Quiz!"
            color="#841584"
            disabled={startQuiz}
          />

          <Button 
            onPress={() => navigation.push('Leaderboard Screen', {})}
            title='Leaderboard'
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default mainScreen