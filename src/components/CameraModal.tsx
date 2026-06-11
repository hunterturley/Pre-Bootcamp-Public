import React, { useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

import { CapturedImage } from '../capture';
import { colors, fonts, radii } from '../theme';
import { PrimaryButton } from './PrimaryButton';

/** Full-screen camera capture. Returns the shot (uri + base64) on confirm. */
export function CameraModal({
  visible,
  onClose,
  onCapture,
}: {
  visible: boolean;
  onClose: () => void;
  onCapture: (img: CapturedImage) => void;
}) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [busy, setBusy] = useState(false);

  const take = async () => {
    if (!cameraRef.current || busy) return;
    setBusy(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8, base64: true });
      if (photo?.base64) {
        onCapture({ uri: photo.uri, base64: photo.base64 });
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.root}>
        {!permission?.granted ? (
          <View style={styles.permission}>
            <Ionicons name="camera-outline" size={40} color={colors.accent} />
            <Text style={styles.permTitle}>Camera access needed</Text>
            <Text style={styles.permBody}>
              Switchboard uses your camera to scan business cards.
            </Text>
            <PrimaryButton label="Grant access" onPress={requestPermission} icon="camera" />
            <Pressable onPress={onClose} style={styles.cancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" />
            <View style={styles.frame} pointerEvents="none">
              <View style={[styles.corner, styles.tl]} />
              <View style={[styles.corner, styles.tr]} />
              <View style={[styles.corner, styles.bl]} />
              <View style={[styles.corner, styles.br]} />
            </View>
            <Pressable onPress={onClose} style={styles.close}>
              <Ionicons name="close" size={26} color="#fff" />
            </Pressable>
            <View style={styles.controls}>
              <Text style={styles.hint}>Fill the frame with the card</Text>
              <Pressable onPress={take} disabled={busy} style={styles.shutter}>
                <View style={styles.shutterInner} />
              </Pressable>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
}

const BR = 28;
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  permission: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 28, backgroundColor: colors.bg },
  permTitle: { fontFamily: fonts.sansBold, fontSize: 18, color: colors.ink },
  permBody: { fontFamily: fonts.sans, fontSize: 14, color: colors.mid, textAlign: 'center' },
  cancel: { marginTop: 8 },
  cancelText: { fontFamily: fonts.mono, fontSize: 12, color: colors.muted },
  frame: { ...StyleSheet.absoluteFillObject, margin: 40, justifyContent: 'center' },
  corner: { position: 'absolute', width: BR, height: BR, borderColor: colors.accentLight },
  tl: { top: '32%', left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
  tr: { top: '32%', right: 0, borderTopWidth: 3, borderRightWidth: 3 },
  bl: { bottom: '32%', left: 0, borderBottomWidth: 3, borderLeftWidth: 3 },
  br: { bottom: '32%', right: 0, borderBottomWidth: 3, borderRightWidth: 3 },
  close: { position: 'absolute', top: 54, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' },
  controls: { position: 'absolute', bottom: 50, left: 0, right: 0, alignItems: 'center', gap: 18 },
  hint: { fontFamily: fonts.mono, fontSize: 11, color: '#fff', letterSpacing: 0.4 },
  shutter: { width: 74, height: 74, borderRadius: 37, borderWidth: 4, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  shutterInner: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#fff' },
});
