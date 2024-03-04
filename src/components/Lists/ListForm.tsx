import { ReactNode, useState } from 'react'
import { useForm } from 'react-hook-form'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { Loader2 } from 'lucide-react'
import { useListsContext } from '~/components/providers/List'
import Column from '~/components/shared/Column'
import Fieldset from '~/components/shared/Fieldset'
import Grid from '~/components/shared/Grid'
import Title from '~/components/shared/Title'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { ListSchema } from '~/lib/mongoose'
import { cn } from '~/utils/shadcn'
import { maxLenth, minLength, requiredField } from '~/utils/validation'

export type Props = {
  children: ReactNode
  initialValues?: Partial<ListSchema>
}

type DefaultValues = {
  _id?: string
  name: string
}

const getDefaultValues = (initialValues: Partial<ListSchema> = {}): DefaultValues => {
  const defaultValues = { _id: undefined, name: '' }
  return { ...defaultValues, ...initialValues }
}

export default function ListForm({ children, initialValues }: Props) {
  const [toRemove, setToDelete] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const isEdition = Boolean(initialValues?._id)
  const { register, handleSubmit, formState, getValues } = useForm({
    defaultValues: getDefaultValues(initialValues),
  })

  const { onAddList, onRemoveList, onUpdateList } = useListsContext()

  const onSubmit = async ({ _id, ...values }: DefaultValues) => {
    if (_id) {
      await onUpdateList(_id, values)
    } else {
      await onAddList(values.name)
    }
  }

  const onDelete = async (listId: string) => {
    try {
      setIsRemoving(true)
      await onRemoveList(listId)
    } finally {
      setIsRemoving(false)
      setToDelete(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <main>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid>
              <Column size={12}>
                <Title className="text-2xl">{initialValues?._id ? 'Edit' : 'Create'} list</Title>
              </Column>
              <Column size={12}>
                <Fieldset label="List name" className="Name" error={formState.errors.name?.message}>
                  <Input
                    {...register('name', { required: requiredField, minLength: minLength(2), maxLength: maxLenth(40) })}
                    placeholder="Type your list name"
                  />
                </Fieldset>
              </Column>

              <Column size={12} className={cn('flex items-center gap-2 justify-end', isEdition && 'justify-between')}>
                {isEdition && (
                  <div className="flex items-center gap-2">
                    {toRemove ? (
                      <>
                        <Button type="button" variant="ghost" disabled={isRemoving} onClick={() => setToDelete(false)}>
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          disabled={isRemoving}
                          onClick={() => onDelete(getValues('_id')!)}
                        >
                          {isRemoving && <Loader2 className="animate-spin" />}
                          Confirm delete
                        </Button>
                      </>
                    ) : (
                      <Button
                        type="button"
                        variant="destructive"
                        disabled={formState.isSubmitting || isRemoving}
                        onClick={() => setToDelete(true)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                )}
                {!toRemove && (
                  <div className="flex items-center gap-2">
                    <Button disabled={formState.isSubmitting || isRemoving}>
                      {formState.isSubmitting && <Loader2 className="animate-spin" />}
                      Submit
                    </Button>
                  </div>
                )}
              </Column>
            </Grid>
          </form>
        </main>
      </DialogContent>
    </Dialog>
  )
}
