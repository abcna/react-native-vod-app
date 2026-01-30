// مسیر فایل: src/screens/Feed/components/VideoItem.tsx

import { Video } from "expo-av";
import { Heart, MessageCircle, Share2 } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// دریافت ابعاد دقیق صفحه برای فول اسکرین شدن
const { width, height } = Dimensions.get("window");

interface VideoItemProps {
  data: {
    id: string;
    videoUrl: string;
    description: string;
    likes: number;
  };
  isActive: boolean;
}

const VideoItem: React.FC<VideoItemProps> = ({ data, isActive }) => {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(isActive);

  React.useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.playAsync();
      setIsPlaying(true);
    } else if (!isActive && videoRef.current) {
      videoRef.current.pauseAsync();
      setIsPlaying(false);
    }
  }, [isActive]);

  return (
    <View style={[styles.container, { height: height }]}>
      <Video
        ref={videoRef}
        source={{ uri: data.videoUrl }}
        style={styles.video}
        shouldPlay={isActive}
        isLooping={true}
        useNativeControls={false}
      />

      {/* --- لایه رویی (Overlay) --- */}
      <View style={styles.overlay}>
        {/* اطلاعات متنی (چپ) */}
        <View style={styles.infoContainer}>
          <Text style={styles.username}>@ReelShortActor</Text>
          <Text style={styles.description}>{data.description}</Text>
        </View>

        {/* دکمه‌های اکشن (راست) */}
        <View style={styles.actionsContainer}>
          <ActionIcon icon={Heart} label={data.likes.toString()} />
          <ActionIcon icon={MessageCircle} label="Comment" />
          <ActionIcon icon={Share2} label="Share" />
        </View>
      </View>
    </View>
  );
};

// کامپوننت کمکی دکمه‌ها
const ActionIcon = ({ icon: Icon, label }: any) => (
  <TouchableOpacity style={styles.actionButton}>
    <View style={styles.iconWrapper}>
      <Icon color="white" size={28} />
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    width: width,
    backgroundColor: "black",
    justifyContent: "center",
  },
  video: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  overlay: {
    position: "absolute",
    bottom: 40,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  infoContainer: {
    flex: 1,
    marginRight: 40,
  },
  username: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
  },
  description: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    lineHeight: 20,
  },
  actionsContainer: {
    alignItems: "center",
    gap: 16,
  },
  actionButton: {
    alignItems: "center",
    marginBottom: 16,
  },
  iconWrapper: {
    marginBottom: 4,
  },
  actionLabel: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default VideoItem;
