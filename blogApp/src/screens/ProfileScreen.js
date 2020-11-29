import React from "react";
import { View, StyleSheet, AsyncStorage, Image } from "react-native";
import { Text, Card, Button, Avatar } from "react-native-elements";
import { AuthContext } from "../providers/AuthProvider";
import HeaderHome from "../components/Header";
import { removeData } from "../functions/AsyncStorageFunctions";
const ProfileScreen = (props) => {
  return (
    <AuthContext.Consumer>
      {(auth) => (
        <View style={{flex: 1,}}>

          <HeaderHome
            DrawerFunction={() => {
              props.navigation.toggleDrawer();
            }}
          />

          <View style={styles.viewStyle}>
            <Card >
              <View style={styles.userStyle}>
                <Avatar
                  overlayContainerStyle={{ backgroundColor: '#ffab91' }}
                  rounded
                  size={'xlarge'}
                  icon={{
                    name: 'user',
                    type: 'font-awesome',
                    color: 'black',
                    size: 100,
                  }}
                  activeOpacity={1}
                />
              </View>

              <View style={{ paddingBottom: 30 }}>
                <Text h3Style={{ padding: 15, textAlign: "center" }} h3>{auth.CurrentUser.name}</Text>
                <View style={styles.viewStyle2}>
                  <Text style={styles.textStyle}>Born on :</Text>
                  <Text style={styles.textStyle2}>{auth.CurrentUser.dob}</Text>
                </View>
                <View style={styles.viewStyle2}>
                  <Text style={styles.textStyle}>Email :</Text>
                  <Text style={styles.textStyle2}>{auth.CurrentUser.email}</Text>
                </View>
                <View style={styles.viewStyle2}>
                  <Text style={styles.textStyle}>Address :</Text>
                  <Text style={styles.textStyle2}>{auth.CurrentUser.address}</Text>
                </View>
              </View>

              <Button 
                buttonStyle={{marginBottom:30}}
                title=' Delete Account'
                type="solid"
                onPress={
                  async function () {
                    await removeData(auth.CurrentUser.email);
                    auth.setIsLoggedIn(false);
                  }
                }
              />

            </Card>

          </View>
        </View>
      )}
    </AuthContext.Consumer>
  );

};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "auto",
    paddingLeft: 30,
    paddingBottom: 10,
  },
  textStyle2: {
    fontStyle: 'italic',
    fontSize: 20,
    paddingHorizontal: 10,
    fontWeight: "bold",
  },
  viewStyle: {
    flex: 1,
    justifyContent: "center",
  },
  viewStyle2: {
    flexDirection: "row"
  },
  userStyle: {
    alignSelf: "center",
    paddingTop:30,
  },
});

export default ProfileScreen;