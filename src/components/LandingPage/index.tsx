import Footer from '~/components/shared/Footer'
import Navbar from '~/components/shared/Navbar'
import About from './About'
import Main from './Main'
import Pricing from './Pricing'

export default function LandingPageUI() {
  return (
    <>
      <Navbar isPublic />
      <main className="px-4 mx-auto max-w-5xl">
        <section className="flex flex-col justify-center items-center min-h-[calc(100vh-100px)] bg-background relative">
          <Main />
        </section>

        <section id="about" className="pt-40">
          <About />
        </section>

        <section id="pricing" className="py-40">
          <Pricing />
        </section>

        <Footer />
      </main>
    </>
  )
}
