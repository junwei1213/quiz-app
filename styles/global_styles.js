import { Platform, StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar'

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#01161E',
        // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: '#01161E',
    },
    textStyle: {
        fontSize: 30,
        color: '#FFFFFF'
    },
    timerTextStyle: {
        color: '#FFFFFF'
    },
    textInput: {
        fontSize: 30,
        color: '#FFFFFF'
    },
    pickerStyle: {
        fontSize: 30,
        backgroundColor: '#598392',
        color: Platform.OS === 'android' || Platform.OS === 'ios' ? '#FFFFFF': '#000000'
    },
    quizCard: {
        fontSize: 30,
        backgroundColor: '#598392',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 6,
        padding: 12,
        marginVertical: 8,
        marginHorizontal: 12,
    },
    submissionButton: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    startQuizButton: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    returnToMainButton: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    pickerItemStyle: {
        color: '#000000'
    }
})