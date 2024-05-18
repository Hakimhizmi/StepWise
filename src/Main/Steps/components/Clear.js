import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Modal from "react-native-modal";
import { Feather } from '@expo/vector-icons';
import { DeleteProject } from '../../../../db';

export default function ModalClear({ toggleModalClear, setToggleModalClear, exitPage , id }) {
    const [LoadingBtn, setLoadingBtn] = useState(false)

    async function ClearProject() {
        try {
            setLoadingBtn(true)
            await DeleteProject(id);
            exitPage();
        } catch (error) {
            console.error('Error deleting:', error);
        } finally {
            setLoadingBtn(false)
        }
    }

    return (
        <Modal
            onBackdropPress={() => setToggleModalClear(false)}
            onBackButtonPress={() => setToggleModalClear(false)}
            isVisible={toggleModalClear}
            swipeDirection="down"
            onSwipeComplete={() => setToggleModalClear(false)}
            animationIn="bounceInUp"
            animationOut="bounceOutDown"
            animationInTiming={700}
            animationOutTiming={500}
            backdropTransitionInTiming={1000}
            backdropTransitionOutTiming={500}
            className="flex justify-end m-0"
        >
            <View className="bg-gray-100 w-full min-h-[40vh] rounded-t-[30px]">
                <View className="flex items-center py-2">
                    <View className="bg-[#bbb] h-1.5 w-20 rounded-xl" />
                </View>
                <View className="px-5 py-8 flex items-center">
                    <View className="bg-red-100 p-4 rounded-full">
                        <Feather name="alert-triangle" size={40} color="red" />
                    </View>
                    <Text className="mt-5 text-gray-800 font-bold text-xl">Are you sure?</Text>
                    <Text className="mt-2 text-gray-500 font-semibold text-sm text-center">To confirm and proceed with clearing and delete this project, please be aware that this step is irreversible.</Text>

                    <TouchableOpacity onPress={() => {!LoadingBtn && ClearProject() }} className="mt-7 w-full bg-red-600 py-2 flex items-center rounded-lg">
                        <Text className="text-white font-semibold text-lg">
                            {LoadingBtn ? 'Loading....'
                                : 'Delete this Project'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setToggleModalClear(false)} className="mt-4 w-full border border-gray-400 py-2 flex items-center rounded-lg">
                        <Text className="text-gray-700 font-semibold text-lg">Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}
