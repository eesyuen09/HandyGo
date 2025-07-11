import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';
import IncomeChart from './IncomeChart'; // path to your chart component

export const colours = {
  darkest_coco: "#704F38",
  main_coco: "#A76545",
  beige: "#F9F2ED",
  grey: "#E3E3E3",
  white: "#FFFFFF",
  yellow_brown: "#DDA853",
  black: "#000000",
};

const { darkest_coco } = colours;
export default function ChartPager() {
  return (
    <PagerView style={{ flex: 1 }} initialPage={0}>
      <View key="1" style={styles.page}>
        <Text style={styles.header}>Income: Jan – Jun</Text>
        <IncomeChart startMonth={0} endMonth={6} />
      </View>
      <View key="2" style={styles.page}>
        <Text style={styles.header}>Income: Jul – Dec</Text>
        <IncomeChart startMonth={6} endMonth={12} />
      </View>
    </PagerView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    // marginBottom: 2,
    fontFamily: 'Sora',
    color: darkest_coco,
  },
});