import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useEffect, useRef, useState } from 'react';
import {
	ScreenCapturePickerView,
	RTCPeerConnection,
	RTCIceCandidate,
	RTCSessionDescription,
	RTCView,
	MediaStream,
	MediaStreamTrack,
	mediaDevices,
	registerGlobals
} from 'react-native-webrtc';

export default function TabTwoScreen() {

  const [streamUrl, setStreamUrl] = useState(null);
  const localStream = useRef<MediaStream | null>(null);

  // useEffect(() => {
  //      const getMedia = async () => {
  //        const stream = await mediaDevices.getUserMedia({
  //          video: true,
  //          audio: true,
  //        });
  //        localStream.current = stream;
  //      };

  //      getMedia();
  //    }, []);

  useEffect(() => {
    const run = async () => {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
        ]
      })

      let sessionConstraints = {
        mandatory: {
          OfferToReceiveAudio: true,
          OfferToReceiveVideo: true,
          VoiceActivityDetection: true
        }
      };

      try {
        const offerDescription = await pc.createOffer(sessionConstraints);
        await pc.setLocalDescription(offerDescription);
      } catch (err) {
        console.log('ERROR' + err)
      }

      const ws = new WebSocket('ws://rondagprs.ddns.net:8889/app/stream');

      ws.onopen = () => {
        ws.send(JSON.stringify({
          type: 'offer',
          sdp: pc.localDescription?.sdp
        }))
      }

      ws.onmessage = async (e) => {
        const data = JSON.parse(e.data);
        if (data.type === 'answer') {
          await pc.setRemoteDescription(new RTCSessionDescription(data))
        }
      }

      

    };

    run();
    console.log(localStream.current?.toURL())
  }, [])

  return (
    <View style={styles.container}>
      {
        streamUrl && (
          <RTCView
            streamURL={localStream.current?.toURL()}
            style={styles.video}
            objectFit={'cover'}
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
