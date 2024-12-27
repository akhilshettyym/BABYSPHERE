import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

const VideoPlayer: React.FC<{ uri: string }> = ({ uri }) => {
  const [isError, setIsError] = useState(false);

  return (
    <View style={styles.container}>
      {isError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading video</Text>
        </View>
      ) : (
        <Video
          source={{ uri }}
          style={styles.video}
          useNativeControls
          resizeMode={ResizeMode.COVER}
          onError={(error) => {
            console.error("Error loading video:", error);
            setIsError(true);
          }}
        />
      )}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default VideoPlayer;
