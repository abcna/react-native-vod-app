import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FlashListRef } from "@shopify/flash-list";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  MessageCircle,
  Share2,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import WebView from "react-native-webview";

import type { RootStackParamList } from "../../navigation/AppNavigator";
import { tmdbImageUrl, tmdbService } from "../../services/tmdb.service";
import type { TMDBVideo } from "../../types/tmdb";

type Props = NativeStackScreenProps<RootStackParamList, "TrailerReels">;

type ReelItem = {
  id: number;
  name: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
};

function formatCompact(n: number): string {
  if (!Number.isFinite(n)) return "0";
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(Math.max(0, Math.round(n)));
}

function formatWithCommas(n: number): string {
  if (!Number.isFinite(n)) return "0";
  return Math.max(0, Math.round(n)).toLocaleString("en-US");
}

function fakeLikeCount(tvId: number): number {
  // Deterministic placeholder until real engagement is backed by your own API.
  return 100_000 + (tvId % 95_000);
}

function fakeCommentCount(tvId: number): number {
  return 300 + (tvId % 5_000);
}

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

function buildYouTubeHtml(youtubeKey: string, autoplay: boolean): string {
  const autoplayParam = autoplay ? 1 : 0;
  const src = `https://www.youtube-nocookie.com/embed/${youtubeKey}?autoplay=${autoplayParam}&controls=0&modestbranding=1&playsinline=1&rel=0&fs=0&iv_load_policy=3&cc_load_policy=0&mute=0`;

  // Embed is still YouTube; we crop/scale to feel like a vertical in-app player.
  return `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <style>
      html, body { margin: 0; padding: 0; height: 100%; width: 100%; background: #000; overflow: hidden; }
      .stage { position: relative; height: 100vh; width: 100vw; overflow: hidden; background: #000; }
      .frameWrap { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(1.55); width: 100vw; height: 100vh; }
      iframe { width: 100%; height: 100%; border: 0; }
    </style>
  </head>
  <body>
    <div class="stage">
      <div class="frameWrap">
        <iframe
          src="${src}"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowfullscreen="false"
        ></iframe>
      </div>
    </div>
  </body>
</html>`;
}

