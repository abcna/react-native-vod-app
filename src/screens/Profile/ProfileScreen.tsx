import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import {
  Award,
  Bookmark,
  ChevronRight,
  Copy,
  Flame,
  Globe,
  User,
} from "lucide-react-native";
import React, { useMemo } from "react";
import {
  Alert,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import type { BottomTabParamList } from "../../navigation/BottomTabNavigator";
import { useAuthStore } from "../../store/useAuthStore";
import { useWalletStore } from "../../store/useWalletStore";

export default function ProfileScreen(): React.JSX.Element {
  const navigation =
    useNavigation<BottomTabNavigationProp<BottomTabParamList>>();
  const insets = useSafeAreaInsets();

  const { userId, isLoggedIn } = useAuthStore();
  const coins = useWalletStore((s) => s.coins);

  const [contactOpen, setContactOpen] = React.useState(false);

  const displayId = useMemo(() => {
    if (userId) return userId;
    const chunk = () => Math.random().toString(36).slice(2, 6).toUpperCase();
    return `UCHE${chunk()}${chunk()}${chunk()}${chunk()}`;
  }, [userId]);

  const toast = (message: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert(message);
    }
  };

  const onCopyId = async () => {
    try {
      await Clipboard.setStringAsync(displayId);
      toast("Copied");
    } catch {
      toast("Copy failed");
    }
  };

  const onSignIn = () => {
    Alert.alert("Sign in", "Auth screen will be added soon.");
  };

  const onActivate = () => {
    Alert.alert("Activate", "Upgrade flow will be added soon.");
  };

  const onRefill = () => {
    navigation.navigate("Wallet");
  };

  const onSendFeedback = () => {
    Alert.alert("Send Feedback", "Thanks! Feedback flow will be added soon.");
  };

  const onOpenContact = () => {
    setContactOpen(true);
  };

  const onCloseContact = () => {
    setContactOpen(false);
  };

  const onContactUs = async () => {
    const url = "tel:+989128116683";
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        toast("Cannot open dialer");
        return;
      }
      await Linking.openURL(url);
    } catch {
      toast("Failed to open dialer");
    }
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#1b1257", "#05050a", "#000000"]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe} edges={["top"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 28,
            paddingTop: Math.max(12, insets.top * 0.1),
          }}
        >
          <View style={styles.pagePad}>
            <Text style={styles.h1}>Profile</Text>

            {/* Guest block */}
            <View style={styles.guestRow}>
              <View style={styles.avatar}>
                <User size={26} color="rgba(255,255,255,0.85)" />
              </View>

              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.guestName}>
                  {isLoggedIn ? "Account" : "Guest"}
                </Text>

                <View style={styles.idRow}>
                  <Text numberOfLines={1} style={styles.idText}>
                    ID: {displayId}
                  </Text>
                  <Pressable onPress={onCopyId} hitSlop={10}>
                    <Copy size={18} color="rgba(255,255,255,0.70)" />
                  </Pressable>
                </View>

                {!isLoggedIn ? (
                  <Pressable onPress={onSignIn} style={styles.signInBtn}>
                    <Text style={styles.signInText}>Sign in</Text>
                  </Pressable>
                ) : null}
              </View>
            </View>

            {/* Unlock banner */}
            <View style={styles.unlockCard}>
              <LinearGradient
                colors={["#7a5b20", "#3a2d18", "#1a1612"]}
                locations={[0, 0.55, 1]}
                style={StyleSheet.absoluteFill}
              />

              <View style={styles.unlockTitleRow}>
                <Text style={styles.unlockIcon}>🎬</Text>
                <Text style={styles.unlockTitle}>Full Unlock Center</Text>
              </View>

              <View style={styles.unlockBadgesRow}>
                <View style={styles.unlockBadge}>
                  <Flame size={14} color="#FBBF24" />
                  <Text style={styles.unlockBadgeText}>
                    Access to all premieres
                  </Text>
                </View>
                <View style={styles.unlockBadge}>
                  <Text style={styles.unlockBadgeTextStrong}>50+</Text>
                  <Text style={styles.unlockBadgeText}>Exclusive series</Text>
                </View>
              </View>

              <Pressable onPress={onActivate} style={styles.activateWrap}>
                <LinearGradient
                  colors={["#f0d19a", "#b7863f"]}
                  locations={[0, 1]}
                  style={styles.activateBtn}
                >
                  <Text style={styles.activateText}>Activate Now</Text>

                  <View style={styles.savePill}>
                    <Text style={styles.savePillText}>Save 50%</Text>
                  </View>
                </LinearGradient>
              </Pressable>

              <Text style={styles.unlockFooter}>
                Get Gold Pack Now And Save $20
              </Text>
            </View>

            {/* Balance card */}
            <View style={styles.balanceCard}>
              <Text style={styles.balanceTitle}>My Balance</Text>
              <View style={styles.divider} />

              <View style={styles.balanceRow}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={styles.coinCircle}>
                    <Text style={styles.coinCircleText}>D</Text>
                  </View>
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.coinsValue}>{coins}</Text>
                    <Text style={styles.coinsLabel}>Coins</Text>
                  </View>
                </View>

                <Pressable onPress={onRefill} style={styles.refillBtn}>
                  <LinearGradient
                    colors={["#5b3cf6", "#3f2ad9"]}
                    style={StyleSheet.absoluteFill}
                  />
                  <Text style={styles.refillText}>Refill Coins</Text>
                </Pressable>
              </View>
            </View>

            {/* Rows */}
            <View style={{ marginTop: 18 }}>
              <ProfileRow
                icon={<Bookmark size={20} color="rgba(255,255,255,0.85)" />}
                title="My List"
                onPress={() => Alert.alert("My List", "Coming soon.")}
              />
              <ProfileRow
                icon={<Award size={20} color="rgba(255,255,255,0.85)" />}
                title="Rewards and recognition"
                onPress={() => Alert.alert("Rewards", "Coming soon.")}
              />
              <ProfileRow
                icon={<Globe size={20} color="rgba(255,255,255,0.85)" />}
                title="Language"
                onPress={() => Alert.alert("Language", "Coming soon.")}
              />
              <ProfileRow
                icon={<Award size={20} color="rgba(255,255,255,0.85)" />}
                title="Send Feedback"
                onPress={onSendFeedback}
              />
              <ProfileRow
                icon={<User size={20} color="rgba(255,255,255,0.85)" />}
                title="Contact Us"
                onPress={onOpenContact}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Contact bottom sheet */}
      <Modal
        visible={contactOpen}
        transparent
        animationType="slide"
        onRequestClose={onCloseContact}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onCloseContact} />

          <View
            style={{
              paddingBottom: Math.max(16, insets.bottom + 10),
            }}
          >
            <View style={styles.sheet}>
              <LinearGradient
                colors={["#2d1f8b", "#1a103f", "#0b0b12"]}
                locations={[0, 0.55, 1]}
                style={StyleSheet.absoluteFill}
              />

              <Pressable onPress={onCloseContact} hitSlop={12} style={styles.x}>
                <Text style={styles.xText}>✕</Text>
              </Pressable>

              <View style={styles.helpIcon}>
                <Text style={styles.helpEmoji}>🎧</Text>
              </View>

              <Text style={styles.sheetTitle}>We’re here to help!</Text>
              <Text style={styles.sheetSubtitle}>
                Sorry things didn’t go as expected. Please contact support, and
                we’ll make it right!
              </Text>

              <Pressable
                onPress={() => {
                  onCloseContact();
                  void onContactUs();
                }}
                style={styles.sheetBtnWrap}
              >
                <LinearGradient
                  colors={["#6d4bff", "#3f2ad9"]}
                  style={styles.sheetBtn}
                >
                  <Text style={styles.sheetBtnText}>Contact Us</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function ProfileRow({
  icon,
  title,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
}): React.JSX.Element {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <View style={styles.rowLeft}>
        <View style={styles.rowIconCircle}>{icon}</View>
        <Text style={styles.rowTitle}>{title}</Text>
      </View>
      <ChevronRight size={18} color="rgba(255,255,255,0.55)" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000000",
  },
  safe: {
    flex: 1,
    backgroundColor: "transparent",
  },
  pagePad: {
    paddingHorizontal: 18,
  },
  h1: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "900",
    letterSpacing: 0.2,
    marginTop: 6,
    marginBottom: 18,
  },
  guestRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },
  guestName: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },
  idRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 10,
  },
  idText: {
    flex: 1,
    color: "rgba(255,255,255,0.55)",
    fontSize: 13,
  },
  signInBtn: {
    marginTop: 12,
    alignSelf: "flex-start",
    paddingHorizontal: 22,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    backgroundColor: "rgba(0,0,0,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },
  signInText: {
    color: "rgba(255,255,255,0.90)",
    fontSize: 14,
    fontWeight: "800",
  },
  unlockCard: {
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    padding: 16,
  },
  unlockTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  unlockIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  unlockTitle: {
    color: "#F5D9A6",
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 0.2,
  },
  unlockBadgesRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 14,
    marginBottom: 14,
  },
  unlockBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  unlockBadgeText: {
    color: "rgba(245, 217, 166, 0.92)",
    fontSize: 13,
    fontWeight: "700",
  },
  unlockBadgeTextStrong: {
    color: "#F5D9A6",
    fontSize: 14,
    fontWeight: "900",
  },
  activateWrap: {
    borderRadius: 14,
    overflow: "hidden",
  },
  activateBtn: {
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  activateText: {
    color: "#2A1C08",
    fontSize: 18,
    fontWeight: "900",
  },
  savePill: {
    position: "absolute",
    right: 14,
    top: 14,
    paddingHorizontal: 10,
    height: 22,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D946EF",
  },
  savePillText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
  },
  unlockFooter: {
    marginTop: 10,
    color: "rgba(255,255,255,0.40)",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "600",
  },
  balanceCard: {
    marginTop: 18,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    overflow: "hidden",
  },
  balanceTitle: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    color: "rgba(255,255,255,0.92)",
    fontSize: 20,
    fontWeight: "900",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  balanceRow: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  coinCircle: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: "rgba(251,191,36,0.22)",
    borderWidth: 1,
    borderColor: "rgba(251,191,36,0.30)",
    alignItems: "center",
    justifyContent: "center",
  },
  coinCircleText: {
    color: "#FBBF24",
    fontWeight: "900",
  },
  coinsValue: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 30,
  },
  coinsLabel: {
    marginTop: 4,
    color: "rgba(255,255,255,0.60)",
    fontSize: 13,
    fontWeight: "700",
  },
  refillBtn: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  refillText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
  row: {
    height: 66,
    borderRadius: 16,
    paddingHorizontal: 14,
    marginTop: 12,
    backgroundColor: "rgba(0,0,0,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  rowTitle: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 16,
    fontWeight: "800",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.65)",
  },
  sheet: {
    marginHorizontal: 14,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
  },
  x: {
    position: "absolute",
    right: 14,
    top: 14,
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  xText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 18,
    fontWeight: "900",
  },
  helpIcon: {
    alignSelf: "center",
    width: 86,
    height: 86,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    marginBottom: 14,
  },
  helpEmoji: {
    fontSize: 44,
  },
  sheetTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 10,
  },
  sheetSubtitle: {
    color: "rgba(255,255,255,0.70)",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    paddingHorizontal: 8,
    marginBottom: 18,
    fontWeight: "600",
  },
  sheetBtnWrap: {
    borderRadius: 16,
    overflow: "hidden",
  },
  sheetBtn: {
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetBtnText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
});
