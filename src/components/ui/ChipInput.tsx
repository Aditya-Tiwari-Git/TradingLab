import { useState } from 'react'
import { Button } from './Button'

interface ChipInputProps {
  label?: string
  values: string[]
  onChange: (values: string[]) => void
  placeholder?: string
}

export const ChipInput = ({ label, values, onChange, placeholder }: ChipInputProps) => {
  const [input, setInput] = useState('')

  const addChip = () => {
    const value = input.trim()
    if (!value) return
    if (values.includes(value)) return
    onChange([...values, value])
    setInput('')
  }

  const removeChip = (chip: string) => {
    onChange(values.filter((value) => value !== chip))
  }

  return (
    <div className="flex flex-col gap-2 text-sm text-slate-300">
      {label ? <span className="text-xs uppercase tracking-wide text-slate-500">{label}</span> : null}
      <div className="flex flex-wrap gap-2">
        {values.map((chip) => (
          <span key={chip} className="flex items-center gap-2 rounded-full border border-bg-700/70 bg-bg-900/60 px-3 py-1 text-xs">
            {chip}
            <button onClick={() => removeChip(chip)} className="text-slate-400 hover:text-slate-200">
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              addChip()
            }
          }}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-bg-700/80 bg-bg-900/70 px-3 py-2 text-sm text-slate-200 outline-none transition focus:border-accent-400 focus:ring-2 focus:ring-accent-400/30 hover:border-bg-600"
        />
        <Button type="button" variant="secondary" onClick={addChip}>
          Add
        </Button>
      </div>
    </div>
  )
}
