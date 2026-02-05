import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Play } from "lucide-react-native";

import { tmdbImageUrl } from "../../../services/tmdb.service";
import type { TMDBTvListItem } from "../../../types/tmdb";

type Props = {
  items: TMDBTvListItem[];
  loading?: boolean;
  onPressItem: (tvId: number) => void;
  genreNameById?: Record<number, string>;
};

export default function TopRatedHeroSlider({
  items,
  loading,
  genreNameById,
  onPressItem,
}: Props): React.JSX.Element {
  const width = Dimensions.get("window").width;
  const height = Math.min(650, Math.round(width * 1.22) + 70);

  const data = useMemo(() => (items ?? []).slice(0, 10), [items]);
  const [activeIndex, setActiveIndex] = useState(0);
  const lastIndexRef = useRef(0);

  if (loading) {
    return (
      <View
        style={{
          width: "100%",
          height,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000",
        }}
      >
        <ActivityIndicator />
        <Text style={{ marginTop: 10, color: "rgba(255,255,255,0.75)" }}>
          Loading top rated…
        </Text>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={{ width: "100%", height, backgroundColor: "#000000" }} />
    );
  }

  return (
    <View style={{ width: "100%", height, backgroundColor: "#000000" }}>
      <FlashList
        horizontal
        data={data}
        keyExtractor={(it) => String(it.id)}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={width}
        snapToAlignment="start"
        contentContainerStyle={{ backgroundColor: "#000000" }}
        onMomentumScrollEnd={(e) => {
          const x = e.nativeEvent.contentOffset.x;
          const nextIndex = Math.max(0, Math.round(x / width));
          if (nextIndex !== lastIndexRef.current) {
            lastIndexRef.current = nextIndex;
            setActiveIndex(nextIndex);
          }
        }}
        renderItem={({ item }) => {
          const backdrop = tmdbImageUrl(
            item.backdrop_path ?? item.poster_path,
            "w1280",
          );

          const genresText = (item.genre_ids ?? [])
            .map((id) => genreNameById?.[id])
            .filter((name): name is string => Boolean(name))
            .slice(0, 3)
            .join("  •  ");

          return (
            <Pressable
              onPress={() => onPressItem(item.id)}
              style={{ width, height }}
            >
              <Image
                source={backdrop ? { uri: backdrop } : undefined}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />

              <LinearGradient
                colors={["rgba(0,0,0,0.55)", "rgba(0,0,0,0)"]}
                style={[StyleSheet.absoluteFill, { height: 210 }]}
              />
              <LinearGradient
                colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.92)"]}
                style={StyleSheet.absoluteFill}
              />

              {/* Rating badge (replaces mute button like the screenshot) */}
              <View style={{ position: "absolute", right: 18, bottom: 176 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 12,
                    height: 40,
                    borderRadius: 999,
                    backgroundColor: "rgba(0,0,0,0.28)",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.16)",
                  }}
                >
                  <Text style={{ color: "#FBBF24", fontSize: 14 }}>★</Text>
                  <Text
                    style={{
                      marginLeft: 8,
                      color: "rgba(255,255,255,0.92)",
                      fontSize: 14,
                      fontWeight: "900",
                    }}
                  >
                    {Number.isFinite(item.vote_average)
                      ? item.vote_average.toFixed(1)
                      : "—"}
                  </Text>
                </View>
              </View>

              {/* Center stack */}
              <View
                style={{
                  position: "absolute",
                  left: 22,
                  right: 22,
                  bottom: 80,
                  alignItems: "center",
                }}
              >
                {/* EXCLUSIVE badge */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 14,
                    height: 34,
                    borderRadius: 999,
                    backgroundColor: "rgba(0,0,0,0.40)",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.18)",
                    marginBottom: 12,
                  }}
                >
                  <View
                    style={{
                      height: 18,
                      width: 18,
                      borderRadius: 6,
                      backgroundColor: "rgba(116, 97, 255, 0.95)",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 10,
                    }}
                  >
                    <Play size={12} color="#FFFFFF" fill="#FFFFFF" />
                  </View>
                  <Text
                    style={{
                      color: "rgba(255,255,255,0.95)",
                      fontSize: 12,
                      fontWeight: "900",
                      letterSpacing: 1.1,
                    }}
                  >
                    EXCLUSIVE
                  </Text>
                </View>

                <Text
                  numberOfLines={2}
                  style={{
                    color: "#FFFFFF",
                    fontSize: 40,
                    fontWeight: "900",
                    lineHeight: 42,
                    textAlign: "center",
                    textShadowColor: "rgba(0,0,0,0.85)",
                    textShadowRadius: 18,
                    textShadowOffset: { width: 0, height: 12 },
                    paddingHorizontal: 8,
                  }}
                >
                  {item.name}
                </Text>

                <Text
                  numberOfLines={1}
                  style={{
                    marginTop: 8,
                    color: "rgba(255,255,255,0.70)",
                    fontSize: 14,
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                >
                  {genresText || "Top Rated"}
                </Text>

                {/* Play button + dots below it */}
                <View
                  style={{
                    marginTop: 18,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingHorizontal: 26,
                      height: 56,
                      borderRadius: 16,
                      backgroundColor: "rgba(255,255,255,0.92)",
                    }}
                  >
                    <Play size={22} color="#0A0A0A" fill="#0A0A0A" />
                    <Text
                      style={{
                        marginLeft: 12,
                        color: "#0A0A0A",
                        fontSize: 18,
                        fontWeight: "900",
                      }}
                    >
                      Play
                    </Text>
                  </View>

                  <View
                    style={{
                      marginTop: 50,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {data.map((_, idx) => {
                      const isActive = idx === activeIndex;
                      return (
                        <View
                          key={idx}
                          style={{
                            width: isActive ? 9 : 7,
                            height: isActive ? 9 : 7,
                            borderRadius: 999,
                            marginHorizontal: 5,
                            backgroundColor: isActive
                              ? "rgba(255,255,255,0.92)"
                              : "rgba(255,255,255,0.22)",
                          }}
                        />
                      );
                    })}
                  </View>
                </View>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
