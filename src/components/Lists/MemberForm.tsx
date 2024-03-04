import { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { PopoverTrigger } from '@radix-ui/react-popover'
import { Loader2, Share2 } from 'lucide-react'
import Column from '~/components/shared/Column'
import Grid from '~/components/shared/Grid'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Popover, PopoverContent } from '~/components/ui/popover'
import { Switch } from '~/components/ui/switch'
import { MemberSchema } from '~/lib/mongoose'
import { Permission } from '~/types/shared'
import { emailPattern, requiredField } from '~/utils/validation'

type DefaultValues = {
  email: string
  permission: Permission
}

const defaultValues = {
  email: '',
  permission: 'VIEW' as Permission,
}

type Props = {
  children: ReactNode
  members: MemberSchema[]
  onAddMember: (email: string, permission: Permission) => void
  onChangeMemberPermission: (memberId: string, permission: Permission) => void
}

export default function MemberForm({ children, members, onAddMember, onChangeMemberPermission }: Props) {
  const { register, formState, handleSubmit } = useForm<DefaultValues>({
    mode: 'all',
    defaultValues,
  })

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent>
        <form onSubmit={handleSubmit((values) => onAddMember(values.email, values.permission))}>
          <Grid>
            <Column size={12}>Members</Column>
            <Column size={12} className="flex justify-between items-center gap-2">
              <Input
                {...register('email', { required: requiredField, pattern: emailPattern })}
                className="w-full"
                placeholder="Email to share link"
                size="sm"
              />
              <Button disabled={formState.isSubmitting} variant="ghost" size="icon">
                {formState.isSubmitting ? (
                  <Loader2 className="animate-spin opacity-60" size={16} />
                ) : (
                  <Share2 size={16} className="opacity-60" />
                )}
              </Button>
            </Column>

            {members.length > 0 && (
              <>
                <Column size={12}>
                  <hr className="opacity-30" />
                </Column>
                <Column size={12}>
                  <Label className="opacity-60 text-sm">Current members</Label>
                </Column>
              </>
            )}
            <Column size={12}>
              <div className="flex flex-col gap-4">
                {members.map((member) => (
                  <div key={member._id} className="flex justify-between items-center w-full gap-2">
                    <span className="opacity-70 truncate text-sm">{member.user.email}</span>{' '}
                    <div className="flex gap-1 items-center">
                      <span className="opacity-70 text-sm">View</span>
                      <Switch
                        checked={member.permission === 'EDIT'}
                        onCheckedChange={(e) => onChangeMemberPermission(member.user._id, e ? 'EDIT' : 'VIEW')}
                      />
                      <span className="opacity-70 text-sm">Edit</span>
                    </div>
                  </div>
                ))}
              </div>
            </Column>
          </Grid>
        </form>
      </PopoverContent>
    </Popover>
  )
}
