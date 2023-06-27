import React, { useState, useEffect } from 'react'
import { Text, SafeAreaView, Button, View, ScrollView } from 'react-native'
import { StackActions } from '@react-navigation/native'
import axios from 'axios'
import * as SQLite from 'expo-sqlite'

import globalStyles from '../styles/global_styles'
import moment from 'moment'

const db = SQLite.openDatabase('quiz_app.db')

const resultScreen = ({ route, navigation }) => {  
    const params = route.params
    
    const [selectedAnswers, setSelectedAnswers] = useState({})
    const [answers, setAnswers] = useState({})
    const [score, setScore] = useState(0)
    const [congratulatoryMessage, setCongratulatoryMessage] = useState('')
    const [dateTime, setDateTime] = useState('')
    const [timer, setTimer] = useState(0)

    const calculateScore = (answers) => {
        let currentScore = score
        
        for (var key in answers) {
            console.log(answers[key])

            if (answers[key]) {
                currentScore++
            }
        }

        if (currentScore === Object.keys(answers).length) {
            setCongratulatoryMessage('Congratulations!')
        } else if (currentScore >= Object.keys(answers).length / 2) {
            setCongratulatoryMessage('Nice try!')
        } else if (currentScore > 0) {
            setCongratulatoryMessage('Not bad!')
        } else {
            setCongratulatoryMessage('Try again next time!')
        }

        return currentScore
    }

    useEffect(() => {
        (async () => {
            // TODO: Any required effects that need initialising

            const dateTime = moment().format('DD-MM-YYYY HH:mm:ss')
            const score = calculateScore(params.answers)

            setDateTime(dateTime)
            setTimer(params.timer)
            setSelectedAnswers(params.selectedAnswers)
            setAnswers(params.answers)
            setScore(score)

            await new Promise((resolve, reject) => db.transaction(tx => {
                tx.executeSql(
                    `INSERT into leaderboard (date, timer, score) VALUES (?, ?, ?);`,
                    [dateTime, params.timer, score],
                    (_, result) => {
                        console.log(`Score data successfully added: ${result}`)
                        resolve(result)
                    },
                    (_, err) => reject(err)
                )
            }))
        })();
    }, [])

    return (
        <SafeAreaView style={globalStyles.container}>
            <ScrollView>
                <Text style={globalStyles.textStyle}>{congratulatoryMessage}</Text>
                <Text style={globalStyles.textStyle}>You have {score} correct answers.</Text>
                <Text style={globalStyles.textStyle}>Time taken {timer} seconds</Text>
                
                <View style={globalStyles.returnToMainButton}>
                    <Button title="Return" color="#D31145" onPress={() => {
                        const data = {
                            score
                        }

                        console.log(data)
                        navigation.dispatch(StackActions.popToTop())
                    }}/>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default resultScreen