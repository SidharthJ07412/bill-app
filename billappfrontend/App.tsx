import React, { useState } from "react";
import { View, TextInput, Button, FlatList, Text, Alert } from "react-native";
import axios from "axios";
import RNFS from "react-native-fs";

const App = () => {
  const [shopName, setShopName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [items, setItems] = useState([]);
  const [nitems, setnItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", price: "" });
  const [newnItem, setnNewItem] = useState({ name1: "", quantity1: "", price1: "" });

  const addItem = () => {
    if (newItem.name && newItem.quantity && newItem.price) {
      setItems([...items, newItem]);
      setNewItem({ name: "", quantity: "", price: "" });
    } else {
      Alert.alert("Error", "Please fill all item fields");
    }
  };

  const addnItem = () => {
    if (newnItem.name1 && newnItem.quantity1 && newnItem.price1) {
      setnItems((prevItems) => [...prevItems, newnItem]);  // ✅ Correct functional update
      setnNewItem({ name1: "", quantity1: "", price1: "" });  // ✅ Reset input fields
    } else {
      Alert.alert("Error", "Please fill all item fields");
    }
  };
  
  

  const generatePDF = async () => {
    try {
      const response = await axios.post("http://10.0.2.2:5000/generate-pdf", {
        shopName,
        address,
        contact,
        items,
        nitems
      }, { responseType: "arraybuffer"  });

      const path = `${RNFS.DocumentDirectoryPath}/bill.pdf`;
      await RNFS.writeFile(path, response.data, "base64"); 
      Alert.alert("Success", `PDF saved at: ${path}`);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to generate PDF");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Shop Details:</Text>
      <TextInput placeholder="Shop Name" value={shopName} onChangeText={setShopName} />
      <TextInput placeholder="Address" value={address} onChangeText={setAddress} />
      <TextInput placeholder="Contact No" value={contact} onChangeText={setContact} />

      <Text>Item Details:</Text>
      <TextInput placeholder="Item Name" value={newItem.name} onChangeText={(text) => setNewItem({ ...newItem, name: text })} />
      <TextInput placeholder="Quantity" keyboardType="numeric" value={newItem.quantity} onChangeText={(text) => setNewItem({ ...newItem, quantity: text })} />
      <TextInput placeholder="Unit Price" keyboardType="numeric" value={newItem.price} onChangeText={(text) => setNewItem({ ...newItem, price: text })} />

      <Button title="Add Item" onPress={addItem} />
      <FlatList
        data={items}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text>{item.name} - {item.quantity} x ₹{item.price}</Text>}
      />
      
      <Text>nItem Details:</Text>
      <TextInput placeholder="Item Name1" value={newnItem.name1} onChangeText={(text) => setnNewItem({ ...newnItem, name1: text })} />
      <TextInput placeholder="Quantity1" keyboardType="numeric" value={newnItem.quantity1} onChangeText={(text) => setnNewItem({ ...newnItem, quantity1: text })} />
      <TextInput placeholder="Unit Price1" keyboardType="numeric" value={newnItem.price1} onChangeText={(text) => setnNewItem({ ...newnItem, price1: text })} />
      <Button title="Add rev Item" onPress={addnItem} />
      <FlatList
        data={nitems}
        keyExtractor={(item, index) => `nitem-${index}`}
        renderItem={({ item }) => <Text>{item.name1} - {item.quantity1} x ₹{item.price1}</Text>}
       />
      <Button title="Generate PDF" onPress={generatePDF} />
    </View>
  );
};

export default App;

