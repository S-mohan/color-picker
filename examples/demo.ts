import ColorPicker from '../src/index'

const instance = new ColorPicker(document.getElementById('demo1'), {
  change (color:string, colors:Object) {
    console.log(color, colors)
  }
})

console.log(instance)