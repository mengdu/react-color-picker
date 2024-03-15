import color from 'color'
import { useMemo } from 'react'
import { SaturationPicker } from '.'


export interface ColorPickerOptions {
  value: string
  className?: string
  style?: React.CSSProperties
  onChange?: (value: string) => void
}

export default function ColorPicker(props: ColorPickerOptions) {
  const hsl = useMemo(() => {
    const v = color(props.value).hsl().object()
    return v
  }, [props.value])
  console.log(hsl)
  return (
    <div
      className={['color-picker', props.className].filter(e => e).join(' ')}
      style={props.style}>
      <SaturationPicker value={{l: hsl.l, s: hsl.s}} color={`hsl(${hsl.h}, '100%', '50%')`} />
    </div>
  )
}
