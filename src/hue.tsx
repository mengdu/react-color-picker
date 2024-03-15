export interface HuePickerOptions {
  value: number // hue value 0~359
  direction?: 'horizontal' | 'vertical'
  className?: string
  style?: React.CSSProperties
  onChange?: (value: number) => void
}

export default function HuePicker(props: HuePickerOptions) {
  const direction = props.direction || 'horizontal'
  const update = (rect: DOMRect, clientX: number, clientY: number) => {
    if (direction === 'horizontal') {
      let v = 360 - (clientX - rect.left) / rect.width * 360
      if (v < 0) v = 0
      if (v > 359) v = 359
      props.onChange!(~~v)
    } else {
      let v = 360 - (clientY - rect.top) / rect.height * 360
      if (v < 0) v = 0
      if (v > 359) v = 359
      props.onChange!(~~v)
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
    ? {left: Math.abs(359 - props.value) / 360 * 100 + '%'}
    : {top: Math.abs(359 - props.value) / 360 * 100 + '%'}
  return (
    <div
      className={['hue-picker', direction, props.className].filter(e => e).join(' ')}
      style={props.style}
      onMouseDown={handleMouseDown}>
      <div className="hue-picker-slider" style={style}></div>
    </div>
  )
}
