import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {Text, Card, Button, Avatar, Input} from 'react-native-elements';
import Entypo from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import uuid from 'uuid-random';

import {AuthContext} from '../providers/AuthProvider';
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

  useEffect(() => {
    loadComments();
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
                containerStyle={{backgroundColor: '#ffab91'}}
                rounded
                icon={{name: 'user', type: 'font-awesome', color: 'black'}}
                activeOpacity={1}
              />
              <Text h4Style={{padding: 10}} h4>
                {info.user.name}
              </Text>
            </View>
            <Text style={{fontStyle: 'italic', fontSize: 12}}>
              {'  '}
              Posted on {info.time}
            </Text>
            <Text style={styles.textstyle}>{info.body}</Text>
            <Card.Divider />
            <Text style={{paddingBottom: 7}}>
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
                  let newcomment = {
                    postid: info.postid,
                    commentid: uuid(),
                    user: auth.CurrentUser,
                    time: moment().format('DD MMM, YYYY'),
                    body: comment,
                  };
                  
                  if (postcomments == undefined) {
                    setPostComments([newcomment]);
                  } else {
                    setPostComments([...postcomments, newcomment]);
                  }
                  
                  if (comments == undefined) {
                    setComments([newcomment]);
                    storeDataJSON('Comments', [newcomment]);
                  } else {
                    setComments([...comments, newcomment]);
                    addDataJSON('Comments', newcomment);
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
            renderItem={({item}) => {
              return (
                <CommentCard
                  name={item.user.name}
                  time={'Commented on ' + item.time}
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
