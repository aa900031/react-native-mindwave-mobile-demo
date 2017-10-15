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
  ScrollView,
} from 'react-native';
import MindWaveMobile from 'react-native-mindwave-mobile';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const isMock = true;

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
        <View style={styles.block} >
          <Button onPress={this.handlePressScan} title="掃描" ></Button>
        </View>
        <View style={styles.block} >
          <Text style={styles.title} >裝置列表</Text>
          <ScrollView style={styles.deviceList} >
            {
              this.state.devices.map((device, index) => {
                return <TouchableOpacity key={index} style={styles.deviceItem} onPress={() => this.state.connected ? this.handlePressDisconnectDevice() : this.handlePressConnectDevice(device)} >
                  <Text style={styles.deviceItemTitle} >
                    {`裝置 ${device.id} ${this.state.connected === device.id ? '[已連結]' : ''}`}
                  </Text>
                </TouchableOpacity>
              })
            }
          </ScrollView>
        </View>
      </View>
    );
  }

  handlePressScan = () => {
    if (!this.state.isScanning) {
      if (isMock) {
        setTimeout(() => {
          this.handleFoundDevice({
            id: 'test1234',
          });
        }, 1000);
      } else {
        this.mwm.scan();
      }
      this.setState({
        isScanning: true,
      });
    }
  }

  handlePressConnectDevice = (device) => {
    this.willConnectDevice = device;
    if (isMock) {
      this.handleConnect({ success: true });
    }
  }

  handlePressDisconnectDevice = () => {
    if (!this.state.connected) {
      console.log('no connecting device');
      return ;
    }
    if (isMock) {
      this.handleDisconnect({ success: true });
    } else {
      this.mwm.disconnect();
    }
  }

  handleConnect = ({ success }) => {
    alert(`Connect ${success ? 'success' : 'fail'}`);
    if (this.willConnectDevice) {
      this.changeConnectedState(this.willConnectDevice.id, true);
    } else {
      console.log('will connect device is null');
    }
  }

  handleDisconnect = ({ success }) => {
    alert(`Disconnect ${success ? 'success' : 'fail'}`);
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
    backgroundColor: '#F5FCFF',
  },
  block: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
  },
  deviceList: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 5,
    paddingLeft: 5,
  },
  deviceItem: {
    borderWidth: 1,
    borderColor: 'black',
  },
  deviceItemTitle: {
    padding: 10,
  },
});
