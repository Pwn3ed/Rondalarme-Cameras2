import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { RTCPeerConnection, RTCView } from 'react-native-webrtc';
import { useEffect, useState } from 'react';

export default function TabTwoScreen() {

  const [streamUrl, setStreamUrl] = useState(null);

  useEffect(() => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
      ]
    })

    

    
  })

  return (
    <View style={styles.container}>
      {
        streamUrl && (
          <RTCView
            streamURL={streamUrl}
            style={styles.video}
            objectFit='cover'
          />
        )
      }


      {/* <Text style={styles.title}>Câmera</Text> */}
      {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  video: {
    backgroundColor: 'purple',
  }
});
