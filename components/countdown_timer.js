import React, { useState, useEffect } from 'react'
import { Text } from 'react-native'

import globalStyles from '../styles/global_styles'

let timerStart = false
let remainingTime = 0
let intervalId

const CountdownTimer = (props) => {
    const [displayTimer, setDisplayTimer] = useState('')

    useEffect(() => {
        if (!timerStart) {
            remainingTime = props.remainingTime? props.remainingTime : 0
            timerStart = true
        }

        intervalId = setInterval(() => {
            const mins = remainingTime / 60
            const secs = remainingTime % 60
    
            if (remainingTime >= 0) {
                if (secs < 10) {
                    setDisplayTimer(`${parseInt(mins)}:0${secs}`)
                } else {
                    setDisplayTimer(`${parseInt(mins)}:${secs}`)
                }
            } else {
                onTimerEnd()
            }
    
            remainingTime -= 1
        }, 1000)

        return () => clearInterval(intervalId)
    }, [displayTimer])

    const onTimerEnd = () => {
        props.onTimerEnd()
        clearInterval(intervalId)
    }

    return (
        <Text style={globalStyles.textStyle}>Remaining Timer: {displayTimer}</Text>
    )
}

export default CountdownTimer