import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Play } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { RootStackParamList } from "../../navigation/AppNavigator";
import { tmdbImageUrl, tmdbService } from "../../services/tmdb.service";
import type { TMDBTvListItem, TMDBVideo } from "../../types/tmdb";

type Nav = NativeStackNavigationProp<RootStackParamList>;

function pickBestYouTubeKey(videos: TMDBVideo[]): string | null {
  const list = (videos ?? []).filter(
    (v) => (v.site ?? "") === "YouTube" && Boolean(v.key),
  );
  if (list.length === 0) return null;

  const score = (v: TMDBVideo) => {
    const type = (v.type ?? "").toLowerCase();
    const name = (v.name ?? "").toLowerCase();

    let s = 0;
    if (type === "trailer") s += 40;
    if (type === "teaser") s += 20;
    if (v.official) s += 15;
    if (name.includes("official")) s += 8;
    if (name.includes("trailer")) s += 6;
    return s;
  };

  return [...list].sort((a, b) => score(b) - score(a))[0]?.key ?? null;
}

export default function FeedScreen(): React.JSX.Element {
  const navigation = useNavigation<Nav>();

  const [items, setItems] = useState<TMDBTvListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [trailerKeyByTvId, setTrailerKeyByTvId] = useState<
    Record<number, string>
  >({});

  const cardData = useMemo(() => items.slice(0, 30), [items]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setError(null);
        setLoading(true);
        const res = await tmdbService.getPopularTv(1);
        if (!mounted) return;
        setItems(res.results ?? []);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? "Failed to load feed");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    // Prefetch trailers for first few cards to give the feed a “trailers-ready” feel.
    (async () => {
      const first = (items ?? []).slice(0, 8);
      for (const it of first) {
        if (!mounted) return;
        if (trailerKeyByTvId[it.id]) continue;

        try {
          const vids = await tmdbService.getTvVideos(it.id);
          const key = pickBestYouTubeKey(vids.results ?? []);
          if (!mounted) return;
          if (key) {
            setTrailerKeyByTvId((prev) => ({ ...prev, [it.id]: key }));
          }
        } catch {
          // ignore
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [items, trailerKeyByTvId]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["rgba(27,18,87,0.55)", "rgba(0,0,0,0.0)"]}
        style={{ position: "absolute", left: 0, right: 0, top: 0, height: 220 }}
      />

      <View
        style={{ paddingHorizontal: 18, paddingTop: 18, paddingBottom: 12 }}
      >
        <Text style={styles.h1}>Home</Text>
        <Text style={styles.sub}>Pick a series to watch the trailer</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={styles.centerText}>Loading…</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={[styles.centerText, { color: "#F87171" }]}>{error}</Text>
        </View>
      ) : (
        <FlashList
          data={cardData}
          keyExtractor={(it) => String(it.id)}
          contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 28 }}
          ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
          renderItem={({ item }) => {
            const backdrop = tmdbImageUrl(
              item.backdrop_path ?? item.poster_path,
              "w780",
            );
            const hasTrailer = Boolean(trailerKeyByTvId[item.id]);

            return (
              <Pressable
                onPress={() =>
                  navigation.navigate("TrailerReels", {
                    items: cardData.map((x) => ({
                      id: x.id,
                      name: x.name,
                      poster_path: x.poster_path,
                      backdrop_path: x.backdrop_path,
                    })),
                    initialIndex: Math.max(
                      0,
                      cardData.findIndex((x) => x.id === item.id),
                    ),
                    initialTrailerKeyByTvId: Object.fromEntries(
                      Object.entries(trailerKeyByTvId).map(([k, v]) => [
                        String(k),
                        v,
                      ]),
                    ),
                  })
                }
                style={styles.card}
              >
                <View style={{ height: 190, width: "100%" }}>
                  <Image
                    source={backdrop ? { uri: backdrop } : undefined}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                  />
                  <LinearGradient
                    colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.78)"]}
                    style={StyleSheet.absoluteFill}
                  />

                  <View style={styles.playGlass}>
                    <LinearGradient
                      colors={[
                        "rgba(255,255,255,0.22)",
                        "rgba(255,255,255,0.06)",
                      ]}
                      locations={[0, 1]}
                      style={StyleSheet.absoluteFill}
                    />
                    <Play
                      size={16}
                      color="rgba(255,255,255,0.95)"
                      fill="rgba(255,255,255,0.95)"
                    />
                    <Text style={styles.playGlassText}>
                      {hasTrailer ? "PLAY" : "OPEN"}
                    </Text>
                  </View>
                </View>

                <View style={{ paddingHorizontal: 14, paddingVertical: 12 }}>
                  <Text numberOfLines={1} style={styles.title}>
                    {item.name}
                  </Text>
                  <Text numberOfLines={2} style={styles.overview}>
                    {item.overview || "No overview available."}
                  </Text>

                  <View style={styles.metaRow}>
                    <Text style={styles.metaText}>
                      ★ {item.vote_average.toFixed(1)}
                    </Text>
                    <Text style={styles.metaDot}>•</Text>
                    <Text style={styles.metaText}>TV Series</Text>
                  </View>
                </View>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  h1: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
  },
  sub: {
    marginTop: 8,
    color: "rgba(255,255,255,0.65)",
    fontWeight: "700",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  centerText: {
    marginTop: 10,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "700",
    textAlign: "center",
  },
  card: {
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(24,24,27,0.35)",
  },
  playGlass: {
    position: "absolute",
    right: 14,
    bottom: 14,
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 999,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  playGlassText: {
    color: "rgba(255,255,255,0.92)",
    fontWeight: "900",
    letterSpacing: 1.1,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
  overview: {
    marginTop: 8,
    color: "rgba(255,255,255,0.70)",
    lineHeight: 18,
    fontWeight: "600",
  },
  metaRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaText: {
    color: "rgba(255,255,255,0.70)",
    fontWeight: "800",
    fontSize: 12,
  },
  metaDot: {
    color: "rgba(255,255,255,0.35)",
    fontWeight: "900",
  },
});
