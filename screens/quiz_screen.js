import React, { useState, useEffect } from 'react'
import { Text, SafeAreaView, FlatList, Button, View } from 'react-native'
import {Picker} from '@react-native-community/picker';
import axios from 'axios'
import { StackActions } from '@react-navigation/native'
import { encode, decode } from 'html-entities'

import Timer from '../components/countdown_timer'

import globalStyles from '../styles/global_styles'

let remainingTime = 120
const quizScreen = ({ route, navigation }) => {
    const params = route.params

    const [questions, setQuestions] = useState([])
    const [selectedAnswers, setSelectedAnswers] = useState({})
    const [answers, setAnswers] = useState({})

    const [startQuiz, setStartQuiz] = useState(true)

    let timer = 0
    useEffect(() => {
        setInterval(() => {
            timer += 1
        }, 1000)
    })

    useEffect(() => {
        (async() => {
            const url = `https://opentdb.com/api.php?amount=${params.totalQuestions}&category=${params.selectCategory}&difficulty=${params.difficulty}&type=${params.quizType}`
            console.log(url)
            const response = await axios.get(url)

            const questionsArr = response.data.results

            for (const index in questionsArr) {
                questionsArr[index].question = decode(questionsArr[index].question)
                questionsArr[index].id = parseInt(index)

                questionsArr[index].display_answers = shuffleAnswers(index, questionsArr[index].correct_answer, 
                    [...questionsArr[index].incorrect_answers, questionsArr[index].correct_answer])
            }

            // console.log(questionsArr)
            // console.log(answers)
            setQuestions(questionsArr)
            setStartQuiz(false) 
        })();
    }, [])

    const shuffleAnswers = (index, correctAnswer, answersArr) => {
        const sortedArr = answersArr.sort(() => 0.5 - Math.random()) 

        correctAnswer = decode(correctAnswer)

        for (const index in sortedArr) {
            sortedArr[index] = decode(sortedArr[index])
        }

        if (!(index in answers)) {
            answers[index] = false
        }

        if (correctAnswer === sortedArr[0]) {
            answers[index] = true
        }

        selectedAnswers[index] = sortedArr[0]

        setSelectedAnswers(selectedAnswers)
        setAnswers(answers)
        return sortedArr
    }

    const handlePickerSelection = (index, selectedAnswer, questionId, correctAnswer) => {
        let tempSelectedAnswers = { ...selectedAnswers }
        tempSelectedAnswers[questionId] = selectedAnswer
        setSelectedAnswers(tempSelectedAnswers)
        console.log(tempSelectedAnswers)

        if (correctAnswer === selectedAnswer) {
            answers[questionId] = true
        } else {
            answers[questionId] = false
        }

        setAnswers(answers)
    }

    const renderItem = ({ item, index }) => {
        return (
            <Item 
                index={index} 
                questionId = {item.id}
                question={item.question} 
                correctAnswer={item.correct_answer} 
                displayAnswers={item.display_answers} />
        )
    }

    const Item = ({ index, questionId, question, correctAnswer, displayAnswers }) => {
        return (
        <View style={globalStyles.quizCard}>
          <Text style={globalStyles.textStyle}>{question}</Text>
          <Picker    
            selectedValue={selectedAnswers[questionId]}
            onValueChange={(selectedAnswer, index) => {
                handlePickerSelection(index, selectedAnswer, questionId, correctAnswer)
            }}>
            {
                displayAnswers.map((value, index) => (<Picker.Item key={index} value={value} label={value}/>))
            }
          </Picker>
        </View>
    )}

    const navigateToResult = () => {
        const data = {
            answers, 
            selectedAnswers,
            timer
        }

        console.log(data)
        
        navigation.dispatch(
            StackActions.replace('Result Screen', data)
        )
    }
    
    return (<SafeAreaView style={globalStyles.container}>
        <Timer
            remainingTime={120}
            onTimerEnd={() => {
                navigateToResult()
            }}
        />

        <FlatList 
            data={questions}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.question}
        />

        <Button style={globalStyles.submissionButton} 
            title="Finish" 
            color="#D31145" 
            onPress={() => navigateToResult()}
            disabled={startQuiz}
        />
    </SafeAreaView>)
}

export default quizScreen