import { Image } from "expo-image";
import React from "react";
import { Platform, Pressable, Text, View } from "react-native";

import { tmdbImageUrl } from "../../../services/tmdb.service";

export type DiscoverCardProps = {
  title: string;
  posterPath: string | null;
  onPress?: () => void;
  width?: number;
  height?: number;
  badgeText?: string;
};

export default function DiscoverCard({
  title,
  posterPath,
  onPress,
  width = 154,
  height = 230,
  badgeText,
}: DiscoverCardProps): React.JSX.Element {
  const poster = tmdbImageUrl(posterPath, "w342");

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: "#111827", borderless: false }}
      className="shrink-0"
      style={{ width }}
    >
      <View
        className="rounded-3xl overflow-hidden bg-zinc-900 border border-white/10"
        style={{
          height,
          shadowColor: "#000",
          shadowOpacity: 0.45,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 12 },
          elevation: Platform.OS === "android" ? 10 : 0,
        }}
      >
        <Image
          source={poster ? { uri: poster } : undefined}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          transition={180}
        />

        {badgeText ? (
          <View className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/60 border border-white/15">
            <Text
              className="text-white text-[10px] font-extrabold"
              style={{ color: "#FFFFFF", letterSpacing: 1.2 }}
            >
              {badgeText}
            </Text>
          </View>
        ) : null}
      </View>

      <Text
        numberOfLines={1}
        className="text-white/90 text-sm font-semibold mt-3"
        style={{ color: "#FFFFFF" }}
      >
        {title}
      </Text>
    </Pressable>
  );
}
