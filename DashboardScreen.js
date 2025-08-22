import { useNavigation } from "@react-navigation/native";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, FlatList, TouchableOpacity, View } from "react-native";
import ItemCard from "../components/ItemCard";
import { auth, db } from "../services/firebase";

export default function DashboardScreen() {
  const [items, setItems] = useState([]);
  const navigation = useNavigation();

  const fetchItems = async () => {
    if (!auth.currentUser) return;

    const itemsRef = collection(db, "users", auth.currentUser.uid, "items");
    const q = query(itemsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setItems(list);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Button title="Add New Item" onPress={() => navigation.navigate("AddItem")} />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate("ItemDetail", { itemId: item.id })}>
            <ItemCard item={item} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}