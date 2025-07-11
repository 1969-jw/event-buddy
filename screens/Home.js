import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
  Image,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { database, auth } from "../../firebaseConfig";
import GlobalStyles from "../styles/GlobalStyles";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

export default function Home({ navigation }) {
  const { logout } = useAuth();
  const userId = auth.currentUser?.uid;

  const [events, setEvents] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const fetchEventsAndFavorites = async () => {
        try {
          const snapshot = await database.collection("Events").get();
          const eventsList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setEvents(eventsList);

          if (userId) {
            const userDoc = await database
              .collection("users")
              .doc(userId)
              .get();
            const userData = userDoc.data();
            const favoriteIds = userData?.favorites || [];

            const favoritesMap = {};
            favoriteIds.forEach((id) => {
              favoritesMap[id] = true;
            });
            setFavorites(favoritesMap);
          }
        } catch (error) {
          console.error("Erro ao carregar eventos/favoritos:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchEventsAndFavorites();
    }, [userId])
  );

  const toggleFavorite = async (eventId) => {
    const isFav = favorites[eventId];
    const updatedFavs = { ...favorites, [eventId]: !isFav };
    setFavorites(updatedFavs);

    try {
      const userRef = database.collection("users").doc(userId);
      const eventRef = database.collection("Events").doc(eventId);

      const userDoc = await userRef.get();
      const currentFavs = userDoc.data()?.favorites || [];

      const newFavs = !isFav
        ? [...currentFavs, eventId]
        : currentFavs.filter((id) => id !== eventId);

      await userRef.set({ favorites: newFavs }, { merge: true });

      // Atualizar favoritos no evento
      const eventDoc = await eventRef.get();
      const eventFavs = eventDoc.data()?.favorites || [];

      const updatedEventFavs = !isFav
        ? eventFavs.includes(userId)
          ? eventFavs
          : [...eventFavs, userId]
        : eventFavs.filter((id) => id !== userId);

      await eventRef.set({ favorites: updatedEventFavs }, { merge: true });
    } catch (error) {
      console.error("Erro ao atualizar favoritos:", error);
    }
  };

  const filteredEvents = events.filter((event) => {
    const term = searchTerm.toLowerCase();

    const titleMatch = event.title?.toLowerCase().includes(term);
    const categoryMatch = event.category?.toLowerCase().includes(term);
    const locationMatch = event.location?.toLowerCase().includes(term);

    return titleMatch || categoryMatch || locationMatch;
  });

  const renderEvent = ({ item }) => {
    const isFavorite = favorites[item.id];

    return (
      <View style={GlobalStyles.card}>
        {item.imageUrl && (
          <Image
            source={{ uri: item.imageUrl }}
            style={GlobalStyles.image}
            resizeMode="cover"
          />
        )}

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={GlobalStyles.cardTitle}>{item.title}</Text>
          <Pressable onPress={() => toggleFavorite(item.id)}>
            <Ionicons
              name={isFavorite ? "star" : "star-outline"}
              size={24}
              color={isFavorite ? "#ffd700" : "#999"}
            />
          </Pressable>
        </View>

        <Text style={GlobalStyles.description}>{item.description}</Text>

        <Pressable
          style={GlobalStyles.blueButton}
          onPress={() => navigation.navigate("EventDetails", { event: item })}
        >
          <Text style={GlobalStyles.blueButtonText}>Saber mais</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={[GlobalStyles.container, { flex: 1 }]}>
      <Text style={GlobalStyles.title}>🎉 Event Buddy</Text>

      <TextInput
        style={GlobalStyles.input}
        placeholder="🔍 Procurar eventos..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {loading ? (
        <View style={GlobalStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#3f51b5" />
          <Text>A carregar eventos...</Text>
        </View>
      ) : filteredEvents.length === 0 ? (
        <View style={GlobalStyles.loadingContainer}>
          <Text>Nenhum evento encontrado.</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={GlobalStyles.listContainer}
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          renderItem={renderEvent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Pressable style={GlobalStyles.logoutButton} onPress={logout}>
        <Ionicons name="exit-outline" size={20} color="#fff" />
        <Text style={GlobalStyles.logoutButtonText}>Sair da conta</Text>
      </Pressable>
    </View>
  );
}
