import React, { useState, useEffect } from "react";
import { View, StatusBar, FlatList } from "react-native";
import styled from "styled-components";
import AddInput from "./components/AddInput";
import TodoList from "./components/TodoList";
import Empty from "./components/Empty";
import Header from "./components/Header";
import firestore from '@react-native-firebase/firestore';

export default function App() {
  const [data, setData] = useState([]);

  async function sendtofirebase(varchar, tododate) {
    const text = varchar;
    const date = tododate;
    firestore()
      .collection('todolist')
      .add({
        todolist: text,
        todolistdate: date,
        key: Math.random().toString()
      });
  }
  useEffect(() => {
    const taskop = firestore()
      .collection('todolist')
      .onSnapshot(querySnapshot => {
        const data = querySnapshot.docs.map(doc => {
          return {
            todolist_id: doc.id,
            todolist: '',
            todolistdate: '',
            ...doc.data()
          };
        });
        setData(data);
      });
    return () => taskop();
  }, []);




  const submitHandler = (value, date) => {
    setData((prevTodo) => {

      const tdate = date.getDate() + "-" + parseInt(date.getMonth() + 1) + "-" + parseInt(date.getFullYear() + 543);
      sendtofirebase(value, tdate);
      return [
        {
          value: value,
          date: tdate,
          key: Math.random().toString(),
        },
        ...prevTodo,
      ];
    });
  };

  const deleteItem = (key) => {

    firestore()
      .collection('todolist')
      .doc(key).delete()
      .catch((error) => console.log(error));
  };

  const searchItem = (keyword) => {

  }

  return (
    <ComponentContainer>
      <View>
        <StatusBar barStyle="light-content" backgroundColor="darksalmon" />
      </View>
      <View>
        <FlatList
          data={data}
          ListHeaderComponent={() => <Header searchItem={searchItem} />}
          ListEmptyComponent={() => <Empty />}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <TodoList item={item} deleteItem={deleteItem} />
          )}
        />
        <View>
          <AddInput submitHandler={submitHandler} />
        </View>
      </View>
    </ComponentContainer>
  );
}

const ComponentContainer = styled.View`
  background-color: green;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;