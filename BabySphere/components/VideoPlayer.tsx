import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Video, AVPlaybackStatus, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

interface VideoPlayerProps {
  uri: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ uri }) => {
  const [status, setStatus] = useState<AVPlaybackStatus>({} as AVPlaybackStatus);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<Video>(null);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleFullscreen = async () => {
    if (status.isLoaded && status.isPlaying) {
      await videoRef.current?.presentFullscreenPlayer();
    }
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri }}
        style={styles.video}
        shouldPlay={isPlaying}
        resizeMode={ResizeMode.CONTAIN}
        onPlaybackStatusUpdate={(status: AVPlaybackStatus) => setStatus(() => status)}
      />
      <View style={styles.controls}>
        <TouchableOpacity onPress={handlePlayPause}>
          <Ionicons 
            name={isPlaying ? "pause" : "play"} 
            size={24} 
            color="#8AA9B8" 
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleFullscreen}>
          <Ionicons name="expand" size={24} color="#8AA9B8" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    aspectRatio: 16 / 9,
    backgroundColor: 'black',
    borderRadius: 10,
    overflow: 'hidden',
  },
  video: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    backgroundColor: '#A3D8F4',
    borderRadius: 20,
    padding: 5,
  },
});

export default VideoPlayer;

