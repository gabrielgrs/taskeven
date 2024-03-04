'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { updateUser } from '~/actions/auth'
import Column from '~/components/shared/Column'
import Fieldset from '~/components/shared/Fieldset'
import Grid from '~/components/shared/Grid'
import Title from '~/components/shared/Title'
import { Button, buttonVariants } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { UserSchema } from '~/lib/mongoose'
import useAuth from '~/utils/hooks/useAuth'
import AvatarUpload from './AvatarUpload'

export default function SettingsUI({ defaultValues }: { defaultValues: Partial<UserSchema> }) {
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const { register, handleSubmit, formState } = useForm({ mode: 'all', defaultValues })
  const { push } = useRouter()
  const { onUpdateUser, user } = useAuth()

  const onSubmit = async ({ name }: Partial<UserSchema>) => {
    try {
      await updateUser({ name })
      toast.success('Profile updated')
      onUpdateUser({ name })
      return push('/app')
    } catch {
      toast.error('Something went wrong')
    }
  }

  const onUploadFile = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      setUploadingAvatar(true)

      const response = await fetch(`${window.location.origin}/api/avatar/upload`, {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) throw Error('Failed to process your request')

      const data = await response.json()
      onUpdateUser({ avatar: data.url })

      toast.success('Avatar updated')
    } catch {
      toast.error('Something went wrong')
    } finally {
      setUploadingAvatar(false)
    }
  }

  return (
    <main>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid>
          <Column size={12}>
            <Title>Settings</Title>
          </Column>
          <Column size={12}>
            <Fieldset label="Name" error={formState.errors.name?.message}>
              <Input {...register('name', { required: true })} placeholder="Type your name" contrasted />
            </Fieldset>
          </Column>

          <Column size={12}>
            <Fieldset label="Profile picture" error={formState.errors.avatar?.message}>
              <AvatarUpload loading={uploadingAvatar} value={user?.avatar} onChange={(file) => onUploadFile(file)} />
            </Fieldset>
          </Column>

          <Column size={12} className="flex items-center justify-self-end gap-2">
            <Link href="/app" type="button" className={buttonVariants({ variant: 'ghost' })}>
              Cancel
            </Link>
            <Button disabled={formState.isSubmitting || uploadingAvatar}>
              {formState.isSubmitting && <Loader2 className="animate-spin" />}
              Submit
            </Button>
          </Column>
        </Grid>
      </form>
    </main>
  )
}
