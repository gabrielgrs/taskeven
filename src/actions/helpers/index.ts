export const parseObject = <T>(data: T) => JSON.parse(JSON.stringify(data)) as T

export const isOwnerOrMemberWithEditPermission = (userId: string) => {
  return {
    $or: [
      {
        'members.user': userId,
        'members.permission': 'EDIT',
      },
      { createdBy: userId },
    ],
  }
}
