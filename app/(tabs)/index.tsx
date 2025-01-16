import { Text, View, Platform } from "react-native";
import {StyleSheet} from 'react-native';
import { Link } from "expo-router";
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import { type ImageSource } from 'expo-image';
import { GestureHandlerRootView} from "react-native-gesture-handler";
import * as MediaLibrary from 'expo-media-library';
import { useRef } from 'react';
import { captureRef } from 'react-native-view-shot';
import domtoimage from 'dom-to-image';

import ImageViewer from '@/components/ImageViewer'
import Button from '@/components/Button'
import IconButton from "@/components/IconButton"
import CircleButton from '@/components/CircleButton'
import EmojiPicker from '@/components/EmojiPicker'
import EmojiList from "@/components/EmojiList"
import EmojiSticker from "@/components/EmojiSticker"


const placeHolderImage = require('@/assets/tutorial_assets/images/background-image.png');


export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  //these are called state variables
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [pickedEmoji, setPickedEmoji] = useState<ImageSource | undefined>(undefined);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const imageRef = useRef<View>(null);

  if (status === null) {
      requestPermission();
  }


  const pickImageAsync = async () => {
      let result  = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          quality: 1,
      });

      if (!result.canceled) {
          console.log(result);
          setSelectedImage(result.assets[0].uri)
          setShowAppOptions(true);
      } else {
          alert("You did not select any image.");
      }
  };

  const onReset = () => {
      setShowAppOptions(false);
  };

  const onAddSticker = () => {
      setIsModalVisible(true);
  };

  const onModalClose = () => {
      setIsModalVisible(false);
  };

  const onSaveImageAsync = async () => {
    if (Platform.OS !== 'web') {
        try {
            const localURI = await captureRef(imageRef, {
                height: 440,
                quality: 1,
            });

            await MediaLibrary.saveToLibraryAsync(localURI);
            if (localURI) {
                alert('Saved');
            }
        } catch (err) {
            console.log(err);
        }
    } else {
        try {
            const dataUrl = await domtoimage.toJpeg(imageRef.current, {
                quality: 0.95,
                width: 320,
                height: 440,
            });

            let link = document.createElement('a');
            link.download = 'sticker-smash.jpeg';
            link.href = dataUrl;
            link.click();
        }
        catch (e) {
            console.log(e);
        }
    }
  };

  return (
    <GestureHandlerRootView style = {styles.container}>
        <View style = {styles.imageContainer}>
            <View ref = {imageRef} collapsable={false}>
                <ImageViewer imgSource = {placeHolderImage} selectedImage = {selectedImage}></ImageViewer>
                {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
            </View>
        </View>
        {showAppOptions ? (
            <View style = {styles.optionsContainer}>
                <View style = {styles.optionsRow}>
                    <IconButton icon="refresh" label="Reset" onPress={onReset}></IconButton>
                    <CircleButton onPress={onAddSticker}></CircleButton>
                    <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync}></IconButton>
                </View>
            </View>
        ) : (
            <View style = {styles.footercontainer}>
                <Button theme = 'primary' label = "Choose a photo" onPress={pickImageAsync}></Button>
                <Button label = "Use this photo" onPress = {() => setShowAppOptions(true)} ></Button>
            </View>
        )}
        <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
            <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
        </EmojiPicker>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        alignItems: "center",
    },
    imageContainer: {
      flex: 1,
    },
    footercontainer: {
        flex: 1/3,
        alignItems: 'center',
    },
    optionsContainer: {
        position: 'absolute',
        bottom: 80,
    },
    optionsRow: {
        alignItems: 'center',
        flexDirection: 'row',
    },
});
