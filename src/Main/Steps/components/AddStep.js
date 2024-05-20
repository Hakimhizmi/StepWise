import React, { useState } from 'react'
import { Button, Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Modal from "react-native-modal";
import * as ImagePicker from 'expo-image-picker';
import Entypo from '@expo/vector-icons/Entypo';
import { insertStep } from '../../../../db';

export default function AddStep({ toggleModalNewStep, setToggleModalNewStep, reloaData, id }) {
    const [notes, setNotes] = useState()
    const [image, setImage] = useState(null);
    const [error, setError] = useState(false)
    const [LoadingBtn, setLoadingBtn] = useState(false)

    const SaveNewStep = async () => {
        try {
            if (!notes || !notes.trim()) {
                return setError('The step notes is required.');
            }
            setLoadingBtn(true)
            await insertStep(notes, image, id);
            setToggleModalNewStep(false)
            reloaData()
        } catch (error) {
            setError(error);
        } finally {
            setLoadingBtn(false)
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled && result.assets && result.assets.length > 0) {
            setImage(result.assets[0].uri);
        }
    };

    const takeImage = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled && result.assets && result.assets.length > 0) {
            setImage(result.assets[0].uri);
        }
    };



    return (
        <Modal
            onBackdropPress={() => setToggleModalNewStep(false)}
            onBackButtonPress={() => setToggleModalNewStep(false)}
            isVisible={toggleModalNewStep}
            swipeDirection="down"
            onSwipeComplete={() => setToggleModalNewStep(false)}
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
                    <Text className="text-lg font-bold text-gray-800">Step Notes <Text className="text-red-600">*</Text></Text>
                    <TextInput onChangeText={(text) => setNotes(text)}
                        multiline={true}
                        numberOfLines={5}
                        className="mt-3 bg-gray-100 border border-black/50 rounded-xl px-4 text-gray-900 text-sm text-left"
                        placeholder='Could you please provide a description?'
                        placeholderTextColor="gray" />

                    <Text className="mt-6 text-lg font-bold text-gray-800">Step Image </Text>
                    <View className="mt-3 flex flex-row space-x-4">
                        <TouchableOpacity onPress={pickImage} className="flex flex-col space-y-2 items-center justify-center px-8 py-4 bg-gray-100 border border-black/50 rounded-xl">
                            <Entypo name="images" size={24} color="black" />
                            <Text className="font-bold text-sm">Pick an image</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={takeImage} className="flex flex-col space-y-2 items-center justify-center px-8 py-4 bg-gray-100 border border-black/50 rounded-xl">
                            <Entypo name="camera" size={24} color="black" />
                            <Text className="font-bold text-sm">Take a photo</Text>
                        </TouchableOpacity>
                    </View>

                    {image &&
                        <TouchableOpacity className="pt-4 px-2" onPress={() => setImage(null)}>
                            <Image source={{ uri: image }} className="rounded object-cover" style={{ width: 100, height: 100 }} />
                        </TouchableOpacity>
                    }
                    {error && <Text className="mt-2 text-sm text-center font-bold text-red-500">{error}</Text>}
                    <TouchableOpacity onPress={() => { !LoadingBtn && SaveNewStep() }} className="mt-6 bg-black py-2 rounded-2xl">
                        <Text className="font-bold text-center text-white text-lg uppercase">
                            {LoadingBtn ? 'Loading...' : 'Add New Step'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}
