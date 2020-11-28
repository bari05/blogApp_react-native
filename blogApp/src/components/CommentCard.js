import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Card, Text, Avatar} from 'react-native-elements';

function CommentCard(props) {
  return (
    <Card>
      <View style={styles.viewStyle}>
        <Avatar
          containerStyle={{backgroundColor: '#B2A865'}}
          rounded
          icon={{name: 'user', type: 'font-awesome', color: 'black'}}
          activeOpacity={1}
        />
        <Text h4Style={{paddingHorizontal: 10}} h4>
          {props.name}
        </Text>
      </View>
      <Text style={{fontStyle: 'italic', fontSize: 10, textAlign: 'right'}}>
        {props.time}
      </Text>
      <Card.Divider />
      <Text>{props.comment}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  viewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CommentCard;
