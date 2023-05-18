import { Slider } from "@miblanchard/react-native-slider";
import React, { useRef, useState } from "react";
import { View, StyleSheet, Animated, Button, Text, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import LinearGradient from "react-native-linear-gradient";

class App extends React.Component {

  constructor() {
    super();

    this.state = {
      toValue: 1,
      height: 20,
      boxWidth: 50,
      boxMargin: 0,
      duration: 3000,
      delay: 50,
    }

    this.prepare();
  }

  componentDidMount() {
    this.animate();
  }

  prepare = () => {
    this.width = Math.floor(Dimensions.get('window').width / (this.state.boxWidth + 2*this.state.boxMargin));

    this.rowAnimations = [];
    this.animatedValues = [];

    for (let y = 0; y < this.state.height; y++) {
      let rowAnimatedValues = [];
      for (let i = 0; i < this.width; i++) {
        rowAnimatedValues[i] = new Animated.Value(this.state.toValue === 1 ? 0 : 1);
        this.animatedValues[y * this.width + i] = rowAnimatedValues[i];
      }
      this.rowAnimations[y] = Animated.stagger(this.state.delay, rowAnimatedValues.map((value) => (Animated.timing(value, { toValue: this.state.toValue, duration: this.state.duration, useNativeDriver: true }))));
    }
  }

  animate = () => {
    this.rowAnimations.forEach((animation) => animation.stop())
    Animated.stagger(this.state.delay, this.rowAnimations).start();
    this.setState({ toValue: this.state.toValue === 1 ? 0 : 1 })
  }

  render() {

    const {boxWidth, boxMargin, duration, height} = this.state;

    return (
      <View style={{backgroundColor: '#121212'}}>
        <TouchableOpacity style={{margin: 20}} onPress={() => { this.prepare(); this.animate() }}>
          <LinearGradient colors={['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082']} style={styles.button} start={{x: 0, y: 0}} end={{x: 1, y: 1}}>
            <View>
              <Text style={{ fontSize: 20, color: 'black', fontWeight: 600 }}>Animate</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
        <ScrollView style={{marginBottom: 30}}>
          <View style={styles.sliderContainer}>
            <View style={styles.sliderBox}>
              <Text style={{color: 'black'}}>Size of the boxes : {boxWidth}</Text>
              <Slider 
                value={boxWidth} 
                onValueChange={value => this.setState({boxWidth : value[0]})}
                minimumValue={10}
                maximumValue={50}
                step={1} />
            </View>
            <View style={styles.sliderBox}>
              <Text style={{color: 'black'}}>Duration : {duration}</Text>
              <Slider 
                value={duration} 
                onValueChange={value => this.setState({duration : value[0]})}
                minimumValue={500}
                maximumValue={5000}
                step={1} />
            </View>
            <View style={styles.sliderBox}>
              <Text style={{color: 'black'}}>Height : {height}</Text>
              <Slider 
                value={height} 
                onValueChange={value => this.setState({height : value[0]})}
                minimumValue={1}
                maximumValue={50}
                step={1} />
            </View>
          </View>
          <View style={styles.container}>
            {this.animatedValues.map((value, index) => {
              return (
                <Animated.View 
                  key={index} 
                  style={
                    { 
                      opacity: value, 
                      backgroundColor: `hsl(${(Math.floor(index / this.width) + index % this.width) / this.state.height * 360}, 100%, 50%)`,
                      width: boxWidth,
                      height: boxWidth, 
                      margin: this.state.boxMargin,
                    }} />
              )
            })}
          </View>
          
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  box: {
    width: 30,
    height: 30,
    margin: .5,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
  },
  sliderContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  sliderBox: {
    borderBottomWidth: 2,
    paddingHorizontal: 20,
    marginBottom: 10,
  }
})

export default App;