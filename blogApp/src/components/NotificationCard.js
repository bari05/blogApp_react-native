import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Card, Text, Avatar} from 'react-native-elements';
import {getDataJSON} from '../functions/AsyncStorageFunctions';

function NotificationCard(props) {
  const [post, setPost] = useState('');
  const loadPost = async () => {
    let allpost = await getDataJSON('Posts');
    for (let a of allpost) {
      if (a.postid == props.postid) {
        setPost(a);
        break;
      }
    }
  };


  useEffect(() => {
    loadPost();
  }, []);

  return (
    <Card>
      <View
        onStartShouldSetResponder={() =>
          props.navigation.navigate('Post', post)
        }
        style={styles.viewStyle}>
        <Avatar
          containerStyle={{backgroundColor: '#669999'}}
          rounded
          icon={{name: 'commenting', type: 'font-awesome', color: '#ffcccc'}}
          activeOpacity={1}
        />
        <Text style={{paddingLeft: 10, fontWeight: "bold", fontStyle:"italic"}}>{props.notifier}</Text>
        <Text style={{fontStyle:"normal"}}>{' commented on your post'}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  viewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default NotificationCard;
