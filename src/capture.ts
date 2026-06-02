import * as ImagePicker from 'expo-image-picker';

export type CapturedImage = { uri: string; base64: string };

/** Open the photo library and return the picked card image with base64. */
export async function pickFromLibrary(): Promise<CapturedImage | null> {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) {
    throw new Error('Photo library access is needed to choose a card image.');
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
    base64: true,
    allowsEditing: true,
    aspect: [1.7, 1],
  });
  if (result.canceled || !result.assets[0]?.base64) return null;
  const asset = result.assets[0];
  return { uri: asset.uri, base64: asset.base64! };
}
