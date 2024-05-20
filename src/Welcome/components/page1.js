import React from 'react'
import { Image, ImageBackground, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';


export default function Page1({ navigation }) {
  

  return (
    <SafeAreaView className="h-screen flex justify-center relative" >
      <ImageBackground source={require('../../../assets/images/guideBack.jpg')} className="bg-black object-cover" >
        <LinearGradient className="h-full flex items-center justify-center"
          colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,1)']} >

          <Image source={require('../../../assets/images/logo.png')} alt='logo' />
          <View className="mt-7 flex items-start">
            <Text className="text-5xl text-white font-light">Welcome to</Text>
            <Text className="text-5xl text-white font-normal italic ml-32">StepWise</Text>
          </View>
          <Text  className="mb-20 mt-10 px-4 text-sm text-white font-light">"Introducing StepWise, your go-to for task, hobby, and project organization. Easily break down processes into steps, complete with notes and photos,
            simplifying your path to success."</Text>

          <View className="px-8 absolute bottom-10 w-full">
            <TouchableOpacity className="w-full bg-white px-8 py-2 rounded-xl" onPress={() => navigation.jumpTo('page2')}>
              <Text className="text-lg font-bold text-black text-center">Next</Text>
            </TouchableOpacity>
          </View>

        </LinearGradient>
      </ImageBackground>

    </SafeAreaView>
  )
}
