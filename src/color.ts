

// 颜色转换相关算法
// https://jsfiddle.net/Lamik/9rky6fco/
// https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately

interface Hsva {
  h:number,
  s:number,
  v:number,
  a?:number
}

const HEX_REG = /^#([a-f\d]{3}|[a-f\d]{6})$/i

const RGB_REG = /^rgba?\s?\(/i

const HSL_REG = /^hsla?\s?\(/i

const HSV_REG = /^hsva?\s?\(/i

const parseAlpha = (a:any) => a !== void 0 && !isNaN(+a) && 0 <= +a && +a <= 1 ? +a : 1

export const hsv2hsl = (h: number, s: number, v: number) => {
  const l = v - v * s / 2
  const m = Math.min(1, 1 - l)

  return {
    h,
    s: m ? (v - l) / m : 0,
    l: l
  }
}

export const hsv2rgb = (h: number, s: number, v: number) => {
  let r, g, b, i, f, p, q, t
  i = Math.floor(h * 6)
  f = h * 6 - i
  p = v * (1 - s)
  q = v * (1 - f * s)
  t = v * (1 - (1 - f) * s)
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break
    case 1: r = q, g = v, b = p; break
    case 2: r = p, g = v, b = t; break
    case 3: r = p, g = q, b = v; break
    case 4: r = t, g = p, b = v; break
    case 5: r = v, g = p, b = q; break
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  }
}


export const rgb2hsv = (r: number, g: number, b: number, a?:number):Hsva => {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  const s = (max === 0 ? 0 : d / max)
  const v = max / 255
  let h
  switch (max) {
    case min: h = 0
      break
    case r:
      h = (g - b) + d * (g < b ? 6 : 0)
      h /= 6 * d
      break
    case g:
      h = (b - r) + d * 2
      h /= 6 * d
      break
    case b:
      h = (r - g) + d * 4
      h /= 6 * d
      break
  }

  return {
    h,
    s,
    v,
    a: parseAlpha(a)
  }
}


export const hsl2hsv = (h: number, s: number, l: number, a?:number):Hsva => {
  let _s
  let _v
  l *= 2
  s *= (l <= 1) ? l : 2 - l
  _v = (l + s) / 2
  _s = (2 * s) / (l + s)
  return {
    h,
    s: _s,
    v: _v,
    a: parseAlpha(a)
  }
}


export const hex2rgb = (color: string) => {
  color = color.replace(/^#/, '')
  if (color.length === 3) {
    const colors = []
    for (let i = 0; i < 3; i++) {
      colors.push(color[i], color[i])
    }
    color = colors.join('')
  }
  const colors = []
  for (let i = 0; i < 6; i += 2) {
    colors.push(parseInt('0x' + color.slice(i, i + 2)))
  }

  return {
    r: colors[0],
    g: colors[1],
    b: colors[2]
  }
}


export const parseColor = (color: string):Hsva => {
  if (!color) {
    return
  }

  // hex
  if (HEX_REG.test(color)) {
    const {r, g, b} = hex2rgb(color)
    return rgb2hsv(r, g, b)
  }

  // rgb
  if (RGB_REG.test(color)) {
    const colors = color
    .replace(RGB_REG, '')
    .replace(/\)/, '')
    .trim()
    .split(',')
    .filter((v:string) => v.trim() !== '')
    .map((v:string, index:number) => index === 3 ? parseFloat(v) : parseInt(v, 10))
    // 不必校验每个值是否合法，最终校验生成的color即可
    const [r, g, b, a] = colors
    const hsv:Hsva = rgb2hsv(r, g, b)
    hsv.a = parseAlpha(a)
    return hsv
  }

  // hsv/hsl
  let isHsl
  if (HSV_REG.test(color) || (isHsl = HSL_REG.test(color))) {
    const reg = isHsl ? HSL_REG : HSV_REG
    const colors = color
    .replace(reg, '')
    .replace(/\)/, '')
    .trim()
    .split(',')
    .filter((v:string) => v.trim() !== '')
    .map((v:string, index:number) => index === 3 ? parseAlpha(v) : parseFloat(v))
    const [h, s, v, a] = colors
    if (!isHsl) {
      return {
        h,
        s,
        v,
        a
      }
    } else {
      return hsl2hsv(h, s, v, a)
    }


  }


  return 
}



export default {
  hsv2hsl,
  hsv2rgb
}