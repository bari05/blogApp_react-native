import React, { useState, useEffect } from "react";
import { ScrollView, View, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { Card, Button, Text, Avatar, Input } from "react-native-elements";
import moment from 'moment';
import PostCard from "./../components/PostCard";
import HeaderHome from "./../components/Header";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { AuthContext } from "../providers/AuthProvider";
import { storeDataJSON, getDataJSON, addDataJSON } from "../functions/AsyncStorageFunctions";


const HomeScreen = (props) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState('');
  const input = React.createRef();

  const loadPosts = async () => {
    setLoading(true);

    let allpost = await getDataJSON('Posts');
    setPosts(allpost);
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <AuthContext.Consumer>
      {(auth) => (
        <ScrollView style={styles.viewStyle}>
          <HeaderHome
            DrawerFunction={() => {
              props.navigation.toggleDrawer();
            }}
          />
          <Card>
            <Input
              ref={input}
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
                  addDataJSON('Posts', newpost);
                }
                input.current.clear();
                setPost('');
            }} />
          </Card>
          <ActivityIndicator
              size={'large'}
              color={'red'}
              animating={loading}
            />

          <FlatList
            data = {posts}
            inverted={true}
            scrollsToTop={true}
            renderItem = {function({item}){
              return(
                <PostCard
                  author= {item.user.name}
                  title= {'Posted on ' + item.time}
                  body={item.body}
                  navigation={props.navigation}
                  post={item}
                />
              )
            }}
          />
          
        </ScrollView>
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
