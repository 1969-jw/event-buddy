import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { signIn } from "../services/firebaseAuth";
import GlobalStyles from "../styles/GlobalStyles";
import { auth } from "../../firebaseConfig";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetModalVisible, setResetModalVisible] = useState(false);

  const handleLogin = async () => {
    try {
      await signIn(email, password);
    } catch (error) {
      Alert.alert("Erro ao entrar", error.message);
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      Alert.alert("Erro", "Por favor, insira o email para recuperação.");
      return;
    }
    try {
      await auth.sendPasswordResetEmail(resetEmail);
      Alert.alert("Sucesso", "Email de recuperação enviado.");
      setResetModalVisible(false);
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  };
  return (
    <KeyboardAvoidingView
      style={GlobalStyles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={GlobalStyles.card}>
        <Icon
          name="ticket-confirmation"
          size={48}
          color="#3f51b5"
          style={GlobalStyles.formIcon}
        />
        <Text style={GlobalStyles.title}>Event Buddy</Text>
        <Text style={GlobalStyles.title}>Login</Text>

        <TextInput
          style={GlobalStyles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={GlobalStyles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity onPress={() => setResetModalVisible(true)}>
          <Text style={GlobalStyles.linkText}>Esqueci minha senha</Text>
        </TouchableOpacity>

        <Pressable style={GlobalStyles.button} onPress={handleLogin}>
          <Text style={GlobalStyles.buttonText}>Entrar</Text>
        </Pressable>

        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={[GlobalStyles.linkText, { marginTop: 16 }]}>
            Não tem conta? Registe-se
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        visible={resetModalVisible}
        animationType="slide"
        onRequestClose={() => setResetModalVisible(false)}
      >
        <View style={GlobalStyles.modalBackground}>
          <View style={GlobalStyles.modalContainer}>
            <Text style={GlobalStyles.modalTitle}>Recuperar Senha</Text>
            <TextInput
              style={GlobalStyles.input}
              placeholder="Digite seu email"
              value={resetEmail}
              onChangeText={setResetEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Pressable
              style={GlobalStyles.button}
              onPress={handlePasswordReset}
            >
              <Text style={GlobalStyles.buttonText}>Enviar</Text>
            </Pressable>
            <TouchableOpacity onPress={() => setResetModalVisible(false)}>
              <Text style={[GlobalStyles.linkText, { marginTop: 10 }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
