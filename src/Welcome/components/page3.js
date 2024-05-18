import React, { useContext, useState } from 'react'
import { Image, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { insertUser } from '../../../db';
import { myContext } from '../../../App';

export default function Page3({ }) {
    const { redirectToMainPage } = useContext(myContext)
    const [username, setUserName] = useState()
    const [error, setError] = useState(false)
    const [LaodingBtn, setLaodingBtn] = useState(false)

    const save = async () => {
        if (!username || !username.trim()) {
            return setError('Could you kindly provide any username to begin?');
        }
        setLaodingBtn(true)
        insertUser(username)
            .then(async (insertedId) => {
                redirectToMainPage()
            })
            .catch(error => {
                setError(`Error inserting user: ${error}`);
            }).finally(() => {
                LaodingBtn(false)
            });
    }
    return (
        <SafeAreaView className="h-screen flex items-center justify-start py-10 relative bg-black">
            <View className='px-5 py-8'>
                <Text className="text-6xl text-white font-light">Ready to take the first step towards your goals?</Text>
                <Image source={require('../../../assets/images/stepVector.png')} alt='stepVector' className="mt-3 mx-auto w-64 h-64" />

            </View>
            <View className="px-8 py-5 absolute bottom-14 bg-white rounded-3xl flex items-center justify-center">
                <Text className="text-xl text-black font-semibold uppercase">Kindly provide your username.</Text>
                <TextInput onChangeText={(text) => setUserName(text)}
                    className="mt-4 w-full px-4 h-10 text-gray-900 text-sm text-left border border-black/80 rounded-lg"
                    placeholder='please enter your username' placeholderTextColor="gray" />
                {error && <Text className="text-xs mt-1 text-left font-bold text-red-500">{error}</Text>}

                <TouchableOpacity onPress={save} className="w-full mt-6 bg-black py-2 rounded-xl">
                    <Text className="text-lg font-bold text-white text-center">Get Started</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}
