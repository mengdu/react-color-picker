import { useState } from 'react'
import { ColorPicker } from '../../src'

function App() {
  const [color, setColor] = useState('hsla(200, 100%, 50%, 0.9)')
  const presets = [
    '#f44337', '#e91e63', '#9c27b0' , '#683ab8', '#3f52b5', '#2196F3', '#03A9F4', '#00BCD4', 'rgba(0, 0, 0, 0)', 'rgba(255, 255, 255, 0)',
    '#009688', '#4CAF50', '#8BC34A' , '#CDDC39', '#FFEB3B', '#FFC107', '#ff9800', '#ff5722', '#795548', '#9E9E9E'
  ]
  return (
    <div className="app">
      <div>
        <h1 className="title">React Color Picker</h1>
        <p className="des">A color picker component for React.</p>
        <div>
          <a href="https://github.com/mengdu/react-color-picker" target="_blank" className="button">
            <svg className="icon" role="presentation">
            <title>GitHub</title>
            <path d="M8,0.2c-4.4,0-8,3.6-8,8c0,3.5,2.3,6.5,5.5,7.6
                          C5.9,15.9,6,15.6,6,15.4c0-0.2,0-0.7,0-1.4C3.8,14.5,3.3,13,3.3,13c-0.4-0.9-0.9-1.2-0.9-1.2c-0.7-0.5,0.1-0.5,0.1-0.5
                          c0.8,0.1,1.2,0.8,1.2,0.8C4.4,13.4,5.6,13,6,12.8c0.1-0.5,0.3-0.9,0.5-1.1c-1.8-0.2-3.6-0.9-3.6-4c0-0.9,0.3-1.6,0.8-2.1
                          c-0.1-0.2-0.4-1,0.1-2.1c0,0,0.7-0.2,2.2,0.8c0.6-0.2,1.3-0.3,2-0.3c0.7,0,1.4,0.1,2,0.3c1.5-1,2.2-0.8,2.2-0.8
                          c0.4,1.1,0.2,1.9,0.1,2.1c0.5,0.6,0.8,1.3,0.8,2.1c0,3.1-1.9,3.7-3.7,3.9C9.7,12,10,12.5,10,13.2c0,1.1,0,1.9,0,2.2
                          c0,0.2,0.1,0.5,0.6,0.4c3.2-1.1,5.5-4.1,5.5-7.6C16,3.8,12.4,0.2,8,0.2z"></path>
            </svg>
            Star on GitHub
          </a>
        </div>
      </div>
      <div className="playground">
        <div style={{width: '250px', whiteSpace: 'nowrap'}}>
          <div className="color-view">
            <div style={{background: `${color}`}}></div>
          </div>&nbsp;
          <span>{color}</span>
        </div>
        <p></p>
        <ColorPicker
          value={color}
          presets={presets}
          onChange={setColor}
        />
      </div>
    </div>
  )
}

export default App
