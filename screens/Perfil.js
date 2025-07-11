import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  Modal,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { auth, database } from "../../firebaseConfig";
import GlobalStyles from "../styles/GlobalStyles";
import { useAuth } from "../context/AuthContext";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function PerfilScreen() {
  const { logout } = useAuth();
  const userId = auth.currentUser?.uid;
  const userEmail = auth.currentUser?.email;

  const [nome, setNome] = useState("");
  const [novoNome, setNovoNome] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [modalNomeVisible, setModalNomeVisible] = useState(false);
  const [modalSenhaVisible, setModalSenhaVisible] = useState(false);

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const userDoc = await database.collection("users").doc(userId).get();
        const userData = userDoc.data();
        setNome(userData?.nome || "");
        setNovoNome(userData?.nome || "");
        setProfileImage(userData?.profileImage || null);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        Alert.alert("Erro", "Não foi possível carregar seu perfil.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      carregarPerfil();
    }
  }, [userId]);

  const atualizarNome = async () => {
    if (!novoNome.trim()) {
      Alert.alert("Atenção", "Por favor, insira um nome válido.");
      return;
    }

    try {
      setLoading(true);
      await database
        .collection("users")
        .doc(userId)
        .set({ nome: novoNome }, { merge: true });
      setNome(novoNome);
      setModalNomeVisible(false);
      Alert.alert("Sucesso", "Nome atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar nome:", error);
      Alert.alert("Erro", "Não foi possível atualizar o nome.");
    } finally {
      setLoading(false);
    }
  };

  const atualizarSenha = async () => {
    if (novaSenha.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);
      await auth.currentUser.updatePassword(novaSenha);
      setNovaSenha("");
      setConfirmarSenha("");
      setModalSenhaVisible(false);
      Alert.alert("Sucesso", "Senha atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
      let errorMessage = "Não foi possível atualizar a senha.";

      if (error.code === "auth/requires-recent-login") {
        errorMessage =
          "Por segurança, faça login novamente antes de alterar sua senha.";
      }

      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Precisamos de acesso à sua galeria para alterar a foto."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets.length > 0) {
        setLoading(true);
        setProfileImage(result.assets[0].uri);
        Alert.alert("Sucesso", "Foto de perfil atualizada!");
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
      Alert.alert("Erro", "Não foi possível atualizar a foto de perfil.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={GlobalStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={GlobalStyles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={GlobalStyles.title}>Meu Perfil</Text>
      </View>

      <View style={styles.profileSection}>
        <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Ionicons name="person" size={50} color="#fff" />
            </View>
          )}
          <View style={styles.editIcon}>
            <MaterialIcons name="edit" size={18} color="#fff" />
          </View>
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{nome}</Text>
          <Text style={styles.email}>{userEmail}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações da Conta</Text>

        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={20} color="#666" />
          <Text style={styles.infoLabel}>Nome:</Text>
          <Text style={styles.infoValue}>{nome}</Text>
          <TouchableOpacity
            onPress={() => setModalNomeVisible(true)}
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={20} color="#666" />
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{userEmail}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" />
          <Text style={styles.infoLabel}>Senha:</Text>
          <Text style={styles.infoValue}>••••••••</Text>
          <TouchableOpacity
            onPress={() => setModalSenhaVisible(true)}
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>Alterar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && { opacity: 0.8 },
          ]}
          onPress={logout}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutButtonText}>Sair da Conta</Text>
        </Pressable>
      </View>

      {/* Modal Nome */}
      <Modal
        visible={modalNomeVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalNomeVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Nome</Text>
            <TextInput
              style={styles.modalInput}
              value={novoNome}
              onChangeText={setNovoNome}
              placeholder="Digite seu novo nome"
              placeholderTextColor="#999"
              autoFocus
            />
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalNomeVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.saveButton]}
                onPress={atualizarNome}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalButtonText}>Salvar</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Senha */}
      <Modal
        visible={modalSenhaVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalSenhaVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Alterar Senha</Text>
            <TextInput
              style={styles.modalInput}
              value={novaSenha}
              onChangeText={setNovaSenha}
              placeholder="Nova senha (mínimo 6 caracteres)"
              placeholderTextColor="#999"
              secureTextEntry
              autoFocus
            />
            <TextInput
              style={styles.modalInput}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              placeholder="Confirmar nova senha"
              placeholderTextColor="#999"
              secureTextEntry
            />
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalSenhaVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.saveButton]}
                onPress={atualizarSenha}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalButtonText}>Atualizar</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f2f2f2",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  imageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#999",
    justifyContent: "center",
    alignItems: "center",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#6C63FF",
    borderRadius: 12,
    padding: 4,
  },
  infoContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  email: {
    color: "#666",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  infoLabel: {
    marginLeft: 8,
    fontWeight: "500",
  },
  infoValue: {
    marginLeft: 4,
    flexShrink: 1,
  },
  editButton: {
    marginLeft: "auto",
    backgroundColor: "#6C63FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 12,
  },
  actionsContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "#ff4d4d",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: "#fff",
    marginLeft: 10,
    fontWeight: "bold",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 15,
    paddingVertical: 8,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    marginLeft: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  saveButton: {
    backgroundColor: "#6C63FF",
  },
  modalButtonText: {
    color: "#fff",
  },
});
