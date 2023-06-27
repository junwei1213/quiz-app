import React, { useState, useEffect } from 'react'
import { Text, SafeAreaView, Button, View, FlatList, ScrollView } from 'react-native'
import { StackActions } from '@react-navigation/native'
import axios from 'axios'
import * as SQLite from 'expo-sqlite'

import globalStyles from '../styles/global_styles'

const db = SQLite.openDatabase('quiz_app.db')

const leaderBoardScreen = ({ route, navigation }) => {  
    const params = route.params

    const [scoreData, setScoreData] = useState({
        id: 0,
        date: '',
        timer: '',
        score: 0
    })

    useEffect(() => {
        (async () => {
            // TODO: Any required effects that need initialising
            const display = await new Promise((resolve, reject) => db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM leaderboard ORDER BY date DESC;`,
                    [],
                    (_, { rows: { _array } }) =>{
                        console.log(_array)
                        setScoreData(_array)
                        resolve(_array) 
                    },
                    (_, err) => reject(err)
                )
            }))
        })();
    }, [])

    const renderItem = ({ item, index }) => {
        return (
            <Item 
                index={index} 
                scoreId = {item.id}
                date={item.date} 
                timer={item.timer} 
                score={item.score} />
        )
    }

    const Item = ({ index, date, timer, score }) => {
        return (
        <View style={globalStyles.quizCard}>
            <Text style={globalStyles.textStyle}>Date: {date}</Text>
            <Text style={globalStyles.textStyle}>Time taken: {timer} seconds</Text>
            <Text style={globalStyles.textStyle}>Scored: {score} points</Text>
        </View>
    )}
    
    return (
        <SafeAreaView style={globalStyles.container}>
            <Text style={globalStyles.textStyle}>Leaderboard</Text>

            <FlatList 
                data={scoreData}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.id.toString()}
            />
        </SafeAreaView>
    )
}

export default leaderBoardScreen