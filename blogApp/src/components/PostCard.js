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
        <View>
          <Text h4Style={{ paddingHorizontal: 10, paddingBottom: 5 }} h4>
            {props.author}
          </Text>
          <Text style={{ fontStyle: 'italic', fontSize: 12, paddingHorizontal: 10, }}>
            {props.time}
          </Text>
        </View>

      </View>
      
      <Text
        style={{
          paddingVertical: 10, fontSize:16,
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
