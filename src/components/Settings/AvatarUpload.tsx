import Image from 'next/image'
import { Loader2, Upload } from 'lucide-react'

type Props = {
  loading: Boolean
  value?: string
  onChange: (file: File) => void
}

export default function AvatarUpload({ loading, value, onChange }: Props) {
  return (
    <div className="relative w-20 h-20 group">
      {value && (
        <Image
          src={value}
          height={80}
          width={80}
          alt="User profile picture"
          className="rounded-full group-hover:opacity-0"
        />
      )}
      <div
        data-loading={loading}
        className="opacity-0 bg-foreground/10 data-[loading=true]:opacity-100 group-hover:opacity-100 duration-500 absolute w-20 h-20 top-0 left-0 bg-card rounded-full flex items-center justify-center"
      >
        {loading ? <Loader2 size={40} className="animate-spin" /> : <Upload size={24} />}
      </div>
      <input
        type="file"
        className="absolute cursor-pointer z-20 top-0 left-0 opacity-0 w-20 h-20"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) {
            return onChange(file)
          }
        }}
      />
    </div>
  )
}
