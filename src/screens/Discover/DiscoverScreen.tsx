import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { Search, X } from "lucide-react-native";

import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { tmdbImageUrl, tmdbService } from "../../services/tmdb.service";
import type { TMDBGenre, TMDBTvListItem } from "../../types/tmdb";

import SeriesSlider from "./components/SeriesSlider";
import TopRatedHeroSlider from "./components/TopRatedHeroSlider";

export default function DiscoverScreen(): React.JSX.Element {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const insets = useSafeAreaInsets();
  const stickyHeaderHeight = insets.top + 86;

  const [popularItems, setPopularItems] = useState<TMDBTvListItem[]>([]);
  const [popularLoading, setPopularLoading] = useState(true);
  const [popularError, setPopularError] = useState<string | null>(null);

  const [topRatedItems, setTopRatedItems] = useState<TMDBTvListItem[]>([]);
  const [topRatedLoading, setTopRatedLoading] = useState(true);
  const [topRatedError, setTopRatedError] = useState<string | null>(null);

  const [genres, setGenres] = useState<TMDBGenre[]>([]);
  const [genreRows, setGenreRows] = useState<Record<number, TMDBTvListItem[]>>(
    {},
  );
  const [genresError, setGenresError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query.trim(), 350);

  const [searchItems, setSearchItems] = useState<TMDBTvListItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const genreNameById = useMemo(() => {
    const map: Record<number, string> = {};
    for (const g of genres) map[g.id] = g.name;
    return map;
  }, [genres]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setPopularError(null);
        setPopularLoading(true);
        const data = await tmdbService.getPopularTv(1);
        if (!mounted) return;
        setPopularItems(data.results ?? []);
      } catch (e: any) {
        if (!mounted) return;
        setPopularError(e?.message ?? "Failed to load popular series");
      } finally {
        if (mounted) setPopularLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setTopRatedError(null);
        setTopRatedLoading(true);
        const data = await tmdbService.getTopRatedTv(1);
        if (!mounted) return;
        setTopRatedItems(data.results ?? []);
      } catch (e: any) {
        if (!mounted) return;
        setTopRatedError(e?.message ?? "Failed to load top rated series");
      } finally {
        if (mounted) setTopRatedLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setGenresError(null);

        const data = await tmdbService.getTvGenres();
        const list = (data.genres ?? []).filter((g) => g.id && g.name);

        if (!mounted) return;
        setGenres(list);

        const firstGenres = list.slice(0, 7);
        for (const g of firstGenres) {
          try {
            const res = await tmdbService.discoverTvByGenre(g.id, 1);
            if (!mounted) return;
            setGenreRows((prev) => ({
              ...prev,
              [g.id]: (res.results ?? []).slice(0, 20),
            }));
          } catch {
            if (!mounted) return;
            setGenreRows((prev) => ({ ...prev, [g.id]: [] }));
          }
        }
      } catch (e: any) {
        if (!mounted) return;
        setGenresError(e?.message ?? "Failed to load genres");
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!debouncedQuery) {
        setSearchItems([]);
        setSearchError(null);
        setSearchLoading(false);
        return;
      }

      if (debouncedQuery.length < 2) {
        setSearchItems([]);
        setSearchError(null);
        setSearchLoading(false);
        return;
      }

      try {
        setSearchError(null);
        setSearchLoading(true);

        const data = await tmdbService.searchMulti(debouncedQuery, 1);
        if (!mounted) return;

        const tvOnly: TMDBTvListItem[] = (data.results ?? [])
          .filter((it) => it.media_type === "tv")
          .map((it) => ({
            id: it.id,
            name: it.name ?? "Untitled",
            overview: it.overview ?? "",
            poster_path: it.poster_path ?? null,
            backdrop_path: it.backdrop_path ?? null,
            vote_average: it.vote_average ?? 0,
          }))
          .slice(0, 30);

        setSearchItems(tvOnly);
      } catch (e: any) {
        if (!mounted) return;
        setSearchError(e?.message ?? "Search failed");
        setSearchItems([]);
      } finally {
        if (mounted) setSearchLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [debouncedQuery]);

  const isSearching = query.trim().length >= 2;

  const goToDetails = (tvId: number) => {
    navigation.navigate("SeriesDetails", { tvId });
  };

  const onSeeAll = (title: string) => {
    Alert.alert(title, "The 'See all' screen will be added soon.");
  };

  if (popularLoading) {
    return (
      <View className="flex-1 bg-zinc-950 items-center justify-center p-4">
        <LinearGradient
          colors={["#09090b", "#000000"]}
          style={StyleSheet.absoluteFill}
        />
        <ActivityIndicator />
        <Text className="text-white/70 mt-3" style={{ color: "#FFFFFF" }}>
          Loading…
        </Text>
      </View>
    );
  }

  if (popularError) {
    return (
      <View className="flex-1 bg-zinc-950 items-center justify-center p-4">
        <LinearGradient
          colors={["#09090b", "#000000"]}
          style={StyleSheet.absoluteFill}
        />
        <Text
          className="text-white text-2xl font-extrabold mb-2"
          style={{ color: "#FFFFFF" }}
        >
          Discover
        </Text>
        <Text className="text-red-400 text-center">{popularError}</Text>
        <Text
          className="text-white/60 mt-3 text-center"
          style={{ color: "#FFFFFF" }}
        >
          Tip: set EXPO_PUBLIC_TMDB_API_KEY in .env
        </Text>
      </View>
    );
  }

  return (
    <View
      className="flex-1 bg-zinc-950"
      style={{ flex: 1, backgroundColor: "#000000" }}
    >
      <LinearGradient
        colors={["#0a0a0a", "#000000"]}
        style={StyleSheet.absoluteFill}
      />

      <LinearGradient
        colors={["rgba(255,255,255,0.10)", "rgba(255,255,255,0)"]}
        style={{ position: "absolute", left: 0, right: 0, top: 0, height: 220 }}
      />

      <SafeAreaView
        className="flex-1"
        edges={["top"]}
        style={{ flex: 1, backgroundColor: "#000000" }}
      >
        {/* Sticky search overlay */}
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            zIndex: 50,
          }}
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.55)", "rgba(0,0,0,0.0)"]}
            style={{
              paddingTop: insets.top + 8,
              paddingBottom: 14,
              paddingHorizontal: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                height: 54,
                paddingHorizontal: 16,
                borderRadius: 18,
                backgroundColor: "rgba(39,39,42,0.92)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.12)",
              }}
            >
              <Search size={18} color="#FFFFFF" />

              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search series…"
                placeholderTextColor="rgba(255,255,255,0.45)"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
                onSubmitEditing={() => Keyboard.dismiss()}
                style={{
                  flex: 1,
                  color: "#FFFFFF",
                  fontSize: 16,
                  marginLeft: 10,
                  paddingVertical: 0,
                }}
              />

              {query.length > 0 ? (
                <Pressable
                  onPress={() => {
                    setQuery("");
                    Keyboard.dismiss();
                  }}
                  hitSlop={10}
                  style={{ height: 54, justifyContent: "center" }}
                >
                  <X size={18} color="#FFFFFF" />
                </Pressable>
              ) : null}
            </View>

            {query.trim().length > 0 && query.trim().length < 2 ? (
              <Text
                style={{
                  marginTop: 10,
                  color: "rgba(255,255,255,0.75)",
                  fontSize: 13,
                }}
              >
                Type at least 2 characters…
              </Text>
            ) : null}

            {searchLoading && query.trim().length >= 2 ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                  gap: 10,
                }}
              >
                <ActivityIndicator />
                <Text style={{ color: "rgba(255,255,255,0.75)" }}>
                  Searching…
                </Text>
              </View>
            ) : null}

            {searchError ? (
              <Text style={{ marginTop: 10, color: "#F87171" }}>
                {searchError}
              </Text>
            ) : null}

            {genresError ? (
              <Text style={{ marginTop: 10, color: "#F87171" }}>
                {genresError}
              </Text>
            ) : null}
          </LinearGradient>
        </View>

        {isSearching ? (
          <View style={{ flex: 1, backgroundColor: "#000000" }}>
            <Text
              className="text-white text-2xl font-extrabold mb-4 px-4"
              style={{ color: "#FFFFFF" }}
            >
              Search results
            </Text>

            {!searchLoading && searchItems.length === 0 ? (
              <View className="px-4 py-3">
                <Text className="text-white/60" style={{ color: "#FFFFFF" }}>
                  No series found.
                </Text>
              </View>
            ) : null}

            <FlashList
              data={searchItems}
              keyExtractor={(it) => String(it.id)}
              keyboardShouldPersistTaps="handled"
              style={{ flex: 1, backgroundColor: "#000000" }}
              contentContainerStyle={{
                paddingTop: stickyHeaderHeight + 14,
                paddingBottom: 32,
                paddingHorizontal: 16,
                backgroundColor: "#000000",
                flexGrow: 1,
              }}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => goToDetails(item.id)}
                  style={{
                    borderRadius: 18,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.10)",
                    backgroundColor: "rgba(24,24,27,0.35)",
                  }}
                >
                  <View style={{ height: 150, width: "100%" }}>
                    <Image
                      source={
                        tmdbImageUrl(
                          item.backdrop_path ?? item.poster_path,
                          "w780",
                        )
                          ? {
                              uri: tmdbImageUrl(
                                item.backdrop_path ?? item.poster_path,
                                "w780",
                              )!,
                            }
                          : undefined
                      }
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                    />

                    <LinearGradient
                      colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.65)"]}
                      style={StyleSheet.absoluteFill}
                    />
                  </View>

                  <View style={{ paddingHorizontal: 14, paddingVertical: 12 }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: "#FFFFFF",
                        fontSize: 18,
                        fontWeight: "800",
                      }}
                    >
                      {item.name}
                    </Text>

                    <Text
                      numberOfLines={2}
                      style={{
                        marginTop: 6,
                        color: "rgba(255,255,255,0.75)",
                        fontSize: 13,
                        lineHeight: 18,
                      }}
                    >
                      {item.overview || "No overview available."}
                    </Text>

                    <View
                      style={{
                        marginTop: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <View
                        style={{
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                          borderRadius: 999,
                          backgroundColor: "rgba(255,255,255,0.06)",
                          borderWidth: 1,
                          borderColor: "rgba(255,255,255,0.10)",
                        }}
                      >
                        <Text style={{ color: "#FFFFFF", fontSize: 12 }}>
                          ⭐
                        </Text>
                      </View>

                      <Text
                        style={{
                          color: "rgba(255,255,255,0.75)",
                          fontSize: 12,
                        }}
                      >
                        {Number.isFinite(item.vote_average)
                          ? item.vote_average.toFixed(1)
                          : "—"}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              )}
            />
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              paddingBottom: 40,
              paddingTop: 0,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ marginBottom: 12 }}>
              <TopRatedHeroSlider
                items={topRatedItems}
                loading={topRatedLoading}
                genreNameById={genreNameById}
                onPressItem={goToDetails}
              />

              {topRatedError ? (
                <Text
                  style={{
                    color: "#F87171",
                    paddingHorizontal: 16,
                    marginTop: 10,
                  }}
                >
                  {topRatedError}
                </Text>
              ) : null}
            </View>

            <SeriesSlider
              title="Most Trending"
              items={popularItems.slice(0, 20)}
              onPressItem={goToDetails}
              onPressSeeAll={() => onSeeAll("Most Trending")}
            />

            {genres.slice(0, 7).map((g) => (
              <SeriesSlider
                key={g.id}
                title={g.name}
                items={genreRows[g.id] ?? []}
                onPressItem={goToDetails}
                onPressSeeAll={() => onSeeAll(g.name)}
              />
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}
