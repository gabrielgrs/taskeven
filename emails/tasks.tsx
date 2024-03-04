import { Link, Section, Text, Row, Column, Container } from '@react-email/components'
import Wrapper, { WrapperProps } from './wrapper'

type List = {
  slug: string
  name: string
  tasks: string[]
}

type Props = Pick<WrapperProps, 'baseUrl'> & {
  lists: List[]
}

export default function TasksEmail({ baseUrl, lists }: Props) {
  return (
    <Wrapper
      baseUrl={baseUrl}
      preview="Your today Taskeven tasks"
      title={
        <>
          List of <strong>Taskeven</strong> tasks
        </>
      }
    >
      <Section>
        {lists.map((list) => (
          <Link
            href={`${baseUrl}/app/${list.slug}`}
            target="_blank"
            key={`${list.slug}_${list.name}`}
            className="text-black"
          >
            <Container className="bg-orange-100 my-2 rounded px-4">
              <Text className="text-base font-semibold underline">{list.name}</Text>
              <Row>
                {list.tasks.map((task, index) => (
                  <Column key={`${list.slug}_${list.name}_${task}_${index}`}>
                    <Text className="text-sm">{task}</Text>
                  </Column>
                ))}
              </Row>
            </Container>
          </Link>
        ))}
      </Section>
      <Section>{/* <code className="text-lg bg-black text-white px-2 py-2 rounded">123456</code> */}</Section>
    </Wrapper>
  )
}

TasksEmail.PreviewProps = {
  baseUrl: 'http://localhost:3000',
  lists: [
    {
      name: 'Tasks Mock',
      slug: 'tasks',
      tasks: ['Task 1', 'Task 2', 'Task 3'],
    },
    {
      name: 'Tasks Test',
      slug: 'tasks-aabc',
      tasks: ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5', 'Task 6', 'Task 7', 'Task 8', 'Task 9', 'Task 10'],
    },
  ],
} as Props
