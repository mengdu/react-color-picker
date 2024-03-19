import colorutil from 'color'
import { useEffect, useRef, useState } from 'react'
import SaturationPicker from './saturation'
import HuePicker from './hue'
import AlphaPicker from './alpha'

function copied (text: string, cb?: (err?: Error) => void) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => cb && cb()).catch(cb)
  } else {
    const input = document.createElement('textarea')
    input.style.display = 'none'
    input.value = text
    document.body.appendChild(input)
    input.select()

    try {
      document.execCommand('copy', true)
      document.body.removeChild(input)
      cb && cb()
    } catch (err) {
      cb && cb(err as Error)
    }
  }
}

type Hsla = {
  hue: number // 0 ~ 360
  saturation: number // 0 ~ 100
  lightness: number // 0 ~ 100
  alpha: number // 0 ~ 1
}

function HSLAInput(props: {
  value: Hsla
  onChange?: (value: Hsla) => void
}) {
  const [hsla, setHsla] = useState({
    hue: '0',
    saturation: '0%',
    lightness: '0%',
    alpha: '1'
  })
  const update = (v: string, key: string) => {
    setHsla({ ...hsla, [key]: v })
    if (!props.onChange) return
    if (/\.0*$/.test(v)) return
    if (key === 'saturation' || key === 'lightness') {
      if (!/%$/.test(v)) return
      if (/\.0*?%$/.test(v)) return
    }
    if (key === 'alpha') {
      v = String(+v)
    } else if (key === 'saturation' || key === 'lightness') {
      v = v.replace(/%$/, '')
    }
    let value = +v
    if (Number.isNaN(value)) return
    if (key === 'hue') {
      if (value < 0) value = 0
      if (value > 359) value = 359
    } else if (key === 'saturation' || key === 'lightness') {
      if (value < 0) value = 0
      if (value > 100) value = 100
    } else if (key === 'alpha') {
      if (value < 0) value = 0
      if (value > 1) value = 1
    }
    props.onChange({ ...props.value, [key]: value })
  }
  const handleResize = (e: React.KeyboardEvent<HTMLInputElement>, k: string) => {
    if (e.code !== 'ArrowDown' && e.code !== 'ArrowUp') return
    const result = hsla[k as 'hue' | 'saturation' | 'lightness'].match(/\d+(\.\d*)?/)
    let v = result ? +result[0] : 0
    let speed = 1
    if (k === 'alpha') speed = 0.01
    if (e.code === 'ArrowDown') {
      v -= speed
    } else {
      v += speed
    }
    if (k === 'saturation' || k === 'lightness') {
      if (v < 0) v = 100
      if (v > 100) v = 0
      update(String(v) + '%', k)
    } else {
      if (k === 'hue') {
        if (v < 0) v = 359
        if (v > 359) v = 0
      } else if (k === 'alpha') {
        if (v < 0) v = 1
        if (v > 1) v = 0
      }
      update(String(v), k)
    }
  }

  useEffect(() => {
    setHsla({
      hue: String(props.value.hue),
      saturation: props.value.saturation + '%',
      lightness: props.value.lightness + '%',
      alpha: String(props.value.alpha)
    })
  }, [props.value])
  return (
    <div className="hsla-input">
      <div>
        <div><input type="text" value={hsla.hue} onChange={e => update(e.target.value, 'hue')} onKeyDown={e => handleResize(e, 'hue')}/></div>
        <div>H</div>
      </div>
      <div>
        <div><input type="text" value={hsla.saturation} onChange={e => update(e.target.value, 'saturation')} onKeyDown={e => handleResize(e, 'saturation')}/></div>
        <div>S</div>
      </div>
      <div>
        <div><input type="text" value={hsla.lightness} onChange={e => update(e.target.value, 'lightness')} onKeyDown={e => handleResize(e, 'lightness')}/></div>
        <div>L</div>
      </div>
      <div>
        <div><input type="text" value={hsla.alpha} onChange={e => update(e.target.value, 'alpha')} onKeyDown={e => handleResize(e, 'alpha')}/></div>
        <div>A</div>
      </div>
    </div>
  )
}

