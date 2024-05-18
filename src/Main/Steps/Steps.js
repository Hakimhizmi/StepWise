import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native'
import { AntDesign, Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Modal } from 'react-native';
import AddStep from './components/AddStep';
import { useRoute } from '@react-navigation/native';
import { fetchSteps, updateStepPosition } from '../../../db';
import ModalDelete from './components/ModalDelete';
import * as Clipboard from 'expo-clipboard';
import ModalEdit from './components/ModalEdit';
import ModalClear from './components/Clear';
import DraggableFlatList from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from 'react-native-gesture-handler'; 

const Step = ({ item, drag, isActive, getSteps , showButtons , setShowButtons}) => {
  const [showFullScreenImage, setShowFullScreenImage] = useState(false);
  const [image, setImage] = useState(null)
  const [toggleModalDelete, setToggleModalDelete] = useState(false);
  const [iscopy, setIscopy] = useState(false)
  const [toggleModalEdit, setToggleModalEdit] = useState(false);

  const handleLongPress = () => {
    setShowButtons(item.StepID);
  };

  const handleImagePress = (image) => {
    setImage(image)
    setShowFullScreenImage(true);
  };
  const handleCloseModal = () => {
    setShowFullScreenImage(false);
  };


  const handleCopyText = async (text) => {
    try {
      await Clipboard.setStringAsync(text);
      setIscopy(true)
    } catch (error) {
      console.error('Error copying text to clipboard:', error);
    }
  };

  return (
    <View  className={`space-y-5 border-l-[3.5px] border-black ${isActive ? 'opacity-80' : ''} ${item.Position === 1 && "rounded-t"}`}>
      <View className="flex flex-col gap-2">
        <View className="rounded-r bg-black w-8 h-8" >
          <Text className="text-white mx-auto my-auto">{item.Position}</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.4}
          onLongPress={handleLongPress}
          className="px-1 py-2"
        >
          <Text className={`p-1 text-sm text-black font-normal ${item.Position % 2 === 0 ? 'bg-[#C7EBB3]' : 'bg-[#FFD5F8]'} rounded-b-3xl rounded-r-3xl`}>
            {item.Notes}
          </Text>
          {item?.ImagePath && <TouchableOpacity onPress={() => handleImagePress(item.ImagePath)} className="px-2 pt-3">
            <Image source={{ uri: item.ImagePath }} className="w-44 h-44" />
          </TouchableOpacity>}

        </TouchableOpacity>
      </View>
      {
        showButtons === item.StepID &&
        <View className="p-2 bg-[#F4DFCD] rounded-3xl flex flex-row space-x-2 mx-auto transition-all duration-300">
          <TouchableOpacity onLongPress={drag} className="p-3 rounded-full bg-black">
            <MaterialCommunityIcons name="drag" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setToggleModalEdit(item)} className="p-3 rounded-full bg-black">
            <AntDesign name="edit" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setToggleModalDelete(item.StepID)} className="p-3 rounded-full bg-black">
            <MaterialIcons name="delete-outline" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleCopyText(item.Notes)} className="p-3 rounded-full bg-black">
            {iscopy ? <MaterialIcons name="download-done" size={20} color="white" /> :
              <FontAwesome5 name="copy" size={20} color="white" />}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowButtons(false)} className="p-3 rounded-full bg-black">
            <AntDesign name="close" size={20} color="white" />
          </TouchableOpacity>
        </View>
      }
      <Modal visible={showFullScreenImage} transparent={true} onRequestClose={handleCloseModal}>
        <ImageViewer
          imageUrls={[
            {
              url: image
            }
          ]}
          enableSwipeDown={true}
          onSwipeDown={handleCloseModal}
        />
      </Modal>
      {toggleModalDelete && <ModalDelete toggleModalDelete={toggleModalDelete} setToggleModalDelete={setToggleModalDelete} getSteps={getSteps} />}
      {toggleModalEdit && <ModalEdit toggleModalEdit={toggleModalEdit} setToggleModalEdit={setToggleModalEdit} reloaData={getSteps} />}

    </View >
  );
};

export default function Steps({ navigation }) {
  const [Loading, setLoading] = useState(false);
  const [steps, setSteps] = useState([]);
  const [projectInfo, setProjectInfo] = useState();
  const [toggleModalNewStep, setToggleModalNewStep] = useState(false);
  const [toggleModalClear, setToggleModalClear] = useState(false);
  const route = useRoute();
  const { id } = route.params;
  const [showButtons, setShowButtons] = useState(false);

  async function getSteps() {
    try {
      setLoading(true)
      const { steps, projects } = await fetchSteps(id);
      setSteps(steps)
      setProjectInfo(projects)
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getSteps()
  }, [id])

  const reloaData = () => {
    getSteps()
  }

  const exitPage = () => {
    navigation.jumpTo('home')
  }

  const handleDragEnd = async ({ data }) => {
    // Update the local state with the new order
    setSteps(data.map((item, index) => ({ ...item, Position: index + 1 })));
    // Update the database with the new positions
    try {
      await updateStepPosition(data.map((item, index) => ({ ...item, Position: index + 1 })));
    } catch (error) {
      console.error('Error updating step positions:', error);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="h-screen bg-[#FCF6F1] pt-4 pb-8">
        <View className="px-4 flex flex-row items-center justify-between">
          <TouchableOpacity onPress={() => navigation.jumpTo('home')} className="p-3 rounded-full bg-black">
            <AntDesign name="arrowleft" size={20} color="white" />
          </TouchableOpacity>
          <View className="flex flex-row gap-2">
            <TouchableOpacity onPress={() => setToggleModalClear(true)} className="p-3 rounded-full bg-black">
              <MaterialIcons name="layers-clear" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setToggleModalNewStep(true)} className="p-3 rounded-full bg-black">
              <Ionicons name="add" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View className="px-4 py-6">
          <Text className="text-5xl font-normal text-black">{projectInfo ? projectInfo?.Title : "Loading...."}</Text>
          <Text className="mt-1 text-md font-normal text-black/90">{projectInfo ? `Created on ${projectInfo?.CreationDate}.` : "Loading...."}</Text>
        </View>
        {Loading ?
          <View className="py-44 flex flex-col items-center justify-center">
            <ActivityIndicator size="large" color="#999" />
          </View>
          :
          <View className="py-5 px-4">
            {steps.length > 0 ?
            <View style={{ maxHeight: 630, overflow: 'hidden' }}>
              <DraggableFlatList
                data={steps}
                onDragEnd={handleDragEnd}
                keyExtractor={(item) => item.Position}
                renderItem={({ item, drag, isActive }) => (
                  <Step item={item} drag={drag} isActive={isActive} getSteps={getSteps} 
                  showButtons={showButtons} setShowButtons={setShowButtons} />
                )}
              />
              </View>
              :
              <View className="py-32 flex items-center justify-center">
                <AntDesign name="frowno" size={60} color="#9ca3af" />
                <Text className="mt-2 text-[#9ca3af] font-light text-xl text-center">Currently, there are no steps available. Please consider adding a step to proceed.</Text>
              </View>}
          </View>}


        {toggleModalNewStep && <AddStep toggleModalNewStep={toggleModalNewStep} setToggleModalNewStep={setToggleModalNewStep} reloaData={reloaData} id={id} />}
        {toggleModalClear && <ModalClear toggleModalClear={toggleModalClear} setToggleModalClear={setToggleModalClear} exitPage={exitPage} id={id} />}

      </View>
    </GestureHandlerRootView>
  )
}

