export function getOpacity(yValue: number, lowerRange: number, upperRange: number) {
  let opacity = 0
  if (yValue >= lowerRange && yValue <= upperRange) {
      // 在范围内时，根据 y 值计算 opacity
      opacity = Math.abs((yValue - lowerRange) / (upperRange - lowerRange))
  }
  return opacity
}

export function getOpacityReverse(yValue: number, lowerRange: number, upperRange: number) {
  let opacity = 0
  if (yValue >= lowerRange && yValue <= upperRange) {
      // 在范围内时，根据 y 值计算 opacity
      opacity = 1 - Math.abs((yValue - lowerRange) / (upperRange - lowerRange))
  }
  return opacity
}
