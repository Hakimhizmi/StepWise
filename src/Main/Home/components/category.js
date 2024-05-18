import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

export default function Category({ categories, category, setCategory, setToggleModalCategory }) {

    return (
        <View className="px-4">
            <ScrollView horizontal className="py-3 gap-3">
                <TouchableOpacity onPress={() => setCategory(null)} className={`rounded-3xl px-4 py-2.5 h-10 ${category === null ? 'bg-[#C7EBB3]' : 'border border-black/60'}`}>
                    <Text className="font-semibold text-black text-center">All {categories.length > 0 && `(${categories.length})`}</Text>
                </TouchableOpacity>
                {categories.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => setCategory(item.CategoryID)} className={`rounded-3xl px-4 py-2.5 h-10 ${category === item.CategoryID ? 'bg-[#C7EBB3]' : 'border border-black/60'}`}>
                        <Text className="font-semibold text-black/90 text-center capitalize">{item.Name}</Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity onPress={() => setToggleModalCategory(true)} className="rounded-3xl border border-black/60 px-4 py-2.5 h-10 flex flex-row items-center space-x-1">
                    <Ionicons name="add" size={20} color="black" />
                    <Text className="font-semibold text-black/90 capitalize">Add new category</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}
