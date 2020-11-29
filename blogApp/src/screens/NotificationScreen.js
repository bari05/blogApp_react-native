import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, ScrollView, } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import HeaderHome from './../components/Header';
import { AuthContext } from '../providers/AuthProvider';
import NotificationCard from '../components/NotificationCard';
import { getDataJSON } from '../functions/AsyncStorageFunctions';

const NotificationScreen = (props) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useContext(AuthContext);

  const loadNotifications = async () => {
    setLoading(true);
    let allnotifications = await getDataJSON('Notifications');
    if (allnotifications != undefined) {
      setNotifications(
        allnotifications.filter((e) =>
          e.postauthor.email == user.CurrentUser.email &&
          e.author.email != user.CurrentUser.email,
        ),
      );
    }
    setLoading(false);
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    loadNotifications();
  }, [isFocused]);

  return (
    <ScrollView style={styles.viewStyle}>
      <HeaderHome
        DrawerFunction={() => {
          props.navigation.toggleDrawer();
        }}
      />

      <ActivityIndicator size={'large'} color={'red'} animating={loading} />

      <FlatList
        data={notifications}
        inverted={true}
        scrollsToTop={true}
        keyExtractor={(item) => item.notificationid}
        renderItem={({ item }) => {
          return (
            <NotificationCard
              navigation={props.navigation}
              postid={item.postid}
              notifier={item.author.name}
            />
          );
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
  },
});

export default NotificationScreen;
