import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StatusBar,
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
import { tmdbService } from "../../services/tmdb.service";
import type { TMDBVideo } from "../../types/tmdb";

type Props = NativeStackScreenProps<RootStackParamList, "TrailerPlayer">;

function scoreVideo(v: TMDBVideo): number {
  const site = (v.site ?? "").toLowerCase();
  const type = (v.type ?? "").toLowerCase();
  const name = (v.name ?? "").toLowerCase();

  let score = 0;
  if (site === "youtube") score += 50;
  if (type === "trailer") score += 40;
  if (type === "teaser") score += 20;
  if (v.official) score += 15;
  if (name.includes("official")) score += 8;
  if (name.includes("trailer")) score += 6;

  return score;
}

function pickBestYouTubeKey(videos: TMDBVideo[]): string | null {
  const list = (videos ?? []).filter(
    (v) => (v.site ?? "") === "YouTube" && v.key,
  );
  if (list.length === 0) return null;
  return (
    [...list].sort((a, b) => scoreVideo(b) - scoreVideo(a))[0]?.key ?? null
  );
}

export default function TrailerPlayerScreen({
  route,
  navigation,
}: Props): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const { tvId, initialVideoKey, title } = route.params;

  const [loading, setLoading] = useState(!initialVideoKey);
  const [error, setError] = useState<string | null>(null);
  const [youtubeKey, setYoutubeKey] = useState<string | null>(
    initialVideoKey ?? null,
  );
  const [started, setStarted] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (initialVideoKey) return;

      try {
        setError(null);
        setLoading(true);
        const data = await tmdbService.getTvVideos(tvId);
        if (!mounted) return;

        const key = pickBestYouTubeKey(data.results ?? []);
        setYoutubeKey(key);
        if (!key) setError("No trailer available for this series.");
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? "Failed to load trailer");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [tvId, initialVideoKey]);

  const html = useMemo(() => {
    if (!youtubeKey) return "";

    const autoplay = started ? 1 : 0;

    // Note: this is still the YouTube embedded player; we hide most chrome
    // and crop/scale to better fit a vertical full-screen experience.
    const src = `https://www.youtube-nocookie.com/embed/${youtubeKey}?autoplay=${autoplay}&controls=0&modestbranding=1&playsinline=1&rel=0&fs=0&iv_load_policy=3&cc_load_policy=0`;

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
  }, [youtubeKey, started]);

  return (
    <View style={{ flex: 1, backgroundColor: "#000000" }}>
      <StatusBar hidden />

      <LinearGradient
        colors={["rgba(0,0,0,0.85)", "rgba(0,0,0,0.0)"]}
        style={{ position: "absolute", left: 0, right: 0, top: 0, height: 170 }}
      />

      {youtubeKey ? (
        <WebView
          key={`${youtubeKey}-${started ? 1 : 0}`}
          source={{ html }}
          style={{ flex: 1, backgroundColor: "#000000" }}
          javaScriptEnabled
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
        />
      ) : (
        <View style={styles.center}>
          {loading ? <ActivityIndicator /> : null}
          <Text style={styles.centerText}>
            {loading ? "Loading trailer…" : (error ?? "No trailer")}
          </Text>
        </View>
      )}

      {/* Overlay UI */}
      <SafeAreaView
        pointerEvents="box-none"
        style={[
          StyleSheet.absoluteFill,
          { paddingTop: Math.max(10, insets.top + 2) },
        ]}
        edges={["top"]}
      >
        <View pointerEvents="box-none" style={styles.topBar}>
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={12}
            style={styles.backBtn}
          >
            <ArrowLeft size={20} color="#FFFFFF" />
          </Pressable>
          <Text numberOfLines={1} style={styles.topTitle}>
            {title ?? "Trailer"}
          </Text>
          <View style={{ width: 44 }} />
        </View>

        {!started && youtubeKey ? (
          <View style={styles.playOverlay}>
            <Pressable onPress={() => setStarted(true)} style={styles.playBtn}>
              <Text style={styles.playBtnText}>Play</Text>
            </Pressable>
            <Text style={styles.playHint}>Plays inside the app</Text>
          </View>
        ) : null}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  centerText: {
    marginTop: 12,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "700",
    textAlign: "center",
  },
  topBar: {
    height: 54,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  topTitle: {
    flex: 1,
    marginHorizontal: 12,
    textAlign: "center",
    color: "rgba(255,255,255,0.90)",
    fontWeight: "900",
    fontSize: 14,
  },
  playOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  playBtn: {
    height: 54,
    paddingHorizontal: 26,
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
  playHint: {
    marginTop: 12,
    color: "rgba(255,255,255,0.60)",
    fontWeight: "700",
  },
});
