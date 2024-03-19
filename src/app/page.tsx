import HomeUI from '~/components/Home'
import Navbar from '~/components/shared/Navbar'

export default async function Home() {
  return (
    <>
      <Navbar />
      <HomeUI />
    </>
  )
}