export default function TrailerReelsScreen({
  route,
  navigation,
}: Props): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlashListRef<ReelItem> | null>(null);

  const { items, initialIndex, initialTrailerKeyByTvId } = route.params;

  const windowHeight = Dimensions.get("window").height;
  const data = items as ReelItem[];

  const [activeIndex, setActiveIndex] = useState(() => {
    const idx = Number.isFinite(initialIndex) ? initialIndex : 0;
    return Math.max(0, Math.min(data.length - 1, idx));
  });

  const [trailerKeyByTvId, setTrailerKeyByTvId] = useState<
    Record<number, string>
  >(() => {
    const raw = initialTrailerKeyByTvId ?? {};
    const mapped: Record<number, string> = {};
    for (const [k, v] of Object.entries(raw)) {
      const id = Number(k);
      if (Number.isFinite(id) && v) mapped[id] = v;
    }
    return mapped;
  });

  const [loadingByTvId, setLoadingByTvId] = useState<Record<number, boolean>>(
    {},
  );
  const [errorByTvId, setErrorByTvId] = useState<Record<number, string>>({});
  const [startedByTvId, setStartedByTvId] = useState<Record<number, boolean>>(
    {},
  );

  const [likedByTvId, setLikedByTvId] = useState<Record<number, boolean>>({});
  const [dislikedByTvId, setDislikedByTvId] = useState<Record<number, boolean>>(
    {},
  );

  const [commentTvId, setCommentTvId] = useState<number | null>(null);

  const activeItem = data[activeIndex];

  const ensureTrailerKey = useCallback(
    async (tvId: number) => {
      if (!tvId) return;
      if (trailerKeyByTvId[tvId]) return;
      if (loadingByTvId[tvId]) return;

      setLoadingByTvId((prev) => ({ ...prev, [tvId]: true }));
      setErrorByTvId((prev) => {
        const copy = { ...prev };
        delete copy[tvId];
        return copy;
      });

      try {
        const vids = await tmdbService.getTvVideos(tvId);
        const key = pickBestYouTubeKey(vids.results ?? []);
        if (!key) {
          setErrorByTvId((prev) => ({
            ...prev,
            [tvId]: "No trailer available for this series.",
          }));
          return;
        }
        setTrailerKeyByTvId((prev) => ({ ...prev, [tvId]: key }));
      } catch (e: any) {
        setErrorByTvId((prev) => ({
          ...prev,
          [tvId]: e?.message ?? "Failed to load trailer",
        }));
      } finally {
        setLoadingByTvId((prev) => ({ ...prev, [tvId]: false }));
      }
    },
    [trailerKeyByTvId, loadingByTvId],
  );

  useEffect(() => {
    if (!activeItem?.id) return;
    void ensureTrailerKey(activeItem.id);
  }, [activeItem?.id, ensureTrailerKey]);

  useEffect(() => {
    // Ensure initial scroll lands where expected.
    if (!data.length) return;
    const idx = Math.max(0, Math.min(data.length - 1, initialIndex ?? 0));
    const t = setTimeout(() => {
      listRef.current?.scrollToIndex({ index: idx, animated: false });
    }, 0);
    return () => clearTimeout(t);
  }, [data.length, initialIndex]);

  const onMomentumScrollEnd = useCallback(
    (e: any) => {
      const y = e?.nativeEvent?.contentOffset?.y ?? 0;
      const nextIndex = Math.round(y / windowHeight);
      const clamped = Math.max(0, Math.min(data.length - 1, nextIndex));
      if (clamped !== activeIndex) setActiveIndex(clamped);
    },
    [activeIndex, data.length, windowHeight],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: ReelItem; index: number }) => {
      const isActive = index === activeIndex;
      const tvId = item.id;

      const youtubeKey = trailerKeyByTvId[tvId];
      const isLoading = loadingByTvId[tvId];
      const error = errorByTvId[tvId];
      const started = Boolean(startedByTvId[tvId]);

      const backdrop = tmdbImageUrl(
        item.backdrop_path ?? item.poster_path,
        "w780",
      );

      const showWebView = isActive && Boolean(youtubeKey) && started;

      const html = youtubeKey ? buildYouTubeHtml(youtubeKey, true) : "";

      return (
        <View style={[styles.page, { height: windowHeight }]}>
          {showWebView ? (
            <WebView
              key={`${tvId}-${youtubeKey}-started`}
              source={{ html }}
              style={{ flex: 1, backgroundColor: "#000" }}
              javaScriptEnabled
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
            />
          ) : (
            <View style={{ flex: 1, backgroundColor: "#000" }}>
              <Image
                source={backdrop ? { uri: backdrop } : undefined}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
              <LinearGradient
                colors={["rgba(0,0,0,0.15)", "rgba(0,0,0,0.90)"]}
                style={StyleSheet.absoluteFill}
              />

              {isActive ? (
                <View style={styles.centerOverlay}>
                  {isLoading ? <ActivityIndicator /> : null}
                  {!isLoading && error ? (
                    <Text style={styles.errorText}>{error}</Text>
                  ) : null}

                  {!isLoading && !error && youtubeKey ? (
                    <Pressable
                      onPress={() =>
                        setStartedByTvId((prev) => ({ ...prev, [tvId]: true }))
                      }
                      style={styles.playBtn}
                    >
                      <Text style={styles.playBtnText}>Play</Text>
                    </Pressable>
                  ) : null}

                  {!isLoading && !error && !youtubeKey ? (
                    <Text style={styles.hintText}>Loading trailer…</Text>
                  ) : null}
                </View>
              ) : null}
            </View>
          )}

          {/* Overlays */}
          {isActive ? (
            <SafeAreaView
              pointerEvents="box-none"
              style={[StyleSheet.absoluteFill, { paddingTop: insets.top + 6 }]}
              edges={["top", "bottom"]}
            >
              <View pointerEvents="box-none" style={styles.topBar}>
                <Pressable
                  onPress={() => navigation.goBack()}
                  hitSlop={12}
                  style={styles.backBtn}
                >
                  <ArrowLeft size={20} color="#FFFFFF" />
                </Pressable>
              </View>

              <View pointerEvents="box-none" style={styles.bottomArea}>
                <View style={styles.bottomLeft}>
                  <Pressable
                    onPress={() =>
                      navigation.navigate("SeriesDetails", { tvId: item.id })
                    }
                    style={styles.titlePill}
                  >
                    <Text numberOfLines={1} style={styles.titleText}>
                      {item.name}
                    </Text>
                    <Text style={styles.titleSub}>Open details</Text>
                  </Pressable>
                </View>
              </View>

              <View
                pointerEvents="box-none"
                style={[styles.rightOverlay, { bottom: 126 + insets.bottom }]}
              >
                <Pressable
                  onPress={() => {
                    setLikedByTvId((prev) => {
                      const next = !prev[tvId];
                      return { ...prev, [tvId]: next };
                    });
                    setDislikedByTvId((prev) => ({ ...prev, [tvId]: false }));
                  }}
                  style={styles.actionStack}
                >
                  <ThumbsUp
                    size={30}
                    color="#FFFFFF"
                    fill={likedByTvId[tvId] ? "#FFFFFF" : "transparent"}
                  />
                  <Text style={styles.actionValue}>
                    {formatCompact(fakeLikeCount(tvId))}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setDislikedByTvId((prev) => {
                      const next = !prev[tvId];
                      return { ...prev, [tvId]: next };
                    });
                    setLikedByTvId((prev) => ({ ...prev, [tvId]: false }));
                  }}
                  style={styles.actionStack}
                >
                  <ThumbsDown
                    size={30}
                    color="#FFFFFF"
                    fill={dislikedByTvId[tvId] ? "#FFFFFF" : "transparent"}
                  />
                  <Text style={styles.actionLabel}>Dislike</Text>
                </Pressable>

                <Pressable
                  onPress={() => setCommentTvId(tvId)}
                  style={styles.actionStack}
                >
                  <MessageCircle size={30} color="#FFFFFF" />
                  <Text style={styles.actionValue}>
                    {formatWithCommas(fakeCommentCount(tvId))}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    Share.share({
                      message: youtubeKey
                        ? `Watch trailer: ${item.name} https://www.youtube.com/watch?v=${youtubeKey}`
                        : `Check out ${item.name}`,
                    }).catch(() => {});
                  }}
                  style={styles.actionStack}
                >
                  <Share2 size={30} color="#FFFFFF" />
                  <Text style={styles.actionLabel}>Share</Text>
                </Pressable>
              </View>
            </SafeAreaView>
          ) : null}
        </View>
      );
    },
    [
      activeIndex,
      dislikedByTvId,
      errorByTvId,
      insets.bottom,
      insets.top,
      likedByTvId,
      loadingByTvId,
      navigation,
      startedByTvId,
      trailerKeyByTvId,
      windowHeight,
    ],
  );

  const keyExtractor = useCallback((it: ReelItem) => String(it.id), []);

  return (
    <View style={styles.container}>
      <FlashList
        ref={listRef}
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        decelerationRate="fast"
        snapToInterval={windowHeight}
        snapToAlignment="start"
        disableIntervalMomentum
        onViewableItemsChanged={({ viewableItems }) => {
          const first = viewableItems?.[0];
          if (typeof first?.index === "number") {
            const idx = Math.max(0, Math.min(data.length - 1, first.index));
            if (idx !== activeIndex) setActiveIndex(idx);
          }
        }}
        viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
        getItemType={() => "reel"}
      />

      <Modal
        visible={commentTvId != null}
        transparent
        animationType="slide"
        onRequestClose={() => setCommentTvId(null)}
      >
        <Pressable
          style={styles.sheetBackdrop}
          onPress={() => setCommentTvId(null)}
        >
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Comments</Text>
            <Text style={styles.sheetSub}>Coming soon.</Text>
            <Pressable
              onPress={() => setCommentTvId(null)}
              style={styles.sheetClose}
            >
              <Text style={styles.sheetCloseText}>Close</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  page: {
    width: "100%",
    backgroundColor: "#000",
  },
  topBar: {
    paddingHorizontal: 14,
    height: 54,
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  centerOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  playBtn: {
    marginTop: 10,
    height: 54,
    paddingHorizontal: 28,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  playBtnText: {
    color: "#0A0A0A",
    fontWeight: "900",
    fontSize: 18,
  },
  hintText: {
    marginTop: 12,
    color: "rgba(255,255,255,0.70)",
    fontWeight: "700",
    textAlign: "center",
  },
  errorText: {
    marginTop: 12,
    color: "rgba(248,113,113,0.95)",
    fontWeight: "800",
    textAlign: "center",
  },
  bottomArea: {
    flex: 1,
    paddingHorizontal: 14,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  bottomLeft: {
    flex: 1,
    paddingRight: 12,
  },
  titlePill: {
    maxWidth: 280,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  titleText: {
    color: "rgba(255,255,255,0.95)",
    fontWeight: "900",
    fontSize: 16,
  },
  titleSub: {
    marginTop: 2,
    color: "rgba(255,255,255,0.65)",
    fontWeight: "700",
    fontSize: 12,
  },
  rightOverlay: {
    position: "absolute",
    right: 12,
    alignItems: "center",
    gap: 18,
  },
  actionStack: {
    width: 74,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 6,
  },
  actionValue: {
    color: "rgba(255,255,255,0.92)",
    fontWeight: "900",
    fontSize: 12,
  },
  actionLabel: {
    color: "rgba(255,255,255,0.92)",
    fontWeight: "900",
    fontSize: 12,
  },
  sheetBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 18,
    backgroundColor: "#0B0B0F",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  sheetHandle: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
    marginBottom: 10,
  },
  sheetTitle: {
    color: "rgba(255,255,255,0.94)",
    fontWeight: "900",
    fontSize: 18,
  },
  sheetSub: {
    marginTop: 6,
    color: "rgba(255,255,255,0.62)",
    fontWeight: "700",
  },
  sheetClose: {
    marginTop: 14,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  sheetCloseText: {
    color: "rgba(255,255,255,0.90)",
    fontWeight: "900",
  },
});
