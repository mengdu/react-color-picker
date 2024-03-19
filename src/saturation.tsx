export interface SaturationPickerOptions {
  value: {
    l: number // Lightness 0~100
    s: number // Saturation 0~100
  }
  hue: number, // 0 ~ 360
  className?: string
  style?: React.CSSProperties
  onChange?: (value: {l: number; s: number}) => void
}

export default function SaturationPicker(props: SaturationPickerOptions) {
  const update = (rect: DOMRect, clientX: number, clientY: number) => {
    let s = (clientX - rect.left) / rect.width
    let v = 1 - (clientY - rect.top) / rect.height
    if (s < 0) s = 0
    if (s > 1) s = 1
    if (v < 0) v = 0
    if (v > 1) v = 1
    // console.log(1, s, v)
    // hsv => hsl https://en.wikipedia.org/wiki/HSL_and_HSV
    const y = v * (1 - s / 2)
    // const x = (y === 0 || y === 1) ? 0 : (v - y) / Math.min(y, 1 - y)
    const x = (y === 0 || y === 1) ? s : (v - y) / Math.min(y, 1 - y)
    // console.log(2, x, y)
    // const b = y + x * Math.min(y, 1 - y)
    // // const a = b === 0 ? 0 : 2 * (1 - y/b)
    // const a = b === 0 ? s : 2 * (1 - y/b)
    // console.log(3, a, b)
    props.onChange!({
      s: Number((x * 100).toFixed(2)),
      l: Number((y * 100).toFixed(2)),
    })
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!props.onChange) return
    if (e.button !== 0) return
    const rect = e.currentTarget.getBoundingClientRect()
    update(rect, e.clientX, e.clientY)
    const handleMove = (e: MouseEvent) => {
      update(rect, e.clientX, e.clientY)
    }
    const handleUp = () => {
      document.removeEventListener('mousemove', handleMove, false)
      document.removeEventListener('mouseup', handleUp, false)
    }
    document.addEventListener('mousemove', handleMove, false)
    document.addEventListener('mouseup', handleUp, false)
  }

  const s = props.value.s / 100
  const l = props.value.l / 100
  const y = l + s * Math.min(l, 1 - l)
  // const x = y === 0 ? 0 : 2 * (1 - l/y)
  const x = y === 0 ? s : 2 * (1 - l/y)
  const left = x * 100
  const top = 100 - y * 100
  return (
    <div
      className={['saturation-picker', props.className].filter(e => e).join(' ')}
      style={{...props.style, background: `hsl(${props.hue}, 100%, 50%)`}}
      onMouseDown={handleMouseDown}>
      <div className="saturation-picker-slider" style={{left: left + '%', top: top + '%'}}></div>
    </div>
  )
}
