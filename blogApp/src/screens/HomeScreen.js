import React, { useState, useEffect } from "react";
import { ScrollView, View, StyleSheet, FlatList } from "react-native";
import { Card, Button, Text, Avatar, Input } from "react-native-elements";
import moment from 'moment';
import PostCard from "./../components/PostCard";
import HeaderHome from "./../components/Header";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { AuthContext } from "../providers/AuthProvider";
import { storeDataJSON, getDataJSON, addPost } from "../functions/AsyncStorageFunctions";


const HomeScreen = (props) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState('');

  const loadPosts = async () => {
    setLoading(true);

    let allpost = await getDataJSON('Posts');
    setPosts(allpost);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <AuthContext.Consumer>
      {(auth) => (
        <View style={styles.viewStyle}>
          <HeaderHome
            DrawerFunction={() => {
              props.navigation.toggleDrawer();
            }}
          />
          <Card>
            <Input
              placeholder="What's On Your Mind?"
              leftIcon={<Entypo name="pencil" size={24} color="black" />}
              onChangeText={function (currentInput) {
                setPost(currentInput);
              }}
            />
            <Button title="Post" type="outline" 
              onPress={function () {
                let newpost = {
                  postid : auth.CurrentUser.email + moment().format('YYYY-MM-DD hh:mm:ss a'),
                  user: auth.CurrentUser,
                  time: moment().format('DD MMM, YYYY'),
                  body: post,
                };
                if (posts == undefined) {
                  setPosts([newpost]);
                  storeDataJSON('Posts', [newpost]);
                } else {
                  setPosts([...posts, newpost]);
                  addPost('Posts', newpost);
                }
                setPost('');
            }} />
          </Card>

          <FlatList
            data = {posts}
            renderItem = {function({item}){
              return(
                <PostCard
                  author= {item.user.name}
                  title= {'Posted on ' + item.time}
                  body={item.body}
                />
              )
            }}
          />
          
        </View>
      )}
    </AuthContext.Consumer>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 30,
    color: "blue",
  },
  viewStyle: {
    flex: 1,
  },
});

export default HomeScreen;
