import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {View, Text, StyleSheet} from 'react-native';

import HomeScreen from '../screens/main/HomeScreen';
import PostScreen from '../screens/main/PostScreen';
import MessageScreen from '../screens/main/MessageScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import VehicleCategoryScreen from '../screens/main/VehicleCategoryScreen';
import VehicleListScreen from '../screens/main/VehicleListScreen';
import ModelSelectScreen from '../screens/main/ModelSelectScreen';

// SVG ikonları import et - normal ve pressed versiyonları
import HomeIcon from '../assets/icons/home-icon.svg';
import HomeIconPressed from '../assets/icons/home-icon-pressed.svg';
import PostIcon from '../assets/icons/post-icon.svg';
import PostIconPressed from '../assets/icons/post-icon-pressed.svg';
import MessageIcon from '../assets/icons/message-icon.svg';
import MessageIconPressed from '../assets/icons/message-icon-pressed.svg';
import ProfileIcon from '../assets/icons/profile-icon.svg';
import ProfileIconPressed from '../assets/icons/profile-icon-pressed.svg';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Custom Tab Bar Icon Component
const TabBarIcon = ({focused, IconComponent, PressedIconComponent, label}) => {
  const ActiveIcon =
    focused && PressedIconComponent ? PressedIconComponent : IconComponent;

  return (
    <View style={[styles.tabIconContainer, focused && styles.tabIconActive]}>
      {focused && <View style={styles.activeIndicator} />}
      <ActiveIcon width={22} height={22} />
      <Text
        style={[styles.tabLabel, focused && styles.tabLabelActive]}
        numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused}) => {
          let IconComponent;
          let PressedIconComponent;
          let label;

          if (route.name === 'Home') {
            IconComponent = HomeIcon;
            PressedIconComponent = HomeIconPressed;
            label = 'Ana Sayfa';
          } else if (route.name === 'Post') {
            IconComponent = PostIcon;
            PressedIconComponent = PostIconPressed;
            label = 'Gönderilerim';
          } else if (route.name === 'Messages') {
            IconComponent = MessageIcon;
            PressedIconComponent = MessageIconPressed;
            label = 'Mesajlar';
          } else if (route.name === 'Profile') {
            IconComponent = ProfileIcon;
            PressedIconComponent = ProfileIconPressed;
            label = 'Profil';
          }

          return (
            <TabBarIcon
              focused={focused}
              IconComponent={IconComponent}
              PressedIconComponent={PressedIconComponent}
              label={label}
            />
          );
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          paddingBottom: 12,
          paddingTop: 8,
          height: 52,
          marginHorizontal: 15,
          marginBottom: 20,
          borderRadius: 20,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
        },
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Post" component={PostScreen} />
      <Tab.Screen name="Messages" component={MessageScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="TabNavigator" component={TabNavigator} />
      <Stack.Screen name="VehicleCategory" component={VehicleCategoryScreen} />
  <Stack.Screen name="VehicleList" component={VehicleListScreen} />
  <Stack.Screen name="ModelSelect" component={ModelSelectScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    height: 50,
    minWidth: 95,
    borderRadius: 12,
    marginHorizontal: 1,
    position: 'relative',
  },
  tabIconActive: {
    backgroundColor: '#FF976040',
    borderRadius: 12,
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    left: '20%',
    right: '20%',
    height: 3,
    backgroundColor: '#FF5B04',
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  tabLabel: {
    fontFamily: 'Urbanist',
    fontSize: 11,
    fontWeight: '500',
    color: '#000000',
    marginTop: 6,
    letterSpacing: 0.3,
    textAlign: 'center',
    numberOfLines: 1,
    includeFontPadding: false,
  },
  tabLabelActive: {
    color: '#FF5B04',
    fontWeight: '600',
  },
});

export default MainStack;
