import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import type { RootStackParamList } from "../../navigation/AppNavigator";
import { tmdbService } from "../../services/tmdb.service";
import type { TMDBTvListItem } from "../../types/tmdb";

import DiscoverCard from "./components/DiscoverCard";

type Props = NativeStackScreenProps<RootStackParamList, "DiscoverCategory">;

export default function DiscoverCategoryScreen({
  route,
  navigation,
}: Props): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const { title, kind, genreId } = route.params;

  const [items, setItems] = useState<TMDBTvListItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canLoadMore = page < totalPages;

  const fetchPage = useCallback(
    async (nextPage: number, mode: "replace" | "append") => {
      try {
        setError(null);

        const res =
          kind === "popular"
            ? await tmdbService.getPopularTv(nextPage)
            : kind === "top_rated"
              ? await tmdbService.getTopRatedTv(nextPage)
              : await tmdbService.discoverTvByGenre(genreId, nextPage);

        setTotalPages(res.total_pages ?? 1);
        setPage(res.page ?? nextPage);

        const next = res.results ?? [];
        setItems((prev) => (mode === "append" ? [...prev, ...next] : next));
      } catch (e: any) {
        setError(e?.message ?? "Failed to load items");
      }
    },
    [genreId, kind],
  );

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      await fetchPage(1, "replace");
      if (mounted) setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [fetchPage]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPage(1, "replace");
    setRefreshing(false);
  }, [fetchPage]);

  const onEndReached = useCallback(async () => {
    if (loading || loadingMore || refreshing) return;
    if (!canLoadMore) return;

    setLoadingMore(true);
    await fetchPage(page + 1, "append");
    setLoadingMore(false);
  }, [canLoadMore, fetchPage, loading, loadingMore, page, refreshing]);

  const headerHeight = useMemo(
    () => Math.max(56, insets.top + 52),
    [insets.top],
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["rgba(27,18,87,0.55)", "rgba(0,0,0,0.0)"]}
        style={{ position: "absolute", left: 0, right: 0, top: 0, height: 240 }}
      />

      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <View style={[styles.topBar, { height: headerHeight }]}>
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={12}
            style={styles.backBtn}
          >
            <ArrowLeft size={20} color="#FFFFFF" />
          </Pressable>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
          <View style={{ width: 44 }} />
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator />
            <Text style={styles.centerText}>Loading…</Text>
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={[styles.centerText, { color: "#F87171" }]}>
              {error}
            </Text>
            <Pressable onPress={() => onRefresh()} style={styles.retryBtn}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : (
          <FlashList
            data={items}
            keyExtractor={(it) => String(it.id)}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 22,
              paddingTop: 6,
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#FFFFFF"
              />
            }
            ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
            renderItem={({ item, index }) => {
              const isLeft = index % 2 === 0;
              return (
                <View
                  style={{
                    flex: 1,
                    paddingRight: isLeft ? 8 : 0,
                    paddingLeft: isLeft ? 0 : 8,
                  }}
                >
                  <DiscoverCard
                    title={item.name}
                    posterPath={item.poster_path}
                    onPress={() =>
                      navigation.navigate("SeriesDetails", { tvId: item.id })
                    }
                    width={undefined}
                    height={238}
                  />
                </View>
              );
            }}
            onEndReachedThreshold={0.6}
            onEndReached={onEndReached}
            ListFooterComponent={
              loadingMore ? (
                <View style={{ paddingVertical: 18 }}>
                  <ActivityIndicator />
                </View>
              ) : null
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  topBar: {
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
  title: {
    flex: 1,
    marginHorizontal: 10,
    textAlign: "center",
    color: "rgba(255,255,255,0.92)",
    fontWeight: "900",
    fontSize: 16,
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
  retryBtn: {
    marginTop: 12,
    height: 46,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  retryText: {
    color: "rgba(255,255,255,0.92)",
    fontWeight: "900",
  },
});
