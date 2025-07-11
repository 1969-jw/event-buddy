import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { signUp } from "../services/firebaseAuth";
import GlobalStyles from "../styles/GlobalStyles";

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

const handleSignUp = async () => {
  if (password !== confirmPassword) {
    setErrorMessage("As passwords não coincidem.");
    return;
  }
  try {
    await signUp(email, password);
    await signOut(auth);
    setErrorMessage("");
    alert("🎉 Conta criada com sucesso!\n\nFaça login com sua nova conta para começar a explorar os eventos.");
    navigation.navigate("Login");
  } catch (error) {
    setErrorMessage("Erro ao criar conta: " + error.message);
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
        
        <Text style={GlobalStyles.title}>Criar Conta</Text>

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

        <TextInput
          style={GlobalStyles.input}
          placeholder="Confirmar Senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <Pressable style={GlobalStyles.button} onPress={handleSignUp}>
          <Text style={GlobalStyles.buttonText}>Registar</Text>
        </Pressable>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={[GlobalStyles.linkText, { marginTop: 16 }]}>
            Já tem conta? Faça login
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
