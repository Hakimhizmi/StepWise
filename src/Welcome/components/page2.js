import React from 'react'
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';

const steps = ["Start by creating a new project for your task or goal.",
  "Break down your project into smaller, achievable steps.", "Capture your progress with photos for each step.", "Add personal notes, tips, or reminders to each step.",
  "Watch your progress unfold as you complete each step."]

export default function Page2({ navigation }) {

  return (
    <SafeAreaView className="h-screen flex justify-start py-10 relative bg-black">
      <View className='px-5 py-5'>
        <Text className="text-7xl text-white font-light">How StepWise Works</Text>
        <Text className="text-white text-sm px-3 font-extralight">
          StepWise simplifies your journey towards your goals by breaking it down into manageable steps. Here's how it works
        </Text>
        <View className="mt-6 flex space-y-5">
          {steps.map((item, index) => (
            <View key={index} className="flex flex-row items-center">
              <Text className="bg-[#222222] px-2 py-1 rounded font-bold text-white">{index+1}</Text>
              <Text className="ml-3 text-sm text-white">{item}</Text>
            </View>
          ))}
        </View>
      </View>
      <View className="mt-10 flex items-center justify-center">
        <Ionicons name="footsteps-outline" size={84} color="white" />
        </View>
      <View className="px-8 absolute bottom-10 w-full">
        <TouchableOpacity className="w-full bg-white px-8 py-2 rounded-xl" onPress={() => navigation.jumpTo('page3')}>
          <Text className="text-lg font-bold text-black text-center">Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
