import React, { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import Modal from "react-native-modal";
import { insertCategory } from '../../../../db';

export default function AddNewCategory({ toggleModalCategory, setToggleModalCategory, reloaData }) {
    const [name, setName] = useState()
    const [error, setError] = useState(false)
    const [LoadingBtn, setLoadingBtn] = useState(false)

    const SaveNewCategory = async () => {
        try {
            if (!name || !name.trim()) {
                return setError('The name of the category is required.');
            }
            setLoadingBtn(true)
            await insertCategory(name);
            setError(""); setToggleModalCategory(false)
            reloaData("category")
        } catch (error) {
            setError(error);
        } finally {
            setLoadingBtn(false)
        }
    };

    return (
        <Modal
            onBackdropPress={() => setToggleModalCategory(false)}
            onBackButtonPress={() => setToggleModalCategory(false)}
            isVisible={toggleModalCategory}
            swipeDirection="down"
            onSwipeComplete={() => setToggleModalCategory(false)}
            animationIn="bounceInUp"
            animationOut="bounceOutDown"
            animationInTiming={700}
            animationOutTiming={500}
            backdropTransitionInTiming={1000}
            backdropTransitionOutTiming={500}
            className="flex justify-end m-0"
        >
            <View className="bg-white w-full min-h-[20vh] rounded-t-[30px]">
                <View className="flex items-center py-2">
                    <View className="bg-[#bbb] h-1.5 w-20 rounded-xl" />
                </View>
                <View className="px-5 py-8">
                    <Text className="text-lg font-bold text-gray-800">Category Name</Text>
                    <TextInput onChangeText={(text) => setName(text)} className="h-12 mt-3 bg-gray-100 border border-black/50 rounded-xl px-4 text-gray-900 text-sm text-left" placeholder='Could you please provide a category name?' placeholderTextColor="gray" />
                    {error && <Text className="mt-2 text-sm text-center font-bold text-red-500">{error}</Text>}
                    <TouchableOpacity onPress={SaveNewCategory} className="mt-6 bg-black py-2 rounded-2xl">
                        <Text className="font-bold text-center text-white text-lg">
                            {LoadingBtn ? 'Loading...' : 'Save'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}
