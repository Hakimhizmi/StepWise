import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native'
import { saveProject } from '../../../../db';
import { MaterialCommunityIcons, AntDesign, Feather } from '@expo/vector-icons';


export default function Projects({ projects, setProjects, navigation }) {

  const handleSaveProject = async (ProjectID, value) => {
    try {
      await saveProject(ProjectID, value);
      setProjects(projects.map(project => {
        if (project.ProjectID === ProjectID) {
          return { ...project, IsSaved: value };
        }
        return project;
      }));
    } catch (error) {
      console.error('Error updating step positions:', error);
    }
  };

  return (
    <View className="px-4 pt-4 pb-10 flex gap-5">
      {projects.length > 0 ? projects.map((item, index) => (
        <View key={index} style={{ overflow: 'hidden', borderTopLeftRadius: 50, borderTopRightRadius: 50, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
          <ImageBackground
            source={item?.Image ? { uri: item.Image } : require("../../../../assets/images/defaultImage.jpg")}
            style={{ width: '100%', height: 295 }}
            className="object-cover"
          >
            <LinearGradient colors={['rgba(0, 0, 0, 0)', 'rgba(198, 235, 178, 0.90)', 'rgba(198, 235, 178, 1)']} className="h-full" >
              <View className="px-5 py-4 flex h-full">
                <TouchableOpacity onPress={() => handleSaveProject(item.ProjectID, item.IsSaved === 1 ? 0 : 1)} className="bg-black p-2 ml-auto rounded-full">
                  {item.IsSaved === 0 ? <AntDesign name="save" size={20} color="white" /> :
                    <MaterialCommunityIcons name="content-save-off-outline" size={20} color="white" />}
                </TouchableOpacity>
                <View className="mt-auto mb-5">
                  <Text className="text-3xl font-normal text-black">{item.Title}</Text>
                  <Text className="mt-1 mb-2 text-lg font-normal text-black">{item.CategoryID ? `Category ${item?.CategoryName}` : 'No category'}</Text>
                  <View className="flex flex-row gap-2">
                    <View className="px-4 py-2 bg-white rounded-xl">
                      <Text className="font-semibold text-black">{item?.StepCount || "No"} steps</Text>
                    </View>
                    <View className="px-4 py-2 bg-white rounded-xl">
                      <Text className="font-semibold text-black">{item?.ImageCount || "No"} images</Text>
                    </View>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
          <View className="bg-[#FCF6F1] p-2 -mr-1 ml-auto" style={{ marginTop: -80, borderTopLeftRadius: 100, borderBottomLeftRadius: 100 }}>
            <TouchableOpacity onPress={() => navigation.navigate('steps', { id: item.ProjectID })} className="bg-[#FFD5F8] p-7 ml-auto rounded-full">
              <Feather name="arrow-up-right" size={30} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      ))
        : <View className="py-32 flex items-center justify-center">
          <AntDesign name="frowno" size={60} color="#9ca3af" />
          <Text className="mt-2 text-[#9ca3af] font-light text-xl text-center">Currently, no projects have been added. Please ensure to add the first project.</Text>
        </View>
      }
    </View>
  )
}
