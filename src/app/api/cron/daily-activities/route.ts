// // import { NextRequest } from 'next/server'
// import { NextRequest } from 'next/server'
// import { endOfDay, isToday, startOfDay } from 'date-fns'
// import schemas, { ListSchema, UserSchema } from '~/lib/mongoose'
// import { sendEmail } from '~/lib/resend'
// import { isProductionBuild } from '~/utils/env'
// import TasksEmail from '../../../../../emails/tasks'

// export async function GET(request: NextRequest) {
//   const today = startOfDay(new Date())
//   const endOfToday = endOfDay(today)

//   const lists = (await schemas.list
//     .find({ 'tasks.reminderDate': { $gte: today, $lt: endOfToday } })
//     .populate('createdBy')
//     .populate('members.user')) as (ListSchema & { createdBy: UserSchema })[] // TODO: fix typescript

//   type List = { slug: string; name: string; tasks: string[] }
//   type Mailing = Record<string, List[]>

//   const filtred = lists.reduce((acc: Mailing, curr) => {
//     const membersEmails = curr.members.filter((x) => x.accepted).map((x) => x.user.email)
//     const emails = [...membersEmails, curr.createdBy.email]

//     const tasks = curr.tasks.filter((x) => x.reminderDate && isToday(new Date(x.reminderDate))).map((x) => x.title)

//     emails.forEach((email) => {
//       if (acc[email]) acc[email].push({ slug: curr.slug, name: curr.name, tasks })
//       else acc[email] = [{ slug: curr.slug, name: curr.name, tasks }]
//     })

//     return acc
//   }, {})

//   const protocol = isProductionBuild ? 'https' : 'http'
//   const baseUrl = `${protocol}://${request.headers.get('host')}`

//   await Promise.all(
//     Object.entries(filtred).map(([email, data]) =>
//       sendEmail(email, 'Your daily tasks', TasksEmail({ baseUrl, lists: data })),
//     ),
//   )

//   return Response.json({ message: 'Success' })
// }
