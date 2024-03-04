import Link from 'next/link'
import Description from '~/components/shared/Description'
import Title from '~/components/shared/Title'

export default function PrivacyPolicyUI() {
  return (
    <main className="pb-16 text-justify">
      <Title>Privacy Policy</Title>

      <Description>This Privacy Policy applies to Taskeven.</Description>

      <h2 className="mt-8">Information We Collect</h2>

      <p>We only collect information that is necessary for the operation of our website or app. This may include:</p>

      <ul>
        <li>
          Personal Information: such as name, email address, and other contact details provided by users voluntarily.
        </li>
        <li>
          Non-personal Information: such as browser type, device type, and IP address collected automatically for
          analytical purposes.
        </li>
      </ul>

      <h2 className="mt-8">How We Use Information</h2>

      <p>We may use the collected information for the following purposes:</p>

      <ul>
        <li>To provide and maintain our services.</li>
        <li>To notify you about changes to our services.</li>
        <li>To provide customer support.</li>
        <li>To gather analysis or valuable information so that we can improve our services.</li>
        <li>To monitor the usage of our services.</li>
        <li>To detect, prevent and address technical issues.</li>
      </ul>

      <h2 className="mt-8">Security</h2>

      <p>
        We value your trust in providing us with your personal information, thus we are striving to use commercially
        acceptable means of protecting it. But remember that no method of transmission over the internet, or method of
        electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
      </p>

      <h2 className="mt-8">Links to Other Sites</h2>

      <p>
        Our services may contain links to other sites. If you click on a third-party link, you will be directed to that
        site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the
        Privacy Policy of these websites. We have no control over, and assume no responsibility for the content, privacy
        policies, or practices of any third-party sites or services.
      </p>

      <h2 className="mt-8">Changes to This Privacy Policy</h2>

      <p>
        We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for any
        changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are
        effective immediately after they are posted on this page.
      </p>

      <h2 className="mt-8">Contact Us</h2>

      <p>
        If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at{' '}
        <Link href="/contact" className="underline">
          contact page
        </Link>
        .
      </p>
    </main>
  )
}
