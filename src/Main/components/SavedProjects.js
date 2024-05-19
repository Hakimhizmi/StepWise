import React, { useCallback, useEffect, useState } from 'react'
import { ScrollView, View, Image, StyleSheet, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons, Feather, AntDesign } from '@expo/vector-icons';
import { getSavedProjects } from '../../../db';
import { useFocusEffect } from '@react-navigation/native';

export default function SavedProjects({ navigation }) {
  const [projects, setProjects] = useState([])
  const [search, setSearch] = useState('')
  const [tempProjects, setTempProjects] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchProjects() {
    try {
      setLoading(true)
      const data = await getSavedProjects();
      setProjects(data); setTempProjects(data)
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchProjects()
    }, []))

  useEffect(() => {
    const searchTerm = search.toLowerCase(); 
    const temp = tempProjects.filter(item =>
      item?.Title?.toLowerCase()?.includes(searchTerm)
    );
    setProjects(temp);
  }, [search , tempProjects]);

  return (
    <ScrollView className="h-screen  bg-[#FCF6F1]">
      <View style={styles.imageContainer} >
        <Image
          source={require("../../../assets/images/blackImage.jpg")}
          style={styles.image}
        />
        <TouchableOpacity onPress={() => navigation.jumpTo('home')} className="absolute top-0 px-5 pt-5">
          <Ionicons name="chevron-back-outline" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.mask} />
        <View className="absolute bottom-12 px-5">
          <Text className="text-white text-4xl font-semibold ">Saved Projects</Text>
          <Text className="text-white/80 text-xl font-light">{loading ? 'Loading...' : `${tempProjects.length} projects`}</Text>
        </View>
      </View>
      <View className="px-5 py-4">
        <View className="relative">
          <View className="absolute left-0 top-4 z-20">
            <Feather name="search" size={22} color="gray" />
          </View>
          <TextInput onChangeText={(text) => setSearch(text)} className="h-14 pr-4 pl-8 text-gray-900 text-sm text-left"
            placeholder='Search by project title...' placeholderTextColor="gray" />
        </View>

        {loading ?
          <View className="py-44 flex flex-col items-center justify-center">
            <ActivityIndicator size="large" color="#999" />
          </View>
          : projects.length > 0 ? projects.map((item, index) => (
            <TouchableOpacity onPress={() => navigation.navigate('steps', { id: item.ProjectID })} key={index} className="border-b border-gray-200 py-5">
              <Text className="text-2xl font-semibold">{item.Title}</Text>
              <View className="flex flex-row justify-between">
                <Text className="text-md font-normal text-black/70">{item.CategoryID ? `Category ${item?.CategoryName}` : 'No category'}</Text>
                <Text className="text-md font-normal text-black/70">{item?.CreationDate}</Text>
              </View>
            </TouchableOpacity>
          ))
            : <View className="py-32 flex items-center justify-center">
              <AntDesign name="frowno" size={60} color="#9ca3af" />
              <Text className="mt-2 text-[#9ca3af] font-light text-xl text-center">At the moment, there are no projects saved.</Text>
            </View>}


      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 240,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mask: {
    position: 'absolute',
    bottom: -24,
    left: 0,
    width: '120%',
    height: '25%',
    backgroundColor: '#FCF6F1',
    transform: [{ skewY: '-7deg' }],
  },
});