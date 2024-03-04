import Link from 'next/link'
import Description from '~/components/shared/Description'
import Title from '~/components/shared/Title'

export default function TermsOfServiceUI() {
  return (
    <main className="pb-16 text-justify">
      <Title>Terms of Service</Title>

      <Description>These terms and conditions outline the rules and regulations for the use of Taskeven.</Description>

      <h2 className="mt-8">1. Agreement to Terms</h2>

      <p>
        By accessing or using our website or app, you agree to be bound by these Terms of Service. If you disagree with
        any part of these terms, then you may not access the website or use the app.
      </p>

      <h2 className="mt-8">2. Use License</h2>

      <p>
        Permission is granted to temporarily download one copy of the materials (information or software) on Taskeven
        website or app for personal, non-commercial transitory viewing only.
      </p>

      <h2 className="mt-8">3. User Accounts</h2>

      <p>
        To access certain features of the website or app, you may be required to create an account. You are responsible
        for maintaining the confidentiality of your account and password and for restricting access to your computer,
        and you agree to accept responsibility for all activities that occur under your account or password.
      </p>

      <h2 className="mt-8">4. Limitations</h2>

      <p>
        In no event shall Taskeven or its suppliers be liable for any damages (including, without limitation, damages
        for loss of data or profit, or due to business interruption) arising out of the use or inability to use the
        materials on Taskeven website or app.
      </p>

      <h2 className="mt-8">5. Governing Law</h2>

      <p>
        These Terms shall be governed and construed in accordance with the laws of Brazil, without regard to its
        conflict of law provisions.
      </p>

      <h2 className="mt-8">6. Changes</h2>

      <p>
        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to
        access or use our website or app after those revisions become effective, you agree to be bound by the revised
        terms. If you do not agree to the new terms, please stop using the website or app.
      </p>

      <h2 className="mt-8">7. Contact Us</h2>

      <p>
        If you have any questions about these Terms, please contact us at{' '}
        <Link href="/contact" className="underline">
          contact page
        </Link>
        .
      </p>
    </main>
  )
}
