import React, { useState } from 'react';
import { View, Dimensions, TouchableWithoutFeedback} from 'react-native';
import Svg, { Line, Circle, Path, Text as SvgText, TSpan, G } from 'react-native-svg';
import * as shape from 'd3-shape';
import * as scale from 'd3-scale';


const screenWidth = Dimensions.get('window').width;
const MARGIN = { top: 40, right: 20, bottom: 30, left: 40 };
const chartWidth = (screenWidth - MARGIN.left - MARGIN.right)*0.8;
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

const data = [400, 600, 1230, 900, 700, 800];
const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const maxY = Math.max(...data);
const minY = 0;

export default function IncomeChart() {
const [selectedDot, setSelectedDot] = useState(null);

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

  return (
    <View style={{ paddingHorizontal: 20 }}>
      <Svg width={chartWidth + MARGIN.left + MARGIN.right} height={chartHeight + MARGIN.top + MARGIN.bottom + 40}>
        <G translateX={MARGIN.left} translateY={MARGIN.top}>
          {/* Y Axis */}
          <Line x1={0} y1={0} x2={0} y2={chartHeight} stroke={main_coco} strokeWidth="2" />

          {/* Y Labels */}
          {[0, 400, 800, 1200].map(value => (
        <SvgText
  key={value}
  x={-10}
  y={yScale(value)}
  fontSize="13"
  fill={main_coco}
  textAnchor="end"
  alignmentBaseline="middle"
  fontFamily='Inter'
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
              fontFamily='Inter'
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