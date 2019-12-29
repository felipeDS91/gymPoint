import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import Icon from 'react-native-vector-icons/MaterialIcons';

import LogoTitle from '~/components/LogoTitle';
import SignIn from './pages/SignIn';

import HelpOrder from './pages/HelpOrder';
import NewHelpOrder from './pages/NewHelpOrder';
import Answer from './pages/Answer';

import CheckIn from './pages/CheckIn';

export default (signedIn = false) =>
  createAppContainer(
    createSwitchNavigator(
      {
        Sign: createSwitchNavigator({
          SignIn,
        }),
        App: createBottomTabNavigator(
          {
            Check: {
              screen: createStackNavigator(
                {
                  CheckIn,
                },
                {
                  defaultNavigationOptions: ({ navigation }) => {
                    return LogoTitle(navigation);
                  },
                  navigationOptions: {
                    tabBarLabel: 'Check-ins',
                    tabBarIcon: ({ tintColor }) => (
                      <Icon name="edit-location" size={20} color={tintColor} />
                    ),
                  },
                }
              ),
            },
            Help: {
              screen: createStackNavigator(
                {
                  HelpOrder,
                  NewHelpOrder,
                  Answer,
                },
                {
                  defaultNavigationOptions: ({ navigation }) => {
                    return LogoTitle(navigation);
                  },
                  navigationOptions: {
                    tabBarLabel: 'Pedir ajuda',
                    tabBarIcon: ({ tintColor }) => (
                      <Icon name="live-help" size={20} color={tintColor} />
                    ),
                  },
                }
              ),
            },
          },
          {
            resetOnBlur: true,
            tabBarOptions: {
              keyboardHidesTabBar: true,
              activeTintColor: '#ee4e62',
              style: {
                backgroundColor: '#FFF',
              },
            },
          }
        ),
      },

      {
        initialRouteName: signedIn ? 'App' : 'Sign',
      }
    )
  );
