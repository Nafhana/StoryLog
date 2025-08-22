import { useNavigation, useRoute } from "@react-navigation/native";
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, Button, Picker, TextInput, View } from "react-native";
import { auth, db } from "../services/firebase";

export default function AddItemScreen() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("book");
  const [status, setStatus] = useState("plan-to-read");
  const [rating, setRating] = useState("0");
  const [review, setReview] = useState("");
  const [favorite, setFavorite] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const itemId = route.params?.itemId;

  useEffect(() => {
    if (itemId) {
      // Editing an existing item
      const fetchItem = async () => {
        const docRef = doc(db, "users", auth.currentUser.uid, "items", itemId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setTitle(data.title);
          setType(data.type);
          setStatus(data.status);
          setRating(data.rating.toString());
          setReview(data.review);
          setFavorite(data.favorite);
        }
      };
      fetchItem();
    }
  }, [itemId]);

  const handleSave = async () => {
    if (!auth.currentUser) return;

    const itemData = {
      title,
      type,
      status,
      rating: parseInt(rating),
      review,
      favorite,
      createdAt: serverTimestamp(),
    };

    try {
      if (itemId) {
        const docRef = doc(db, "users", auth.currentUser.uid, "items", itemId);
        await setDoc(docRef, itemData, { merge: true });
      } else {
        const itemsRef = collection(db, "users", auth.currentUser.uid, "items");
        await addDoc(itemsRef, itemData);
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", "Failed to save item");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={{ marginBottom: 10, borderWidth:1, padding:5 }}
      />

      <Picker selectedValue={type} onValueChange={setType}>
        <Picker.Item label="Book" value="book" />
        <Picker.Item label="Movie" value="movie" />
      </Picker>

      <Picker selectedValue={status} onValueChange={setStatus}>
        <Picker.Item label="Plan to Read/Watch" value="plan-to-read" />
        <Picker.Item label="Reading/Watching" value="reading" />
        <Picker.Item label="Completed" value="completed" />
      </Picker>

      <TextInput
        placeholder="Rating (1-5)"
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
        style={{ marginBottom: 10, borderWidth:1, padding:5 }}
      />

      <TextInput
        placeholder="Review"
        value={review}
        onChangeText={setReview}
        multiline
        style={{ marginBottom: 10, borderWidth:1, padding:5, height:80 }}
      />

      <Button title={favorite ? "Unfavorite" : "Mark as Favorite"} onPress={() => setFavorite(!favorite)} />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
}
