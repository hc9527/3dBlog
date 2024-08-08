export function getOpacityCenter(yValue: number, lowerRange: number, upperRange: number) {
  let opacity = 0
  if (yValue >= lowerRange && yValue <= upperRange) {
    const center = (lowerRange + upperRange) / 2
    opacity = Math.abs(Math.abs((yValue - center) / (upperRange - center)) - 1)
  }
  return opacity
}

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
