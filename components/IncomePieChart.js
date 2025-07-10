import React from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';
import * as d3Shape from 'd3-shape';
import { useFonts } from 'expo-font';

const { width } = Dimensions.get('window');
const size = width -150;
const radius = size / 2;

const pieData = [
  { label: 'Cleaning', value: 35, color: '#A76545' },
  { label: 'Repair', value: 25, color: '#DDA853' },
  { label: 'Moving', value: 20, color: '#704F38' },
  { label: 'Others', value: 20, color: '#E3E3E3' },
];

export default function PieChart() {
  const [fontsLoaded] = useFonts({
      Sora: require("../assets/fonts/Sora-VariableFont_wght.ttf"),
      Inter: require("../assets/fonts/Inter-regular.ttf"),
    });
  const pieGen = d3Shape.pie().value(d => d.value);
  const arcGen = d3Shape.arc().outerRadius(radius).innerRadius(0);

  const arcs = pieGen(pieData);
//exp of arcs:
//   {
//     data: { label: 'A', value: 50 },
//     value: 50,
//     startAngle: 0,
//     endAngle: π,
//     ...
//   },
//   {
//     data: { label: 'B', value: 50 },
//     value: 50,
//     startAngle: π,
//     endAngle: 2π,
//     ...
//   }
// ]

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <Svg width={size} height={size}>
        <G x={radius} y={radius}>
          {arcs.map((arc, i) => (
            <G key={i}>
              <Path d={arcGen(arc)} fill={pieData[i].color} />
              {/* Optional: add labels */}
              <SvgText
                x={arcGen.centroid(arc)[0]}
                y={arcGen.centroid(arc)[1]}
                fill="#fff"
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily='Inter'
              >
                {`${pieData[i].label}:${pieData[i].value}`}
              </SvgText>
            </G>
          ))}
        </G>
      </Svg>
    </View>
  );
}