function RGBAInput(props: {
  value: Hsla
  onChange?: (value: Hsla) => void
}) {
  const [rgba, setRgba] = useState({
    r: '0',
    g: '0',
    b: '0',
    a: '1'
  })
  const update = (v: string, k: string) => {
    const vv = { ...rgba, [k]: v }
    setRgba(vv)
    if (/\.0*?$/.test(v)) return
    if (!props.onChange) return
    const hsl = colorutil.rgb(+vv.r, +vv.g, +vv.b, +vv.a).hsl().object()
    props.onChange({
      hue: hsl.h,
      saturation: hsl.s,
      lightness: hsl.l,
      alpha: (hsl.alpha === undefined ? 1 : hsl.alpha)
    })
  }
  const handleResize = (e: React.KeyboardEvent<HTMLInputElement>, k: string) => {
    if (e.code !== 'ArrowDown' && e.code !== 'ArrowUp') return
    let v = +rgba[k as 'r' | 'g' | 'b' | 'a']
    let speed = 1
    if (k === 'a') speed = 0.01
    if (e.code === 'ArrowDown') {
      v -= speed
    } else {
      v += speed
    }
    if (['r', 'g', 'b'].includes(k)) {
      if (v < 0) v = 255
      if (v > 255) v = 0
    } else {
      if (v < 0) v = 1
      if (v > 1) v = 0
    }
    update(String(v), k)
  }
  useEffect(() => {
    const rgba = colorutil.hsl(props.value.hue, props.value.saturation, props.value.lightness, props.value.alpha).rgb().object()
    setRgba({
      r: String(rgba.r),
      g: String(rgba.g),
      b: String(rgba.b),
      a: String(rgba.alpha === undefined ? 1 : rgba.alpha)
    })
  }, [props.value])
  return (
    <div className="rgba-input">
      <div>
        <div><input type="text" value={rgba.r} onChange={e => update(e.target.value, 'r')} onKeyDown={e => handleResize(e, 'r')}/></div>
        <div>R</div>
      </div>
      <div>
        <div><input type="text" value={rgba.g} onChange={e => update(e.target.value, 'g')} onKeyDown={e => handleResize(e, 'g')}/></div>
        <div>G</div>
      </div>
      <div>
        <div><input type="text" value={rgba.b} onChange={e => update(e.target.value, 'b')} onKeyDown={e => handleResize(e, 'b')}/></div>
        <div>B</div>
      </div>
      <div>
        <div><input type="text" value={rgba.a} onChange={e => update(e.target.value, 'a')} onKeyDown={e => handleResize(e, 'a')}/></div>
        <div>A</div>
      </div>
    </div>
  )
}

function HexInput(props: {
  value: Hsla,
  onChange?: (value: Hsla) => void
}) {
  const [hex, setHex] = useState('')
  const update = (v: string) => {
    setHex(v)
    if (!props.onChange) return
    if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)) return
    const hsla = colorutil(v).hsl().object()
    props.onChange({
      hue: hsla.h,
      saturation: hsla.s,
      lightness: hsla.l,
      alpha: props.value.alpha,
    })
  }
  useEffect(() => {
    const hex = colorutil.hsl(props.value.hue, props.value.saturation, props.value.lightness, props.value.alpha / 100).hex().toUpperCase()
    setHex(hex)
  }, [props.value])
  return (
    <div className="hex-input">
      <div>
        <div><input type="text" value={hex} onChange={e => update(e.target.value.trim())} /></div>
        <div>HEX</div>
      </div>
    </div>
  )
}

export interface ColorPickerOptions {
  value: string
  className?: string
  style?: React.CSSProperties
  format?: 'rgb' | 'hex' | 'hsl'
  presets?: string[]
  onChange?: (value: string) => void
}

