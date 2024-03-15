export interface SaturationPickerOptions {
  value: {
    l: number // Lightness 0~100
    s: number // Saturation 0~100
  }
  hue: number, // 0 ~ 359
  className?: string
  style?: React.CSSProperties
  onChange?: (value: {l: number; s: number}) => void
}

export default function SaturationPicker(props: SaturationPickerOptions) {
  const update = (rect: DOMRect, clientX: number, clientY: number) => {
    let s = (clientX - rect.left) / rect.width * 100
    let l = 100 - (clientY - rect.top) / rect.height * 100
    if (s < 0) s = 0
    if (s > 100) s = 100
    if (l < 0) l = 0
    if (l > 100) l = 100
    // see https://stackoverflow.com/questions/23520909/get-hsl-value-given-x-y-and-hue
    l = (l / 200) * (200 - s)
    props.onChange!({l, s})
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
  const left = props.value.s
  const top = 100 - (200 * (props.value.l / (200 - props.value.s)))
  return (
    <div
      className={['saturation-picker', props.className].filter(e => e).join(' ')}
      style={{...props.style, background: `hsl(${props.hue}, 100%, 50%)`}}
      onMouseDown={handleMouseDown}>
      <div className="saturation-picker-slider" style={{left: left + '%', top: top + '%'}}></div>
    </div>
  )
}
