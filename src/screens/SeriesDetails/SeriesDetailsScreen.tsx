import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { SeriesDetailsSkeleton } from "../../components/ui/skeletonLayouts";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { tmdbImageUrl, tmdbService } from "../../services/tmdb.service";
import type {
  TMDBCast,
  TMDBTvDetailsAppended,
  TMDBTvEpisode,
  TMDBTvListItem,
  TMDBTvSeasonSummary,
} from "../../types/tmdb";

type Props = NativeStackScreenProps<RootStackParamList, "SeriesDetails">;

export default function SeriesDetailsScreen({
  route,
  navigation,
}: Props): React.JSX.Element {
  const { tvId } = route.params;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [details, setDetails] = useState<TMDBTvDetailsAppended | null>(null);
  const [cast, setCast] = useState<TMDBCast[]>([]);
  const [related, setRelated] = useState<TMDBTvListItem[]>([]);

  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [episodes, setEpisodes] = useState<TMDBTvEpisode[]>([]);

  const seasons: TMDBTvSeasonSummary[] = useMemo(
    () => details?.seasons ?? [],
    [details],
  );

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setError(null);
        setLoading(true);

        const d = await tmdbService.getTvDetails(tvId, {
          appendToResponse: ["credits", "recommendations"],
        });

        if (!mounted) return;

        setDetails(d);
        setCast((d.credits?.cast ?? []).slice(0, 20));
        setRelated((d.recommendations?.results ?? []).slice(0, 20));

        const firstSeason =
          (d.seasons ?? []).find((s) => s.season_number > 0) ??
          (d.seasons ?? [])[0];

        setSelectedSeason(firstSeason?.season_number ?? null);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? "Failed to load series details");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [tvId]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (selectedSeason === null) return;
      try {
        const s = await tmdbService.getTvSeasonDetails(tvId, selectedSeason);
        if (!mounted) return;
        setEpisodes(s.episodes ?? []);
      } catch {
        if (!mounted) return;
        setEpisodes([]);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [tvId, selectedSeason]);

  if (loading) {
    return <SeriesDetailsSkeleton />;
  }

  if (error || !details) {
    return (
      <View style={styles.center}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.back}>Back</Text>
        </Pressable>
        <Text style={styles.error}>{error ?? "Series not available"}</Text>
      </View>
    );
  }

  const hero =
    tmdbImageUrl(details.backdrop_path, "w780") ??
    tmdbImageUrl(details.poster_path, "w500");
  const poster = tmdbImageUrl(details.poster_path, "w342");

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.back}>Back</Text>
        </Pressable>
      </View>

      {hero ? (
        <Image source={{ uri: hero }} style={styles.hero} contentFit="cover" />
      ) : null}

      <View style={styles.section}>
        <View style={{ flexDirection: "row", gap: 12 }}>
          {poster ? (
            <Image
              source={{ uri: poster }}
              style={styles.poster}
              contentFit="cover"
            />
          ) : null}

          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{details.name}</Text>
            <Text style={styles.muted}>
              ⭐{" "}
              {Number.isFinite(details.vote_average)
                ? details.vote_average.toFixed(1)
                : "—"}
            </Text>
            <Text numberOfLines={6} style={styles.overview}>
              {details.overview}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cast</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10 }}
        >
          {cast.map((p) => {
            const img = tmdbImageUrl(p.profile_path, "w185");
            return (
              <View key={p.id} style={styles.castCard}>
                <Image
                  source={img ? { uri: img } : undefined}
                  style={styles.castImg}
                  contentFit="cover"
                />
                <Text numberOfLines={1} style={styles.castName}>
                  {p.name}
                </Text>
                <Text numberOfLines={1} style={styles.castRole}>
                  {p.character ?? ""}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Seasons</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10 }}
        >
          {seasons.map((s) => (
            <Pressable
              key={s.id}
              onPress={() => setSelectedSeason(s.season_number)}
              style={[
                styles.seasonChip,
                selectedSeason === s.season_number && styles.seasonChipActive,
              ]}
            >
              <Text style={styles.seasonText}>{s.name}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={[styles.sectionTitle, { marginTop: 14 }]}>
          Episodes (MVP placeholders)
        </Text>
        {episodes.map((e) => (
          <View key={e.id} style={styles.episodeRow}>
            <Text style={styles.episodeTitle}>
              Ep {e.episode_number}: {e.name}
            </Text>
            <View style={styles.videoPlaceholder}>
              <Text style={styles.placeholderText}>
                Video slot (replace with your episode)
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Related Series</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10 }}
        >
          {related.map((it) => {
            const img = tmdbImageUrl(it.poster_path, "w342");
            return (
              <Pressable
                key={it.id}
                onPress={() =>
                  navigation.replace("SeriesDetails", { tvId: it.id })
                }
                style={styles.relatedCard}
              >
                <Image
                  source={img ? { uri: img } : undefined}
                  style={styles.relatedImg}
                  contentFit="cover"
                />
                <Text numberOfLines={1} style={styles.relatedName}>
                  {it.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  header: { paddingTop: 16, paddingHorizontal: 16, paddingBottom: 8 },
  back: { color: "#fff", fontSize: 16, fontWeight: "700" },
  hero: { width: "100%", height: 220, backgroundColor: "#111" },
  section: { paddingHorizontal: 16, paddingTop: 16 },
  title: { color: "#fff", fontSize: 20, fontWeight: "800" },
  overview: { color: "#bbb", marginTop: 10, lineHeight: 18 },
  muted: { color: "#888", marginTop: 8 },
  error: { color: "#ff6b6b", marginTop: 10, textAlign: "center" },
  poster: { width: 92, height: 138, borderRadius: 12, backgroundColor: "#111" },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 10,
  },
  castCard: { width: 110 },
  castImg: {
    width: 110,
    height: 140,
    borderRadius: 12,
    backgroundColor: "#111",
  },
  castName: { color: "#fff", marginTop: 6, fontWeight: "700" },
  castRole: { color: "#888", marginTop: 2, fontSize: 12 },
  seasonChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#222",
  },
  seasonChipActive: { backgroundColor: "#222", borderColor: "#444" },
  seasonText: { color: "#fff", fontWeight: "700" },
  episodeRow: { marginTop: 12, gap: 8 },
  episodeTitle: { color: "#fff", fontWeight: "700" },
  videoPlaceholder: {
    height: 90,
    borderRadius: 14,
    backgroundColor: "#0b0b0b",
    borderWidth: 1,
    borderColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: { color: "#666" },
  relatedCard: { width: 120 },
  relatedImg: {
    width: 120,
    height: 180,
    borderRadius: 12,
    backgroundColor: "#111",
  },
  relatedName: { color: "#fff", marginTop: 6, fontWeight: "700" },
});
