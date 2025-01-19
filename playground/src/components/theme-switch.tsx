import { Button } from '@heroui/react'
import { useLocalStorage } from 'foxact/use-local-storage'

const themes = ['light', 'dark'] as const

export function ThemeSwitch() {
  const [currentColor, setCurrentColor] = useLocalStorage<
    (typeof themes)[number]
  >('currentColor', 'light')

  return (
    <div className="space-y-4">
      <p>Theme</p>
      <div className="grid grid-cols-6 gap-2">
        {themes.map(theme => (
          <Button
            key={theme}
            onPress={() => {
              document.body.classList.remove(`${currentColor}`)
              document.body.classList.add(`${theme}`)
              setCurrentColor(theme)
            }}
            color="default"

          >
            {theme}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <Button color="default">Default</Button>
        <Button color="primary">Primary</Button>
        <Button color="secondary">Secondary</Button>
        <Button color="success">Success</Button>
        <Button color="warning">Warning</Button>
        <Button color="danger">Danger</Button>
      </div>
    </div>
  )
}
