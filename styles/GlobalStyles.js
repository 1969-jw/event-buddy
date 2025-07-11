import { StyleSheet } from "react-native";

const GlobalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f6f9fc",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  container: {
    flex: 1,
    backgroundColor: "#f6f9fc",
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  title: {
    fontSize: 26,          // Aumentado para 26
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,      // Margem maior
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 14,    // Mais alto
    paddingHorizontal: 18,
    fontSize: 16,           // Texto maior para melhor legibilidade
    marginBottom: 16,
    backgroundColor: "#fff",
  },

  button: {
    backgroundColor: "#3f51b5",
    paddingVertical: 16,    // Botão maior (altura)
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  linkText: {
    color: "#3f51b5",
    textAlign: "center",
    fontSize: 15,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    elevation: 5,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 16,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },

  listContainer: {
    paddingBottom: 80,
  },

  card: {
    width: "100%",           // Definida largura maior para o formulário
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    paddingVertical: 32,    // Mais espaço vertical no card
    paddingHorizontal: 24,  // Mais espaço horizontal no card
  },

  image: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2d2d2d",
    flex: 1,
    marginBottom: 6,
  },

  description: {
    fontSize: 13,
    color: "#5a5a5a",
    marginBottom: 8,
  },

  labelBold: {
    fontWeight: "600",
    color: "#333",
  },

  smallButton: {
    backgroundColor: "#3f51b5",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignSelf: "flex-start",
  },

  smallButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },

  buttonParticipate: {
    backgroundColor: "#ff4e50",
    marginTop: 6,
  },

  favoriteIconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 5,
    elevation: 3,
  },

  formIcon: {
    alignSelf: "center",
    marginBottom: 16,
  },

  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    width: "85%",
    elevation: 5,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },

  modalButtons: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  logoutButton: {
  backgroundColor: "#ff4e50",
  paddingVertical: 8,       
  paddingHorizontal: 15,   
  borderRadius: 8,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  marginTop: 16,
  alignSelf: "center", 
},

logoutButtonText: {
  color: "#fff",
  fontWeight: "bold",
  fontSize: 14,             // diminui a fonte
  marginLeft: 6,
},

blueButton: {
  backgroundColor: "#3f51b5",
  paddingVertical: 14,
  borderRadius: 10,
  alignItems: "center",
  justifyContent: "center",
  marginTop: 16,
},

blueButtonText: {
  color: "#fff",
  fontWeight: "bold",
  fontSize: 16,
},
});

export default GlobalStyles;
