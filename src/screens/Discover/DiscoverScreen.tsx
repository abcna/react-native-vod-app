import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { Search, X } from "lucide-react-native";

import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { tmdbImageUrl, tmdbService } from "../../services/tmdb.service";
import type { TMDBGenre, TMDBTvListItem } from "../../types/tmdb";

import SeriesSlider from "./components/SeriesSlider";

export default function DiscoverScreen(): React.JSX.Element {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [popularItems, setPopularItems] = useState<TMDBTvListItem[]>([]);
  const [popularLoading, setPopularLoading] = useState(true);
  const [popularError, setPopularError] = useState<string | null>(null);

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
            backdrop_path: null,
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

  const isSearching = debouncedQuery.length >= 2;
  const dataToShow = isSearching ? searchItems : popularItems;

  if (popularLoading) {
    return (
      <View className="flex-1 bg-black items-center justify-center p-4">
        <ActivityIndicator />
        <Text className="text-neutral-500 mt-3">Loading…</Text>
      </View>
    );
  }

  if (popularError) {
    return (
      <View className="flex-1 bg-black items-center justify-center p-4">
        <Text className="text-white text-xl font-bold mb-2">Discover</Text>
        <Text className="text-red-400 text-center">{popularError}</Text>
        <Text className="text-neutral-500 mt-3 text-center">
          Tip: set EXPO_PUBLIC_TMDB_API_KEY in .env
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <View className="pt-4 px-4 pb-2">
        <Text className="text-white text-xl font-bold mb-3">Discover</Text>

        <View className="flex-row items-center bg-[#0b0b0b] border border-[#222] rounded-2xl h-11">
          <View className="pl-3 pr-2">
            <Search size={18} color="#9CA3AF" />
          </View>

          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search series…"
            placeholderTextColor="#6B7280"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={() => Keyboard.dismiss()}
            className="flex-1 text-white text-sm pr-2"
          />

          {query.length > 0 ? (
            <Pressable
              onPress={() => {
                setQuery("");
                Keyboard.dismiss();
              }}
              hitSlop={10}
              className="px-3 h-11 justify-center"
            >
              <X size={18} color="#9CA3AF" />
            </Pressable>
          ) : null}
        </View>

        {query.trim().length > 0 && query.trim().length < 2 ? (
          <Text className="text-neutral-500 mt-2">
            Type at least 2 characters…
          </Text>
        ) : null}

        {searchError ? (
          <Text className="text-red-400 mt-2 text-center">{searchError}</Text>
        ) : null}

        {searchLoading ? (
          <View className="flex-row items-center mt-3" style={{ gap: 10 }}>
            <ActivityIndicator />
            <Text className="text-neutral-500">Searching…</Text>
          </View>
        ) : null}

        {genresError ? (
          <Text className="text-red-400 mt-2 text-center">{genresError}</Text>
        ) : null}
      </View>

      {isSearching ? (
        <View className="flex-1">
          <Text className="text-white text-base font-extrabold px-4 mt-2 mb-2">
            Search Results
          </Text>

          {!searchLoading && dataToShow.length === 0 ? (
            <View className="px-4 py-3">
              <Text className="text-neutral-500">No series found.</Text>
            </View>
          ) : null}

          <FlashList
            data={dataToShow}
            estimatedItemSize={96}
            keyExtractor={(it) => String(it.id)}
            contentContainerStyle={{ paddingBottom: 24 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() =>
                  navigation.navigate("SeriesDetails", { tvId: item.id })
                }
                className="flex-row px-4 py-3"
                style={{ gap: 12 }}
              >
                <Image
                  source={
                    tmdbImageUrl(item.poster_path, "w342")
                      ? { uri: tmdbImageUrl(item.poster_path, "w342")! }
                      : undefined
                  }
                  style={{
                    width: 64,
                    height: 96,
                    borderRadius: 12,
                    backgroundColor: "#111",
                  }}
                  contentFit="cover"
                />
                <View className="flex-1">
                  <Text numberOfLines={1} className="text-white font-bold">
                    {item.name}
                  </Text>
                  <Text numberOfLines={2} className="text-neutral-400 mt-1">
                    {item.overview}
                  </Text>
                  <Text className="text-neutral-500 mt-2 text-xs">
                    ⭐{" "}
                    {Number.isFinite(item.vote_average)
                      ? item.vote_average.toFixed(1)
                      : "—"}
                  </Text>
                </View>
              </Pressable>
            )}
          />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <SeriesSlider
            title="Popular"
            items={popularItems.slice(0, 20)}
            onPressItem={(tvId) =>
              navigation.navigate("SeriesDetails", { tvId })
            }
          />

          {genres.slice(0, 7).map((g) => (
            <SeriesSlider
              key={g.id}
              title={g.name}
              items={genreRows[g.id] ?? []}
              onPressItem={(tvId) =>
                navigation.navigate("SeriesDetails", { tvId })
              }
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
