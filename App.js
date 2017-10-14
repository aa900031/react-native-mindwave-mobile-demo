/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import _ from 'lodash';
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
} from 'react-native';
import MindWaveMobile from 'react-native-mindwave-mobile';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {
  state = {
    devices: [],
    connected: null,
    isScanning: false
  }
  willConnectDevice = null

  componentDidMount() {
    this.mwm = new MindWaveMobile();
    this.mwm.onConnect(this.handleConnect);
    this.mwm.onDisconnect(this.handleDisconnect);
    this.mwm.onFoundDevice(this.handleFoundDevice);
    this.mwm.onEEGPowerLowBeta(this.handleEEGPowerLowBeta);
    this.mwm.onEEGPowerDelta(this.handleEEGPowerLowBeta);
    this.mwm.onESense(this.handleESense);
    if (Platform.OS === 'ios') {
      this.mwm.onEEGBlink(this.handleEEGBlink);
      this.mwm.onMWMBaudRate(this.handleMWMBaudRate);
    }
  }

  componentWillUnmount() {
    this.mwm.removeAllListeners();
  }

  render() {
    return (
      <View style={styles.container}>
        <Button onPress={this.handlePressScan} >Scan</Button>
        <ScrollView style={{ flex: 1 }} >
          <View style={styles.list}>
            {
              this.state.devices.map(device => {
                return <TouchableOpacity onPress={() => this.handlePressConnectDevice(device)} >
                  <Text style={{ padding: 10 }}>
                    {`裝置 ${device.id} ${this.state.connected === device.id ? 'connected' : null}`}
                  </Text>
                </TouchableOpacity>
              })
            }
          </View>
        </ScrollView>
      </View>
    );
  }

  handlePressScan = () => {
    if (!this.state.isScanning) {
      this.mwm.scan();
      this.setState({
        isScanning: true,
      });
    }
  }

  handlePressConnectDevice = (device) => {
    this.willConnectDevice = device;
  }

  handlePressDisconnectDevice = () => {
    if (!this.state.connected) {
      console.log('no connecting device');
      return ;
    }
    this.mwm.disconnect();
  }

  handleConnect = ({ success }) => {
    alert('Connect ' + success ? 'success' : 'fail');
    if (this.willConnectDevice) {
      this.changeConnectedState(this.willConnectDevice.id, true);
    } else {
      console.log('will connect device is null');
    }
  }

  handleDisconnect = ({ success }) => {
    alert('Disconnect ' + success ? 'success' : 'fail');
    if (!this.state.connected) {
      console.log('no connecting device');
      return ;
    }
    this.changeConnectedState(this.state.connected, false)
  }

  handleFoundDevice = (device) => {
    console.log('on found deviceId ', device.id);

    this.pushDevice(device);
  }

  handleEEGPowerLowBeta = (data) => {
    console.log('onEEGPowerLowBeta', data);
  }

  handleEEGPowerDelta = (data) => {
    console.log('onEEGPowerDelta', data);
  }

  handleESense = (data) => {
    console.log('onESense', data);
  }

  handleEEGBlink = (data) => {
    console.log('onEEGBlink', data);
  }

  handleMWMBaudRate = (data) => {
    console.log('onMWMBaudRate', data);
  }

  pushDevice = (device) => {
    if (!device.id) {
      console.log('device id is undefined or null');
      return ;
    }
    if (_.find(this.state.devices, ['id', device.id])) {
      console.log(`device (${device.id}) is in list`);
      return ;
    }
    this.state.devices.push(device);
    
    this.setState({
      devices: this.state.devices,
    });
  }
  
  changeConnectedState = (id, connected) => {
    if (!id) {
      console.log('device id is undefined or null');
      return ;
    }
    const index = _.findIndex(this.state.devices, ['id', id]);
    if (index < 0) {
      console.log(`device (${id}) is not in list`);
      return ;
    }

    if (connected) {
      this.setState({
        connected: id,
      });
    } else {
      this.setState({
        connected: null,
      });
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
