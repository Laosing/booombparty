import { useEffect, useState } from "react"
import { generateAvatar } from "../utils/avatar"

export const Logo = ({ name, random }: { name?: string; random?: boolean }) => {
  const [randomName, setRandomName] = useState<string | null>(null)

  useEffect(() => {
    if (random && !name) {
      const randomString = Math.random().toString(36).substring(2, 6)
      setRandomName(randomString)
    }
  }, [random, name])

  const displayName = name || randomName

  return (
    <div className="flex items-center justify-center gap-4">
      {displayName ? <CustomAvatar name={displayName} /> : <LogoIcon />}
      <h1 className="text-4xl font-bold text-primary">booombparty</h1>
    </div>
  )
}

export const LogoIcon = ({
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) => {
  return <img src="/favicon.svg" alt="Logo" width="48" height="48" {...props} />
}

export const CustomAvatar = ({
  name,
  ...props
}: {
  name: string
} & React.ImgHTMLAttributes<HTMLImageElement>) => {
  return (
    <img
      src={`data:image/svg+xml;base64,${btoa(generateAvatar(name))}`}
      alt="Avatar"
      width="48"
      height="48"
      {...props}
    />
  )
}
