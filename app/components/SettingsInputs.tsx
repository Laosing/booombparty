import React from "react"

interface NumberInputProps {
  label: string
  value: number | string
  onChange: (value: number | string) => void
  min?: number
  max?: number
  helperText?: React.ReactNode
  required?: boolean
}

export function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  helperText,
}: NumberInputProps) {
  return (
    <div className="form-control w-full max-w-xs mb-6">
      <label className="label">
        <span className="label-text font-bold">{label}</span>
      </label>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const val = e.target.value
          if (val === "") {
            onChange("")
          } else {
            onChange(parseInt(val))
          }
        }}
        className="input input-bordered w-full max-w-xs"
      />
      {helperText && (
        <label className="label">
          <span className="label-text-alt opacity-70">{helperText}</span>
        </label>
      )}
    </div>
  )
}

interface ToggleInputProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  helperText?: React.ReactNode
}

export function ToggleInput({
  label,
  checked,
  onChange,
  helperText,
}: ToggleInputProps) {
  return (
    <div className="form-control w-full max-w-xs mb-6">
      <label className="label cursor-pointer justify-start gap-4">
        <span className="label-text font-bold">{label}</span>
        <input
          type="checkbox"
          className="toggle toggle-primary"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
      </label>
      {helperText && (
        <label className="label">
          <span className="label-text-alt opacity-60">{helperText}</span>
        </label>
      )}
    </div>
  )
}
