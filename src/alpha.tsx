export interface AlphaPickerOptions {
  value: number // alpha value 0~1
  hue: number // 0~360 
  direction?: 'horizontal' | 'vertical'
  className?: string
  style?: React.CSSProperties
  onChange?: (value: number) => void
}

export default function AlphaPicker(props: AlphaPickerOptions) {
  const direction = props.direction || 'horizontal'
  const update = (rect: DOMRect, clientX: number, clientY: number) => {
    if (direction === 'horizontal') {
      let v = (clientX - rect.left) / rect.width
      if (v < 0) v = 0
      if (v > 1) v = 1
      props.onChange!(Number(v.toFixed(3)))
    } else {
      let v = 1 - (clientY - rect.top) / rect.height
      if (v < 0) v = 0
      if (v > 1) v = 1
      props.onChange!(Number(v.toFixed(3)))
    }
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
  const style = direction === 'horizontal'
    ? {left: props.value * 100 + '%'}
    : {top: (100 - props.value) * 100 + '%'}
  const background = direction === 'horizontal'
    ? `linear-gradient(to right, transparent, hsl(${props.hue}, 100%, 50%))`
    : `linear-gradient(to bottom, hsl(${props.hue}, 100%, 50%), transparent)`
  return (
    <div
      className={['alpha-picker', direction, props.className].filter(e => e).join(' ')}
      style={props.style}
      onMouseDown={handleMouseDown}>
      <div className="alpha-picker-color" style={{background: background}}></div>
      <div className="alpha-picker-slider" style={style}></div>
    </div>
  )
}
