import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  Image,
} from "react-native";
import GlobalStyles from "../styles/GlobalStyles";
import { database, auth } from "../../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

export default function FavoritosScreen({ navigation }) {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = auth.currentUser?.uid;

  useFocusEffect(
    React.useCallback(() => {
      const fetchFavoritos = async () => {
        if (!userId) return;

        try {
          setLoading(true);

          const userDoc = await database.collection("users").doc(userId).get();
          const userData = userDoc.data();
          const favoritosIds = userData?.favorites || [];

          const promises = favoritosIds.map((id) =>
            database.collection("Events").doc(id).get()
          );
          const snapshots = await Promise.all(promises);

          const eventosFavoritos = snapshots
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((event) => event && event.title);

          setFavoritos(eventosFavoritos);
        } catch (error) {
          console.error("Erro ao carregar favoritos:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchFavoritos();
    }, [userId])
  );

  const handleUnfavorite = async (eventId) => {
    try {
      const userRef = database.collection("users").doc(userId);
      const userDoc = await userRef.get();
      const currentFavs = userDoc.data()?.favorites || [];

      const updatedFavs = currentFavs.filter((id) => id !== eventId);

      await userRef.set({ favorites: updatedFavs }, { merge: true });

      // Remover localmente
      setFavoritos((prev) => prev.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error("Erro ao desfavoritar:", error);
      alert("Erro ao remover favorito.");
    }
  };

  const renderEvent = ({ item }) => (
    <View style={[GlobalStyles.card, { marginBottom: 20 }]}>
      {item.imageUrl && (
        <Image
          source={{ uri: item.imageUrl }}
          style={GlobalStyles.image}
          resizeMode="cover"
        />
      )}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={GlobalStyles.cardTitle}>{item.title}</Text>
        <Pressable onPress={() => handleUnfavorite(item.id)}>
          <Ionicons name="star" size={24} color="#ffd700" />
        </Pressable>
      </View>

      <Text style={GlobalStyles.description}>{item.description}</Text>

      <Pressable
        style={[
          GlobalStyles.smallButton,
          GlobalStyles.buttonParticipate,
          { marginTop: 12 },
        ]}
        onPress={() => navigation.navigate("EventDetails", { event: item })}
      >
        <Text style={GlobalStyles.smallButtonText}>Saber mais</Text>
      </Pressable>
    </View>
  );

  if (loading) {
    return (
      <View style={GlobalStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#3f51b5" />
        <Text style={{ marginTop: 10 }}>A carregar favoritos...</Text>
      </View>
    );
  }

  if (favoritos.length === 0) {
    return (
      <View style={GlobalStyles.loadingContainer}>
        <Text>Nenhum evento favorito ainda.</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={GlobalStyles.listContainer}
      data={favoritos}
      keyExtractor={(item) => item.id}
      renderItem={renderEvent}
      showsVerticalScrollIndicator={false}
    />
  );
}
