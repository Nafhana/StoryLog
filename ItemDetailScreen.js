import { useNavigation, useRoute } from "@react-navigation/native";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, Button, Text, View } from "react-native";
import { auth, db } from "../services/firebase";

export default function ItemDetailScreen() {
  const [item, setItem] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const itemId = route.params.itemId;

  useEffect(() => {
    const fetchItem = async () => {
      const docRef = doc(db, "users", auth.currentUser.uid, "items", itemId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) setItem(snapshot.data());
    };
    fetchItem();
  }, [itemId]);

  const handleDelete = async () => {
    Alert.alert("Confirm Delete", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, "users", auth.currentUser.uid, "items", itemId));
          navigation.goBack();
        },
      },
    ]);
  };

  if (!item) return <Text>Loading...</Text>;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontWeight: "bold", fontSize: 20 }}>{item.title}</Text>
      <Text>Type: {item.type}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Rating: {item.rating}/5</Text>
      <Text>Review: {item.review}</Text>
      <Text>Favorite: {item.favorite ? "Yes" : "No"}</Text>

      <Button title="Edit" onPress={() => navigation.navigate("AddItem", { itemId })} />
      <Button title="Delete" onPress={handleDelete} />
    </View>
  );
}
