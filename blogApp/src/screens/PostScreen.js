import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Text, Card, Button, Avatar, Input } from 'react-native-elements';
import Entypo from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import uuid from 'uuid-random';

import { AuthContext } from '../providers/AuthProvider';
import HeaderHome from './../components/Header';
import CommentCard from '../components/CommentCard';
import {
  addDataJSON,
  getDataJSON,
  storeDataJSON,
} from '../functions/AsyncStorageFunctions';

const PostScreen = (props) => {
  console.log(props);
  let info = props.route.params;
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [postcomments, setPostComments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const input = React.createRef();

  const loadComments = async () => {
    setLoading(true);
    let commentList = await getDataJSON('Comments');
    setComments(commentList);
    if (commentList != null) {
      setPostComments(commentList.filter((e) => e.postid == info.postid));
    } else {
      setPostComments([]);
    }
    setLoading(false);
  };

  const loadNotifications = async () => {
    setNotifications(await getDataJSON('Notifications'));
  };

  useEffect(() => {
    loadComments();
    loadNotifications();
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
            <View style={styles.authorStyle}>
              <Avatar
                containerStyle={{ backgroundColor: '#ffab91' }}
                rounded
                icon={{ name: 'user', type: 'font-awesome', color: 'black' }}
                activeOpacity={1}
              />
              <View>
                <Text h4Style={{ paddingHorizontal: 10, paddingBottom: 5 }} h4>
                  {info.user.name}
                </Text>
                <Text style={{ fontStyle: 'italic', fontSize: 12, paddingHorizontal: 10,}}>
                  {info.time}
                </Text>
              </View>
            </View>
            
            <Text style={styles.textstyle}>{info.body}</Text>
            <Card.Divider />
            <Text style={{ paddingBottom: 7 }}>
              {0} Likes, {postcomments.length} Comments.
            </Text>
            <Card.Divider />
            <Input
              ref={input}
              clearButtonMode={'always'}
              placeholder="Write a comment"
              leftIcon={<Entypo name="pencil" size={20} color="black" />}
              onChangeText={function (currentInput) {
                setComment(currentInput);
              }}
            />
            <Button
              type="outline"
              title="Comment"
              onPress={function () {
                if (comment != '') {
                  let newComment = {
                    postid: info.postid,
                    commentid: uuid(),
                    user: auth.CurrentUser,
                    time: moment().format('DD MMM, YYYY ') + 'at' + moment().format(' hh:mm A'),
                    body: comment,
                  };
                  let newNotification = {
                    notificationid: uuid(),
                    type: 'comment',
                    author: auth.CurrentUser,
                    postid: info.postid,
                    postauthor: info.user,
                    text: auth.CurrentUser.name,
                  };

                  if (postcomments == undefined) {
                    setPostComments([newComment]);
                  } else {
                    setPostComments([...postcomments, newComment]);
                  }

                  if (comments == undefined) {
                    setComments([newComment]);
                    storeDataJSON('Comments', [newComment]);
                  } else {
                    setComments([...comments, newComment]);
                    addDataJSON('Comments', newComment);
                  }
                  if (notifications == undefined) {
                    setNotifications([newNotification]);
                    storeDataJSON('Notifications', [newNotification]);
                  } else {
                    setNotifications([...notifications, newNotification]);
                    addDataJSON('Notifications', newNotification);
                  }
                }
                input.current.clear();
                setComment('');
              }}
            />
            <ActivityIndicator
              size={'large'}
              color={'red'}
              animating={loading}
            />
          </Card>

          <FlatList
            data={postcomments}
            inverted={true}
            scrollsToTop={true}
            keyExtractor={(item) => item.commentid}
            renderItem={({ item }) => {
              return (
                <CommentCard
                  name={item.user.name}
                  time={item.time}
                  comment={item.body}
                />
              );
            }}
          />
        </ScrollView>
      )}
    </AuthContext.Consumer>
  );
};

const styles = StyleSheet.create({
  textstyle: {
    paddingVertical: 25,
    paddingBottom: 20,
    fontSize: 18,
  },
  authorStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewStyle: {
    flex: 1,
  },
});

export default PostScreen;
