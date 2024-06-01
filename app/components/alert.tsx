import {
  Modal,
  Platform,
  Pressable,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

interface CustomAlertProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  textPrompt: string;
  onConfirm: () => void;
  onCancel: () => void;
  onDismiss?: () => void;
}

const CustomAlert = ({
  modalVisible,
  setModalVisible,
  textPrompt,
  onConfirm,
  onCancel,
  onDismiss,
}: CustomAlertProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <TouchableOpacity
        style={[
          Platform.OS === "ios" ? styles.iOSBackdrop : styles.androidBackdrop,
          styles.backdrop,
        ]}
        onPress={() => setModalVisible(false)}
      >
        <View style={styles.alertBox}>
          <Text style={styles.alertText}>{textPrompt}</Text>
          {onDismiss? <TouchableOpacity style={styles.button} onPress={onDismiss}><Text>Dismiss</Text></TouchableOpacity> :
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onConfirm}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onCancel}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
          </View>
        }
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  iOSBackdrop: {
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  androidBackdrop: {
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  backdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  alertBox: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  alertText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    minWidth: 80,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default CustomAlert;
