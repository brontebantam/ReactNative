import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import React, {Component} from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
  AppRegistry,

} from 'react-native';
import {  ListItem } from "react-native-elements";
import { MonoText } from '../components/StyledText';

var _ = require('lodash');

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
 
    this.state = {
      loading: false,
      data: [],
      pageToken: '',
      refreshing: false,
      siteTitle: '',
      location: null,
      errorMessage: null,
    };
  };
    componentDidMount() {
 
      //this.fetchData();
    }
    componentWillMount() {
      if (Platform.OS === 'android' && !Constants.isDevice) {
        this.setState({
          errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
        });
      } else {
        this._getLocationAsync();
      }
    }
    _getLocationAsync = async () => {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        this.setState({
          errorMessage: 'Permission to access location was denied',
        });
      }
  
      let location = await Location.getCurrentPositionAsync({});
      this.setState({ location });
    };
    fetchData = () => {
   
      //navigator.geolocation.getCurrentPosition(
              //(position) => {
      const latitude = 43.649969;//Number(position.coords.latitude.toFixed(6));
      const longitude = -79.376811;//Number(position.coords.longitude.toFixed(6));
      const { pageToken } = this.state;
      const urlFirst = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=500&type=restaurant&key=AIzaSyDnAhPGaDsac4BuAxkHUTYxKRjeaFx79Lo`;
      const urlNext = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=500&type=restaurant&key=AIzaSyDnAhPGaDsac4BuAxkHUTYxKRjeaFx79Lo&pagetoken=${pageToken}`;
   
      let url = pageToken === '' ? urlFirst : urlNext
      console.log(url);
      console.log("url");
      this.setState({ loading: true });
      fetch(url,  {mode: 'cors'})
        .then(res => {
          console.log("res");
          console.log(res);
          return res;
          //return res.json();
   
        })
        .then(res => {
          console.log("resjson");
          //const arrayData = _.uniqBy( [...this.state.data, ...res.results] , 'id' )
   
          this.setState({
            siteTitle: "Resturants Near By",
            data: pageToken === '' ? res.results : arrayData,
            loading: false,
            refreshing: false,
            pageToken: res.next_page_token
          });
   
        })
        .catch(error => {
          console.log(error);
          this.setState({ loading: false });
        });
      //}
      //)
    };
    renderSeparator = () => {
     return (
       <View
         style={{
           height: 1,
           width: "86%",
           backgroundColor: "#CED0CE",
           marginLeft: "14%"
         }}
       />
     );
    };
    renderHeader = () => {
      return (<Text style={{ alignSelf: "center", fontWeight: "bold", fontSize: 20, marginBottom: 10}}>{this.state.siteTitle}</Text>)
    };
    renderFooter = () => {
   
      if (this.state.pageToken === undefined) return null;
   
      return (
        <View
          style={{
            paddingVertical: 20,
            borderTopWidth: 1,
            borderColor: "#CED0CE"
          }}
        >
          <ActivityIndicator animating size="large" />
        </View>
      );
    };
   
    handleRefresh = () => {
      this.setState(
        {
          pageToken: '',
          refreshing: true
        },
        () => {
          this.fetchData();
        }
      );
    };
   
    handleLoadMore = () => {
      this.fetchData();
    };
    render() {
      let text = 'Waiting..';
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>{text}</Text>
         <FlatList
          data={this.state.data}
          keyExtractor={item => item.id}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderFooter}
          renderItem={({ item }) =>{
    
            const rating = item.rating ? item.rating : 'na'
  
            return (
            <View>
              <ListItem
                roundAvatar
                title={`${item.name}`+" ("+`${rating}`+")"}
                subtitle={`${item.vicinity}` }
                avatar={{ uri: item.icon }}
                containerStyle={{ borderBottomWidth: 0 }}
              />
              <View
                style={{
                  height: 1,
                  width: "86%",
                  backgroundColor: "#CED0CE",
                  marginLeft: "14%"
                }}
              /></View>
            );
          }}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={50}
        />
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/robot-dev.png')
                  : require('../assets/images/robot-prod.png')
              }
              style={styles.welcomeImage}
            />
          </View>

          <View style={styles.getStartedContainer}>
            <DevelopmentModeNotice />

            <Text style={styles.getStartedText}>Get started by opening!!!!!!</Text>

            <View
              style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
              <MonoText>screens/HomeScreen.js</MonoText>
            </View>

            <Text style={styles.getStartedText}>
              Change this text and your app will automatically reload.
            </Text>
          </View>

          <View style={styles.helpContainer}>
            <TouchableOpacity onPress={handleHelpPress} style={styles.helpLink}>
              <Text style={styles.helpLinkText}>
                Help, it didn’t automatically reload!
              </Text>
            </TouchableOpacity>
          </View>
         
       

        </ScrollView>

        <View style={styles.tabBarInfoContainer}>
          <Text style={styles.tabBarInfoText}>
            This is a tab bar. You can edit it in:
          </Text>

          <View
            style={[styles.codeHighlightContainer, styles.navigationFilename]}>
            <MonoText style={styles.codeHighlightText}>
              navigation/MainTabNavigator.js
            </MonoText>
          </View>
        </View>
      </View>
    );
  }
}
HomeScreen.navigationOptions = {
  header: null,
};

function DevelopmentModeNotice() {
  if (__DEV__) {
    const learnMoreButton = (
      <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
    );

    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled: your app will be slower but you can use
        useful development tools. {learnMoreButton}
      </Text>
    );
  } else {
    return (
      <Text style={styles.developmentModeText}>
        You are not in development mode: your app will run at full speed.
      </Text>
    );
  }
}

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/workflow/development-mode/'
  );
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/workflow/up-and-running/#cant-see-your-changes'
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
