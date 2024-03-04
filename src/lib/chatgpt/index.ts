'use server'

// import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function requestCompletion(message: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: false,
    messages: [
      {
        role: 'assistant',
        content: `You are a conversational assistant bot for a task ​​management system.
                  This system consists of a set of lists and tasks.
                  A list can contain title, members and tasks. A member is a user of the system. Tasks have a title, status of whether they are complete or not, notes and a date to remember.
                  Always return just the main response:`,
      },
      {
        role: 'user',
        content: message,
      },
    ],
  })

  return response.choices[0].message.content
}
