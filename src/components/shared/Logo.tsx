import Image from 'next/image'
import Link from 'next/link'

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-1 relative md:min-w-max min-w-[40px]">
      <Image src="/icons/logo.png" width={40} height={40} alt="Logo" className="rounded-lg" priority />
      <span className="text-lg hidden md:block font-medium">Taskeven.</span>
      <span className="text-xs absolute bg-black text-neutral-400 -bottom-3 font-mono rounded-b-lg py-[2px] w-[40px] text-center">
        Beta
      </span>
    </Link>
  )
}
