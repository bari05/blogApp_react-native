import React, {useEffect, useState} from 'react';
import { View } from "react-native";
import { Card, Button, Text, Avatar } from "react-native-elements";
import { AntDesign } from "@expo/vector-icons";
import {useIsFocused} from '@react-navigation/native';

import {
  getDataJSON,
} from '../functions/AsyncStorageFunctions';

const PostCard = (props) => {
  const [postcomments, setPostComments] = useState([]);
  const isVisible = useIsFocused();


  const loadComments = async () => {
    let allcomments = await getDataJSON('Comments');
    if (allcomments != null) {
      setPostComments(
        allcomments.filter((el) => el.postid == props.post.postid),
      );
    } else {
      setPostComments([]);
    }
  };

  useEffect(() => {
    loadComments();
  }, [isVisible]);

  return (
    <Card>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Avatar
          containerStyle={{ backgroundColor: "#ffab91" }}
          rounded
          icon={{ name: "user", type: "font-awesome", color: "black" }}
          activeOpacity={1}
        />
        <Text h4Style={{ padding: 10 }} h4>
          {props.author}
        </Text>
      </View>
      <Text style={{ fontStyle: "italic" }}> 
        {props.title}
      </Text>
      <Text
        style={{
          paddingVertical: 10,
        }}
      >
        {props.body}
      </Text>
      <Card.Divider />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Button
          type="outline"
          title="  Like (17)"
          icon={<AntDesign name="like2" size={24} color="dodgerblue" />}
        />
        <Button type="solid"
          title={'  Comment  (' + postcomments.length + ')  '}
          onPress={function () {
            //console.log(props.post);
            props.navigation.navigate('Post', props.post);
          }}
        />
      </View>
    </Card>
  );
};

export default PostCard;
