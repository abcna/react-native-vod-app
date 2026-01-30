// مسیر فایل: src/screens/Feed/FeedScreen.tsx

import { useFocusEffect } from "@react-navigation/native";
import { FlashList, ViewToken } from "@shopify/flash-list";
import React, { useCallback, useRef, useState } from "react";
import { Dimensions, StatusBar, StyleSheet, View } from "react-native";
import VideoItem from "./components/VideoItem"; // ایمپورت کامپوننتی که در مرحله ۱ ساختیم

const { height } = Dimensions.get("window");

// دیتای تستی (بعداً از بک‌اند می‌گیریم)
const MOCK_DATA = [
  {
    id: "1",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    description: "Episode 1: The Beginning",
    likes: 1200,
  },
  {
    id: "2",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    description: "Episode 2: The Conflict",
    likes: 850,
  },
  {
    id: "3",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    description: "Episode 3: The Escape",
    likes: 2300,
  },
];

export default function FeedScreen(): React.JSX.Element {
  // ایندکس ویدیویی که الان در حال نمایش است
  const [currentViewableIndex, setCurrentViewableIndex] = useState(0);
  const [isScreenFocused, setIsScreenFocused] = useState(true);

  // Stop playback when leaving the Home tab
  useFocusEffect(
    useCallback(() => {
      setIsScreenFocused(true);
      return () => {
        setIsScreenFocused(false);
      };
    }, [])
  );

  // این تابع هر بار که اسکرول متوقف شود اجرا می‌شود و می‌گوید کدام آیتم دیده می‌شود
  const onViewableItemsChanged = useCallback(
    ({
      viewableItems,
    }: {
      viewableItems: ViewToken<(typeof MOCK_DATA)[0]>[];
    }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentViewableIndex(viewableItems[0].index);
      }
    },
    []
  );

  // تنظیمات حساسیت اسکرول (۸۰ درصد ویدیو باید دیده شود تا تغییر کند)
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  }).current;

  return (
    <View style={styles.container}>
      {/* استاتوس بار را شفاف می‌کنیم تا ویدیو زیر آن برود */}
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <FlashList
        data={MOCK_DATA}
        // رندر کردن هر آیتم
        renderItem={({ item, index }) => (
          <VideoItem
            data={item}
            isActive={index === currentViewableIndex && isScreenFocused} // پخش فقط اگر این tab فعال باشد
          />
        )}
        keyExtractor={(item) => item.id}
        // --- تنظیمات اسکرول اسنپ (حیاتی برای حس تیک‌تاک) ---
        pagingEnabled={true} // صفحه به صفحه اسکرول شود
        decelerationRate="fast"
        snapToInterval={height} // اندازه هر پرش برابر با ارتفاع صفحه
        snapToAlignment="start"
        // --- تنظیمات پرفورمنس FlashList ---
        // FlashList خود‌کار اندازه آیتم‌ها رو تشخیص می‌دهد

        // --- ایونت‌ها ---
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});
