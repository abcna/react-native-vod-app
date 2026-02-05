import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import React from "react";
import { Pressable, Text, View } from "react-native";

import { tmdbImageUrl } from "../../../services/tmdb.service";
import type { TMDBTvListItem } from "../../../types/tmdb";

type Props = {
  title: string;
  items: TMDBTvListItem[];
  onPressItem: (tvId: number) => void;
};

export default function SeriesSlider({
  title,
  items,
  onPressItem,
}: Props): React.JSX.Element | null {
  if (!items.length) return null;

  return (
    <View className="mt-4">
      <View className="px-4 mb-2 flex-row items-center justify-between">
        <Text className="text-white text-base font-extrabold">{title}</Text>
      </View>

      <FlashList
        horizontal
        data={items}
        estimatedItemSize={110}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(it) => String(it.id)}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
        renderItem={({ item }) => {
          const poster = tmdbImageUrl(item.poster_path, "w342");
          return (
            <Pressable
              onPress={() => onPressItem(item.id)}
              className="w-[110px]"
            >
              <Image
                source={poster ? { uri: poster } : undefined}
                style={{
                  width: 110,
                  height: 160,
                  borderRadius: 14,
                  backgroundColor: "#111",
                }}
                contentFit="cover"
              />
              <Text numberOfLines={1} className="text-white mt-2 font-bold">
                {item.name}
              </Text>
              <Text numberOfLines={1} className="text-neutral-500 text-xs mt-1">
                ⭐{" "}
                {Number.isFinite(item.vote_average)
                  ? item.vote_average.toFixed(1)
                  : "—"}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
