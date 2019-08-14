const $demo1 = document.getElementById('demo1')
const $demo1Result = document.getElementById('demo1-result')

const $demo2 = document.getElementById('demo2')
const $demo2Result = document.getElementById('demo2-result')

const FORMATS = ['hsl' , 'hsv' , 'hex' , 'rgb']

// 默认hsv值
const defaultHSV = {
  h: 360,
  s: 1,
  v: 1,
  a: 1
}

function run($result, instance, colors, alpha) {
  const parts = ['h', 's', 'v']
  if (alpha) {
    parts.push('a')
  }
  var html = `<ul>`
  parts.forEach(e => html += `<li>${e.toLocaleUpperCase()}:  ${colors[e]}</li>`)
  html += '</ul>'
  html += '<ul>'
  FORMATS.forEach(format => {
    const color = instance.getValue(format)
    html += `<li><span class="color-block" style="background:${color}"></span>${format.toLocaleUpperCase()}: ${color}</li>`
  })
  html += '</ul>'
  $result.innerHTML = html
}



const instance = new MoColorPicker($demo1, {
  change(color, colors) {
    run($demo1Result, this, colors)
  }
})
run($demo1Result, instance, defaultHSV)


const instance2 = new MoColorPicker($demo2, {
  value: '#6bc30d',
  alpha: true,
  change(color, colors) {
    run($demo2Result, this, colors)
  }
})
run($demo2Result, instance2, {
  h: 89,
  s: 93,
  v: 76,
  a: 1
})