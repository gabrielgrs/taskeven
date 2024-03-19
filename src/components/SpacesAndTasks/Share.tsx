import { useState } from 'react'
import copy from 'clipboard-copy'
import { Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { generateShareLink } from '~/actions/space'
import Column from '../shared/Column'
import Grid from '../shared/Grid'
import { Button } from '../ui/button'
import { Drawer, DrawerContent } from '../ui/drawer'
import { Label } from '../ui/label'

export default function Share({ spaceId }: { spaceId: string }) {
  const [shareLink, setShareLink] = useState('')

  const onPressToShare = async () => {
    try {
      const shareToken = await generateShareLink(spaceId)
      setShareLink(`${window.location.origin}/invite?inviteToken=${shareToken}`)
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
      toast.error('Something went wrong')
    }
  }

  return (
    <Drawer open={Boolean(shareLink)} onOpenChange={(state) => state === false && setShareLink('')}>
      <Button size="icon" variant="ghost" onClick={() => onPressToShare()}>
        <Share2 size={20} className="text-muted-foreground" />
      </Button>
      <DrawerContent>
        <Grid className="mx-auto max-w-lg pt-8 relative">
          <Column size={12}>
            <h1 className="text-center">Share</h1>
          </Column>
          <Column size={12}>
            <Label>Share link</Label>
          </Column>
          <Column size={12}>
            <span className="break-all">{shareLink}</span>
          </Column>
          <Column size={12} className="flex justify-end">
            <Button variant="secondary" onClick={() => copy(shareLink).then(() => toast.info('Link copied'))}>
              Click to copy
            </Button>
          </Column>
        </Grid>
      </DrawerContent>
    </Drawer>
  )
}
