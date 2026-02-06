import React from "react";
import { StyleSheet, View } from "react-native";

import Skeleton from "./Skeleton";

export function FeedCardSkeleton(): React.JSX.Element {
  return (
    <View style={styles.feedCard}>
      <Skeleton height={190} radius={18} />
      <View style={{ paddingHorizontal: 14, paddingVertical: 12 }}>
        <Skeleton height={16} radius={10} width="72%" />
        <View style={{ height: 10 }} />
        <Skeleton height={12} radius={10} width="96%" />
        <View style={{ height: 8 }} />
        <Skeleton height={12} radius={10} width="84%" />
        <View style={{ height: 14 }} />
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <Skeleton height={12} radius={10} width={64} />
          <Skeleton height={12} radius={10} width={10} />
          <Skeleton height={12} radius={10} width={64} />
        </View>
      </View>
    </View>
  );
}

export function SeriesSliderSkeleton({
  titleWidth = 220,
}: {
  titleWidth?: number;
}): React.JSX.Element {
  return (
    <View style={{ marginTop: 40 }}>
      <View style={{ paddingHorizontal: 20, paddingBottom: 14 }}>
        <Skeleton height={36} radius={12} width={titleWidth} />
      </View>
      <View style={{ flexDirection: "row", paddingHorizontal: 20, gap: 16 }}>
        {Array.from({ length: 4 }).map((_, idx) => (
          <View key={idx} style={{ width: 154 }}>
            <Skeleton height={230} radius={24} />
            <View style={{ height: 10 }} />
            <Skeleton height={12} radius={10} width="70%" />
          </View>
        ))}
      </View>
    </View>
  );
}

export function HeroSliderSkeleton({
  height,
}: {
  height: number;
}): React.JSX.Element {
  return (
    <View style={{ width: "100%", height, backgroundColor: "#000" }}>
      <Skeleton height={height} radius={0} />
      <View style={styles.heroOverlay}>
        <Skeleton height={34} radius={16} width={120} />
        <View style={{ height: 14 }} />
        <Skeleton height={42} radius={16} width="80%" />
        <View style={{ height: 10 }} />
        <Skeleton height={14} radius={10} width={220} />
        <View style={{ height: 18 }} />
        <Skeleton
          height={56}
          radius={16}
          width={200}
          baseColor="rgba(255,255,255,0.20)"
        />
      </View>
    </View>
  );
}

export function DiscoverGridSkeleton(): React.JSX.Element {
  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 6 }}>
      {Array.from({ length: 8 }).map((_, idx) => {
        return (
          <View
            key={idx}
            style={{
              flexDirection: "row",
              marginBottom: 16,
            }}
          >
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Skeleton height={238} radius={24} />
              <View style={{ height: 10 }} />
              <Skeleton height={12} radius={10} width="70%" />
            </View>
            <View style={{ flex: 1, paddingLeft: 8 }}>
              <Skeleton height={238} radius={24} />
              <View style={{ height: 10 }} />
              <Skeleton height={12} radius={10} width="70%" />
            </View>
          </View>
        );
      })}
    </View>
  );
}

export function SeriesDetailsSkeleton(): React.JSX.Element {
  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
        <Skeleton height={16} radius={10} width={72} />
      </View>

      <Skeleton height={220} radius={0} />

      <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Skeleton height={138} radius={12} width={92} />
          <View style={{ flex: 1 }}>
            <Skeleton height={18} radius={10} width="70%" />
            <View style={{ height: 10 }} />
            <Skeleton height={12} radius={10} width={90} />
            <View style={{ height: 12 }} />
            <Skeleton height={12} radius={10} width="96%" />
            <View style={{ height: 8 }} />
            <Skeleton height={12} radius={10} width="92%" />
            <View style={{ height: 8 }} />
            <Skeleton height={12} radius={10} width="84%" />
          </View>
        </View>

        <View style={{ height: 22 }} />
        <Skeleton height={16} radius={10} width={120} />

        <View style={{ height: 12 }} />
        <View style={{ flexDirection: "row", gap: 10 }}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <View key={idx} style={{ width: 110 }}>
              <Skeleton height={140} radius={12} />
              <View style={{ height: 8 }} />
              <Skeleton height={12} radius={10} width="70%" />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  feedCard: {
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(24,24,27,0.35)",
  },
  heroOverlay: {
    position: "absolute",
    left: 22,
    right: 22,
    bottom: 90,
    alignItems: "center",
  },
});
