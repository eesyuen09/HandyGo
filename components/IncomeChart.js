import React, { useState, useEffect } from 'react';
import { View, Dimensions, TouchableWithoutFeedback} from 'react-native';
import Svg, { Line, Circle, Path, Text as SvgText, TSpan, G } from 'react-native-svg';
import * as shape from 'd3-shape';
import * as scale from 'd3-scale';
import { useFonts } from 'expo-font';
import { getAuth } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';


const screenWidth = Dimensions.get('window').width;
const MARGIN = { top: 20, right: 20, bottom: 30, left: 45 };
const chartWidth = screenWidth * 0.75 - MARGIN.left - MARGIN.right;
const chartHeight = 200;

export const colours = {
  darkest_coco: "#704F38",
  main_coco: "#A76545",
  beige: "#F9F2ED",
  grey: "#E3E3E3",
  white: "#FFFFFF",
  yellow_brown: "#DDA853",
  black: "#000000",
};

const { main_coco } = colours;

// const fullData = [400, 600, 1230, 900, 700, 800, 1000, 2300, 1400, 1900, 2400, 1700];
// const fullLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];






export default function IncomeChart({ startMonth = 0, endMonth = 6}) {
  const [fullLabels, setFullLabels] = useState([]);
  const [fullData, setFullData] = useState([]);
  const [selectedDot, setSelectedDot] = useState(null);

  const [fontsLoaded] = useFonts({
    Sora: require("../assets/fonts/Sora-VariableFont_wght.ttf"),
    Inter: require("../assets/fonts/Inter-regular.ttf"),
  });

  if (!fontsLoaded) return null;

  const months = endMonth - startMonth;



  useEffect(() => {
    async function loadEarnings() {
      //fetch the user’s monthlyEarnings map from Firestore
      const uid = getAuth().currentUser.uid;
      const snap = await getDoc(doc(db, 'users', uid));
      const monthly = snap.exists() ? snap.data().monthlyEarnings || {} : {};

      // build the last N month‐keys ("YYYY-MM") and short labels ("Jul", etc.)
      const now   = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);

      
      const monthKeys = Array.from({ length: 12 }).map((_, i) => {
         // i = 0 → Jan, 1 → Feb, … 11 → Dec
        const d = new Date(now.getFullYear(), i, 1);
        return d.toISOString().slice(0, 7);   // e.g. "2025-07"
      });

      const monthLabels = monthKeys.map(iso => {
        const [year, m] = iso.split('-');
        return new Date(+year, +m - 1, 1)
          .toLocaleString('default', { month: 'short' }); // "Jul"
      });

      //fill in missing months with zero
      const series = monthKeys.map(key => monthly[key] || 0);

      // push into state
      setFullLabels(monthLabels);
      setFullData(series);
    }

    loadEarnings();
  }, [fontsLoaded]);

  const data = fullData.slice(startMonth, endMonth);
const labels = fullLabels.slice(startMonth, endMonth);


  const maxY = fullData.length ? Math.max(...fullData) : 0;
  const minY = 0;

  const xScale = scale.scalePoint()
    .domain(labels)
    .range([0, chartWidth])
    .padding(0.5);

  const yScale = scale.scaleLinear()
    .domain([minY, maxY])
    .range([chartHeight, 0]);

  const points = data.map((d, i) => ({
    x: xScale(labels[i]),
    y: yScale(d),
    value: d,
  }));

  const line = shape.line()
    .x(d => d.x)
    .y(d => d.y)
    .curve(shape.curveCatmullRom.alpha(0.5))(points);
  
  // only build yTicks once you have at least one data point
  const yTicks = fullData.length
    ? Array.from({length:5}, (_,i)=>Math.round((maxY/4)*i))
    : [];

  return (
    <View style={{ paddingHorizontal: 20 }}>
      <Svg width={chartWidth + MARGIN.left + MARGIN.right} height={chartHeight + MARGIN.top + MARGIN.bottom + 40}>
        <G translateX={MARGIN.left} translateY={MARGIN.top}>
          {/* Y Axis */}
          <Line x1={0} y1={0} x2={0} y2={chartHeight} stroke={main_coco} strokeWidth="2" />

          {/* Y Labels */}
          {yTicks.map((value, i) => (
        <SvgText
  key={i}
  x={-10}
  y={yScale(value)}
  fontSize="13"
  fill={main_coco}
  textAnchor="end"
  alignmentBaseline="middle"
  fontFamily='Sora'
>
  {value}
</SvgText>
          ))}

          {/* X Axis */}
          <Line x1={0} y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke={main_coco} strokeWidth="2" />

          {/* X Labels */}
          {labels.map(label => (
            <SvgText
              key={label}
              x={xScale(label)}
              y={chartHeight + 15}
              fontSize="13"
              fill={main_coco}
              textAnchor="middle"
              fontFamily='Sora'
            >
              {label}
            </SvgText>
          ))}

          {/* Line Path */}
          <Path d={line} fill="none" stroke={main_coco} strokeWidth="3" />

          {/* Dots */}
          {points.map((p, i) => (
            <G key={i}>
              <Circle
                cx={p.x}
                cy={p.y}
                r="6"
                fill={main_coco}
                onPress={() => setSelectedDot(p)} 
              />
            </G>
          ))}

        {/* Tooltip (floating label) */}
          {selectedDot && (
  <>
    {/* White outline */}
    <SvgText
      x={selectedDot.x}
      y={selectedDot.y - 15}
      fontSize="14"
      fontWeight="bold"
      fill="#FFFFFF"
      textAnchor="middle"
      fontFamily="Inter"
      stroke="#FFFFFF"
      strokeWidth={4}
    >
      {selectedDot.value}
    </SvgText>

    {/* Actual text */}
    <SvgText
      x={selectedDot.x}
      y={selectedDot.y - 15}
      fontSize="14"
      fontWeight="bold"
      fill={main_coco}
      textAnchor="middle"
      fontFamily="Inter"
    >
      {selectedDot.value}
    </SvgText>
  </>
)}
        </G>
      </Svg>
    </View>
  );
}