export default function ColorPicker(props: ColorPickerOptions) {
  const [hsla, setHlsa] = useState({
    hue: 0,
    saturation: 0,
    lightness: 0,
    alpha: 1,
  })
  const [format, setFormat] = useState(props.format || 'hex')
  const [copyed, setCopyed] = useState(false)
  const [canEyeDropper, setCanEyeDropper] = useState(false)
  const changed = useRef(false)

  const emitUpdate = (hue: number, s: number, l: number, a: number) => {
    if (!props.onChange) return
    const hls = colorutil.hsl(hue, s, l, a)
    let color = ''
    if (format === 'rgb') {
      color = hls.rgb().toString()
    } else if (format === 'hsl') {
      color = hls.toString()
    } else {
      color = a === 1 ? hls.hex().toString() : hls.rgb().toString()
    }
    props.onChange!(color.toLowerCase())
  }

  const handleHue = (v: number) => {
    emitUpdate(v, hsla.saturation, hsla.lightness, hsla.alpha)
    setHlsa({ ...hsla, hue: v })
  }

  const handleSaturation = (s: number, l: number) => {
    emitUpdate(hsla.hue, s, l, hsla.alpha)
    setHlsa({ ...hsla, saturation: s, lightness: l })
  }

  const handleAlpha = (v: number) => {
    emitUpdate(hsla.hue, hsla.saturation, hsla.lightness, v)
    setHlsa({ ...hsla, alpha: v })
  }

  const handleSetHsla = (v: Hsla) => {
    setHlsa(v)
    emitUpdate(v.hue, v.saturation, v.lightness, v.alpha)
  }

  const handleSet = (color: string) => {
    const v = colorutil(color).hsl().object()
    const a = v.alpha === undefined ? 1 : v.alpha
    emitUpdate(v.h, v.s, v.l, a)
    setHlsa({
      hue: v.h,
      saturation: v.s,
      lightness: v.l,
      alpha: a
    })
  }

  const handleEyeDropper = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!window.EyeDropper) return
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const eyeDropper = new EyeDropper()
    eyeDropper.open().then((res: { sRGBHex: string }) => {
      const v = colorutil(res.sRGBHex).hsl().object()
      const a = v.alpha === undefined ? 1 : v.alpha * 1
      emitUpdate(v.h, v.s, v.l, a)
      setHlsa({
        hue: v.h,
        saturation: v.s,
        lightness: v.l,
        alpha: a
      })
    }).catch(() => {
      // console.error(err)
    })
  }

  const handleCopy = () => {
    setCopyed(true)
    setTimeout(() => {
      setCopyed(false)
    }, 1500)
  }

  const handleSwitch = () => {
    const arr = ['rgb', 'hex', 'hsl']
    let i = arr.indexOf(format)
    if (i === (arr.length - 1)) {
      i = 0
    } else {
      i++
    }
    setFormat(arr[i] as 'rgb' | 'hex' | 'hsl')
    changed.current = true
  }

  useEffect(() => {
    const v = colorutil(props.value).hsl().object()
    setHlsa({
      hue: v.h,
      saturation: v.s,
      lightness: v.l,
      alpha: v.alpha === undefined ? 1 : v.alpha
    })
  }, [props.value])

  useEffect(() => {
    setFormat(props.format || 'hex')
  }, [props.format])

  useEffect(() => {
    if (!changed.current) {
      return
    }
    emitUpdate(hsla.hue, hsla.saturation, hsla.lightness, hsla.alpha)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [format])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setCanEyeDropper(!!window.EyeDropper)
  }, [])

  return (
    <div
      className={['color-picker', props.className].filter(e => e).join(' ')}
      style={props.style}>
      <SaturationPicker
        hue={hsla.hue}
        value={{l: hsla.lightness, s: hsla.saturation}}
        onChange={v => handleSaturation(v.s, v.l)}
      />
      <div className="color-regulator">
        {canEyeDropper && <div className="color-eyedropper" title='Eye dropper' onClick={handleEyeDropper}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill='currentColor'>
            <path d="M341.6 29.2L240.1 130.8l-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L482.8 170.4c39-39 39-102.2 0-141.1s-102.2-39-141.1 0zM55.4 323.3c-15 15-23.4 35.4-23.4 56.6v42.4L5.4 462.2c-8.5 12.7-6.8 29.6 4 40.4s27.7 12.5 40.4 4L89.7 480h42.4c21.2 0 41.6-8.4 56.6-23.4L309.4 335.9l-45.3-45.3L143.4 411.3c-3 3-7.1 4.7-11.3 4.7H96V379.9c0-4.2 1.7-8.3 4.7-11.3L221.4 247.9l-45.3-45.3L55.4 323.3z"/>
          </svg>
        </div>}
        <div className="color-view current-color" onClick={() => copied(props.value, handleCopy)}>
          <div style={{background: `hsla(${hsla.hue}, ${hsla.saturation}%, ${hsla.lightness}%, ${hsla.alpha})`}}></div>
          {!copyed ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill='currentColor'>
            <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z"/>
          </svg> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill='currentColor'>
            <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
          </svg>}
        </div>
        <div className="color-regulator-content">
          <HuePicker
            value={hsla.hue}
            onChange={handleHue}
          />
          <AlphaPicker
            hue={hsla.hue}
            value={hsla.alpha}
            onChange={handleAlpha}
          />
        </div>
      </div>
      <div className="color-input">
        {format === 'hsl'
          ? <HSLAInput value={hsla} onChange={handleSetHsla}/>
          : format === 'rgb'
            ? <RGBAInput value={hsla} onChange={handleSetHsla}/>
            : <HexInput value={hsla} onChange={handleSetHsla}/>
        }
        <div className="input-switch-wrap">
          <button className="input-switch" onClick={handleSwitch}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor">
              <path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="presets">
        {props.presets?.map((e, i) => (
          <div key={i} className="color-view" onClick={() => handleSet(e)}><div style={{background: `${e}`}}></div></div>
        ))}
      </div>
    </div>
  )
}
