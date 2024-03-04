'use client'

import { useTheme } from 'next-themes'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronDown, Coins, LogOut, LucideIcon, Moon, Sun, UserCog, Wallet } from 'lucide-react'
import { logout } from '~/actions/auth'
import { Avatar, AvatarImage } from '~/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '~/components/ui/dropdown-menu'
import { Progress, ProgressIndicator } from '~/components/ui/progress'
import { UserSchema } from '~/lib/mongoose'
import { getExpPerLevel, getLevelByExperience } from '~/utils/configurations'

type DropdownItemProps = {
  onClick?: () => void
  href?: string
  text: string
  icon: LucideIcon
}

const dropdownItemStyles = 'cursor-pointer flex items-center gap-2 py-2'

function DropdownItem({ onClick, text, icon: Icon, href }: DropdownItemProps) {
  if (href) {
    return (
      <DropdownMenuItem className={dropdownItemStyles} asChild>
        <Link href={href}>
          <Icon size={20} />
          <span>{text}</span>
        </Link>
      </DropdownMenuItem>
    )
  }

  return (
    <DropdownMenuItem className={dropdownItemStyles} onClick={onClick}>
      <Icon size={20} />
      <span>{text}</span>
    </DropdownMenuItem>
  )
}

export default function UserInfo({ user }: { user: UserSchema }) {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 group">
        <div className="flex flex-col justify-end">
          <div className="text-sm font-medium truncate max-w-[15vw] z-20 relative">{user.name || user.email}</div>
          {user && (
            <Link
              data-red={user.credits <= 30}
              href="/recharge"
              className="flex items-center data-[red=true]:bg-destructive data-[red=true]:text-destructive-foreground bg-secondary text-secondary-foreground rounded-full px-2 py-[1px] text-sm gap-1 w-max"
            >
              <Coins size={12} className="hidden sm:block" />
              <div className="flex items-center">
                {Array.from(user.credits.toString()).map((credit, index) => (
                  <motion.span
                    key={`credit_${credit}_${index}`}
                    initial={{ translateY: '-100%' }}
                    animate={{ translateY: '0%' }}
                    exit={{ translateY: '100%' }}
                    transition={{ duration: 0.5 }}
                  >
                    {credit}
                  </motion.span>
                ))}
              </div>
              <span className="md:block hidden">credits</span>
            </Link>
          )}
        </div>
        <Avatar className="h-7 w-7 sm:block hidden">
          <AvatarImage
            src={user.avatar || 'https://aui.atlassian.com/aui/9.3/docs/images/avatar-person.svg'}
            alt={`${user.email}`}
          />
        </Avatar>
        <ChevronDown className="opacity-30 hidden sm:block group-hover:animate-bounce" size={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[160px]">
        <DropdownMenuLabel className="opacity-60 text-sm font-thin max-w-[130px] truncate">About</DropdownMenuLabel>
        <div className="grid grid-cols-[28px,auto] gap-1 items-center sm:hidden p-1">
          <Avatar className="h-7 w-7">
            <AvatarImage
              src={user.avatar || 'https://aui.atlassian.com/aui/9.3/docs/images/avatar-person.svg'}
              alt={`${user.email}`}
            />
          </Avatar>
          <div className="text-muted-foreground flex flex-col">
            <span className="truncate max-w-[100px] text-sm">{user.name}</span>
            <span className="truncate max-w-[100px] text-xs">{user.email}</span>
          </div>
        </div>
        <div className="px-2">
          <span className="text-sm font-mono">Level {getLevelByExperience(user.experience)}</span>
          <Progress aria-label="User experience progressbar">
            <ProgressIndicator
              value={(100 * user.experience) / getExpPerLevel()[getLevelByExperience(user.experience)]}
              className="bg-secondary"
            />
          </Progress>
          <p className="text-xs opacity-60 text-right self-end">
            <span>{user.experience}</span>
            {'/'}
            <span>{getExpPerLevel()[getLevelByExperience(user.experience)]}</span>
          </p>
        </div>
        <DropdownMenuLabel className="opacity-60 text-sm font-thin max-w-[130px] truncate">Account</DropdownMenuLabel>
        <DropdownItem href="/recharge" icon={Wallet} text="Recharge" />{' '}
        <DropdownItem href="/settings" icon={UserCog} text="Settings" />
        <DropdownItem
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          icon={theme === 'dark' ? Sun : Moon}
          text={theme === 'dark' ? 'Light theme' : 'Dark theme'}
        />
        <DropdownMenuSeparator />
        <form action={() => logout().then(() => (window.location.href = '/'))}>
          <DropdownMenuItem className={dropdownItemStyles} asChild>
            <button type="submit" className="w-full">
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
