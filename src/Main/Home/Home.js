import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { myContext } from '../../../App'
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Projects from './components/projects';
import AddNewCategory from './components/addNewCategory';
import Category from './components/category';
import { getCategories, getProjects } from '../../../db';
import AddNewProject from './components/addNewProject';
import { useFocusEffect } from '@react-navigation/native';

export default function Home({ navigation }) {
  const { username } = useContext(myContext)
  const [toggleMenu, setToggleMenu] = useState(false)
  const [toggleModalCategory, setToggleModalCategory] = useState(false)
  const [toggleModalProject, setToggleModalProject] = useState(false)
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState(null)
  const [projects, setProjects] = useState([])
  const [tempProjects, setTempProjects] = useState([])
  const [search, setSearch] = useState('')

  async function fetchCategories() {
    try {
      const data = await getCategories();
      setCategories(data)
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  async function fetchProjects() {
    try {
      setLoading(true)
      const data = await getProjects(category);
      setProjects(data); setTempProjects(data)
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useFocusEffect(
    useCallback(() => {
      fetchProjects()
    }, [category]))

  const reloaData = (type) => {
    type === 'category' && fetchCategories()
    type === 'project' && fetchProjects()
  }

  useEffect(() => {
    const searchTerm = search.toLowerCase(); 
    const temp = tempProjects.filter(item =>
      item?.Title?.toLowerCase()?.includes(searchTerm)
    );
    setProjects(temp);
  }, [search , tempProjects]);

  
  return (
    <ScrollView className="h-screen bg-[#FCF6F1] py-4">
      <View className="px-4 flex flex-row items-center justify-between">
        <Text className="text-lg text-black font-normal capitalize">Hi, <Text className="font-semibold tracking-widest">{username}</Text></Text>
        <View className="relative">
          <TouchableOpacity onPress={() => setToggleMenu(!toggleMenu)} className="p-3 rounded-full bg-black">
            {toggleMenu ? <AntDesign name="close" size={20} color="white" /> :
              <Feather name="menu" size={20} color="white" />}
          </TouchableOpacity>
          {toggleMenu &&
            <View className="absolute right-16 flex flex-row space-x-2 transition-all duration-500" >
              <TouchableOpacity onPress={() => setToggleModalCategory(true)} className="p-3 bg-black rounded-full">
                <MaterialIcons name="category" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setToggleModalProject(true)} className="p-3 bg-black rounded-full">
                <FontAwesome5 name="project-diagram" size={18} color="white" />
              </TouchableOpacity>
            </View>}
        </View>
      </View>
      <Text className="px-4 py-6 text-6xl font-normal text-black">My {'\n'}Projects</Text>
      <View className="px-4 py-3 relative">
        <View className="absolute left-8 top-7 z-20">
          <Feather name="search" size={22} color="gray" />
        </View>
        <TextInput onChangeText={(text) => setSearch(text)} className="h-14 bg-gray-50 border border-black/70 rounded-3xl pr-4 pl-12 text-gray-900 text-sm text-left"
          placeholder='Search by project title...' placeholderTextColor="gray" />
      </View>

      <Category categories={categories} category={category} setCategory={setCategory} setToggleModalCategory={setToggleModalCategory} />


      {loading ?
        <View className="py-44 flex flex-col items-center justify-center">
          <ActivityIndicator size="large" color="#999" />
        </View>
        :
        <Projects projects={projects} setProjects={setProjects} navigation={navigation} />}

      {toggleModalCategory && <AddNewCategory toggleModalCategory={toggleModalCategory} setToggleModalCategory={setToggleModalCategory} reloaData={reloaData} />}
      {toggleModalProject && <AddNewProject toggleModalProject={toggleModalProject} setToggleModalProject={setToggleModalProject} reloaData={reloaData} categories={categories} />}

    </ScrollView>
  )
}
