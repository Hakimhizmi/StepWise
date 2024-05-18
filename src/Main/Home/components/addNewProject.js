import React, { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import Modal from "react-native-modal";
import { insertProject } from '../../../../db';
import { SelectList } from 'react-native-dropdown-select-list'

export default function AddNewProject({ toggleModalProject, setToggleModalProject, reloaData, categories }) {
    const [title, setTitle] = useState()
    const [category, setCategory] = useState()
    const [error, setError] = useState(false)
    const [LoadingBtn, setLoadingBtn] = useState(false)

    const SaveNewProject = async () => {
        try {
            if (!title || !title.trim()) {
                return setError('The title of the project is required.');
            }
            setLoadingBtn(true)
            await insertProject(title,category);
            setToggleModalProject(false)
            reloaData("project")
        } catch (error) {
            setError(error);
        } finally {
            setLoadingBtn(false)
        }
    };

    const data = categories.map((item, index) => ({
        key: item.CategoryID.toString(),
        value: item.Name,
    }))


    return (
        <Modal
            onBackdropPress={() => setToggleModalProject(false)}
            onBackButtonPress={() => setToggleModalProject(false)}
            isVisible={toggleModalProject}
            swipeDirection="down"
            onSwipeComplete={() => setToggleModalProject(false)}
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
                    <Text className="text-lg font-bold text-gray-800">Project Title <Text className="text-red-600">*</Text></Text>
                    <TextInput onChangeText={(text) => setTitle(text)} className="h-12 mt-3 bg-gray-100 border border-black/50 rounded-xl px-4 text-gray-900 text-sm text-left"
                        placeholder='Could you please provide a project title?' placeholderTextColor="gray" />
                    {categories.length > 0 && <View className="mt-4">
                        <Text className="mb-3 text-lg font-bold text-gray-800">Project category</Text>
                        <SelectList
                            setSelected={(val) => setCategory(val)}
                            data={data}
                            save="key"
                            boxStyles={{ backgroundColor: "#f3f4f6", borderColor: "#7F7F7F", height: '13px' }}
                            dropdownStyles={{ backgroundColor: "white", borderColor: "#d1d5db" }}
                            dropdownTextStyles={{ color: "#111827" }}
                            placeholder={"Choose a category if you desire to."}
                        />
                    </View>}
                    {error && <Text className="mt-2 text-sm text-center font-bold text-red-500">{error}</Text>}
                    <TouchableOpacity onPress={SaveNewProject} className="mt-6 bg-black py-2 rounded-2xl">
                        <Text className="font-bold text-center text-white text-lg">
                            {LoadingBtn ? 'Loading...' : 'Save'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}
