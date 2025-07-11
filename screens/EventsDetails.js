import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import GlobalStyles from "../styles/GlobalStyles";
import { Ionicons } from "@expo/vector-icons";
import { auth, database } from "../../firebaseConfig";
import firebase from "firebase/app";
import "firebase/firestore";

export default function EventDetails({ route, navigation }) {
  const { event: initialEvent } = route.params || {};
  const [eventData, setEventData] = useState({
    id: initialEvent?.id || "",
    title: initialEvent?.title || "Evento sem título",
    description: initialEvent?.description || "",
    datetime: initialEvent?.datetime || "",
    location: initialEvent?.location || "",
    imageUrl: initialEvent?.imageUrl || null,
    participants: initialEvent?.participants || [],
    favorites: initialEvent?.favorites || [],
  });

  const [isParticipating, setIsParticipating] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const loadData = async () => {
      if (!eventData.id || !userId) return;

      try {
        setLoading(true);

        const eventDoc = await database
          .collection("Events")
          .doc(eventData.id)
          .get();
        if (eventDoc.exists) {
          const data = eventDoc.data();
          setEventData((prev) => ({
            ...prev,
            ...data,
            participants: Array.isArray(data.participants)
              ? data.participants
              : [],
            favorites: Array.isArray(data.favorites) ? data.favorites : [],
          }));
        }

        const userDoc = await database.collection("users").doc(userId).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setIsFavorited(
            Array.isArray(userData.favorites) &&
              userData.favorites.includes(eventData.id)
          );
          setIsParticipating(
            Array.isArray(userData.participations) &&
              userData.participations.includes(eventData.id)
          );
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        Alert.alert("Erro", "Falha ao carregar dados do evento");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [eventData.id, userId]);

  const updateArrayField = async (
    collection,
    docId,
    field,
    item,
    shouldAdd
  ) => {
    if (!item) return [];

    const docRef = database.collection(collection).doc(docId);
    const doc = await docRef.get();

    const currentArray =
      doc.exists && Array.isArray(doc.data()[field]) ? doc.data()[field] : [];

    const updatedArray = shouldAdd
      ? currentArray.includes(item)
        ? currentArray
        : [...currentArray, item]
      : currentArray.filter((id) => id !== item);

    await docRef.set({ [field]: updatedArray }, { merge: true });
    return updatedArray;
  };

  const handleParticipate = async () => {
    if (!userId || !eventData.id) return;

    try {
      setLoading(true);
      const newStatus = !isParticipating;

      await updateArrayField(
        "users",
        userId,
        "participations",
        eventData.id,
        newStatus
      );
      const updated = await updateArrayField(
        "Events",
        eventData.id,
        "participants",
        userId,
        newStatus
      );

      setIsParticipating(newStatus);
      setEventData((prev) => ({ ...prev, participants: updated }));
    } catch (error) {
      console.error("Erro ao atualizar participação:", error);
      Alert.alert("Erro", "Não foi possível atualizar a participação");
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!userId || !eventData.id) return;

    try {
      setLoading(true);
      const newStatus = !isFavorited;

      await updateArrayField(
        "users",
        userId,
        "favorites",
        eventData.id,
        newStatus
      );
      const updated = await updateArrayField(
        "Events",
        eventData.id,
        "favorites",
        userId,
        newStatus
      );

      setIsFavorited(newStatus);
      setEventData((prev) => ({ ...prev, favorites: updated }));
    } catch (error) {
      console.error("Erro ao atualizar favorito:", error);
      Alert.alert("Erro", "Não foi possível atualizar favoritos");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={GlobalStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>A carregar...</Text>
      </View>
    );
  }

  if (!eventData.id) {
    return (
      <View style={GlobalStyles.container}>
        <Text>Evento não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
      }}
    >
      {/* 🔙 Botão de voltar */}
      <Pressable
        onPress={() => navigation.goBack()}
        style={{ marginBottom: 16, alignSelf: "flex-start" }}
      >
        <Ionicons name="arrow-back" size={24} color="#3f51b5" />
      </Pressable>

      <View style={[GlobalStyles.card, { alignSelf: "center", width: "100%" }]}>
        {eventData.imageUrl && (
          <Image
            source={{ uri: eventData.imageUrl }}
            style={GlobalStyles.image}
            resizeMode="cover"
          />
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <Text style={GlobalStyles.cardTitle}>{eventData.title}</Text>
          <Pressable onPress={handleFavoriteToggle}>
            <Ionicons
              name={isFavorited ? "star" : "star-outline"}
              size={24}
              color={isFavorited ? "#ffd700" : "#999"}
            />
          </Pressable>
        </View>

        <Text style={GlobalStyles.description}>{eventData.description}</Text>
        <Text>
          <Text style={GlobalStyles.labelBold}>Data e horário: </Text>
          {eventData.datetime}
        </Text>
        <Text>
          <Text style={GlobalStyles.labelBold}>Local: </Text>
          {eventData.location}
        </Text>
        <Text>
          <Text style={GlobalStyles.labelBold}>Categoria: </Text>
          {eventData.category}
        </Text>

        {/* 📊 Contadores com ícones */}
        <View style={{ flexDirection: "row", marginTop: 12, gap: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="star" size={16} color="#ffcc00" />
            <Text style={{ marginLeft: 4 }}>{eventData.favorites.length}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="people" size={16} color="#3f51b5" />
            <Text style={{ marginLeft: 4 }}>
              {eventData.participants.length}
            </Text>
          </View>
        </View>

        <Pressable
          style={[
            GlobalStyles.smallButton,
            {
              backgroundColor: isParticipating ? "#ccc" : "#ff4e50",
              marginTop: 20,
            },
          ]}
          onPress={handleParticipate}
        >
          <Text style={GlobalStyles.smallButtonText}>
            {isParticipating ? "Cancelar participação" : "Participar"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
