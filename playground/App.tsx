import { useState } from 'react'
import { AlphaPicker, ColorPicker, HuePicker, SaturationPicker } from '../src'

function App() {
  const [hue, setHue] = useState(200)
  const [alpha, setAlpha] = useState(100)
  const [ls, setLs] = useState({ l: 50, s: 100 })
  const [color, setColor] = useState('hsla(200, 100%, 50%, 0.9)')
  return (
    <div className="app">
      <div>
        <div className="color">
          <div style={{background: `hsla(${hue}, ${ls.s}%, ${ls.l}%, ${alpha/100})`}}></div>
        </div>
        <span>{`hsla(${hue}, ${ls.s}%, ${ls.l}%, ${alpha/100})`}</span>
      </div>
      <p></p>
      <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
        <SaturationPicker
          style={{width: '200px', height: '100px'}}
          color={`hsl(${hue} 100% 50%)`}
          value={ls}
          onChange={setLs}
        />
        <HuePicker
          style={{width: '200px'}}
          value={hue}
          onChange={setHue}
        />
        <AlphaPicker
          style={{width: '200px'}}
          value={alpha}
          color={`hsl(${hue} 100% 50%)`}
          onChange={setAlpha}
        />
      </div>
      <p></p>
      <div style={{display: 'flex', flexDirection: 'row', gap: '10px'}}>
        <SaturationPicker
          style={{width: '400px', height: '200px'}}
          color={`hsl(${hue} 100% 50%)`}
          value={ls}
          onChange={setLs}
        />
        <HuePicker
          style={{height: '200px'}}
          value={hue}
          direction='vertical'
          onChange={setHue}
        />
        <AlphaPicker
          style={{height: '200px'}}
          value={alpha}
          color={`hsl(${hue} 100% 50%)`}
          direction='vertical'
          onChange={setAlpha}
        />
      </div>
      <p></p>
      <div>
        <div className="color">
          <div style={{background: `${color}`}}></div>
        </div>
        <span>{color}</span>
      </div>
      <ColorPicker
        value={color}
        onChange={setColor}
      />
    </div>
  )
}

export default App
