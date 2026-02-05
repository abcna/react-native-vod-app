import { FlashList } from "@shopify/flash-list";
import React from "react";
import { Pressable, Text, View } from "react-native";

import { ChevronRight } from "lucide-react-native";

import type { TMDBTvListItem } from "../../../types/tmdb";

import DiscoverCard from "./DiscoverCard";

type Props = {
  title: string;
  items: TMDBTvListItem[];
  onPressItem: (tvId: number) => void;
  onPressSeeAll?: () => void;
};

export default function SeriesSlider({
  title,
  items,
  onPressItem,
  onPressSeeAll,
}: Props): React.JSX.Element | null {
  if (!items.length) return null;

  const CARD_WIDTH = 154;
  const CARD_HEIGHT = 230;
  const GAP = 16;
  const SNAP = CARD_WIDTH + GAP;

  return (
    <View className="mt-10">
      <View className="pt-5 mb-5" style={{ padding :15}}>
        {onPressSeeAll ? (
          <Pressable
            onPress={onPressSeeAll}
            hitSlop={10}
            className="flex-row items-center"
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "flex-start",
            }}
          >
            <Text
              className="text-[46px] font-black text-white"
              style={{ color: "#FFFFFF", fontWeight: "900", flexShrink: 1 }}
              numberOfLines={1}
            >
              {title}
            </Text>

            <View style={{ marginLeft: 0, flexShrink: 0 }}>
              <ChevronRight size={30} color="#ffffff" strokeWidth={3} />
            </View>
          </Pressable>
        ) : (
          <View
            className="flex-row items-center"
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Text
              className="text-[46px] font-black text-white"
              style={{ color: "#FFFFFF", fontWeight: "900", flexShrink: 1 }}
              numberOfLines={1}
            >
              {title}
            </Text>

            <View style={{ marginLeft: 0, flexShrink: 0 }}>
              <ChevronRight size={30} color="#8d8d8d" strokeWidth={3} />
            </View>
          </View>
        )}
      </View>

      <FlashList
        horizontal
        data={items}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(it) => String(it.id)}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 2 }}
        ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
        snapToInterval={SNAP}
        decelerationRate="fast"
        snapToAlignment="start"
        renderItem={({ item }) => {
          return (
            <DiscoverCard
              title={item.name}
              posterPath={item.poster_path}
              onPress={() => onPressItem(item.id)}
              width={CARD_WIDTH}
              height={CARD_HEIGHT}
            />
          );
        }}
      />
    </View>
  );
}
