import React from 'react'
import { Shield, Lock, Eye, Users, FileText, Mail } from 'lucide-react'

const Privacy = () => {
  const sections = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: FileText,
      content: [
        'Personal Information: Name, email address, phone number, and other contact details you provide when creating an account.',
        'Financial Data: Transaction details, account balances, budget information, and financial goals you input into our platform.',
        'Usage Data: Information about how you use our service, including pages visited, features used, and time spent on the platform.',
        'Device Information: Device type, operating system, browser type, and IP address for security and optimization purposes.'
      ]
    },
    {
      id: 'information-use',
      title: 'How We Use Your Information',
      icon: Users,
      content: [
        'Provide and maintain our financial management services',
        'Process transactions and generate financial reports and insights',
        'Send important notifications about your account and financial activities',
        'Improve our services through analytics and user feedback',
        'Ensure security and prevent fraudulent activities',
        'Comply with legal obligations and regulatory requirements'
      ]
    },
    {
      id: 'information-sharing',
      title: 'Information Sharing',
      icon: Shield,
      content: [
        'We do not sell, trade, or rent your personal information to third parties.',
        'We may share aggregated, anonymized data for research and improvement purposes.',
        'We may disclose information when required by law or to protect our rights and safety.',
        'Service providers who assist us in operating our platform may have access to certain data under strict confidentiality agreements.',
        'In case of a business transfer, your information may be transferred as part of the assets.'
      ]
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: Lock,
      content: [
        'We use industry-standard encryption (AES-256) to protect your data in transit and at rest.',
        'Our servers are hosted in secure, SOC 2 compliant data centers.',
        'We implement multi-factor authentication and regular security audits.',
        'Access to your data is restricted to authorized personnel only.',
        'We regularly update our security measures to address emerging threats.',
        'All financial data is encrypted using bank-level security protocols.'
      ]
    },
    {
      id: 'your-rights',
      title: 'Your Rights',
      icon: Eye,
      content: [
        'Access: You can request a copy of all personal data we hold about you.',
        'Correction: You can update or correct your personal information at any time.',
        'Deletion: You can request deletion of your account and associated data.',
        'Portability: You can export your data in a machine-readable format.',
        'Opt-out: You can unsubscribe from marketing communications at any time.',
        'Complaint: You can file a complaint with relevant data protection authorities.'
      ]
    },
    {
      id: 'cookies',
      title: 'Cookies and Tracking',
      icon: FileText,
      content: [
        'We use essential cookies to provide core functionality of our service.',
        'Analytics cookies help us understand how users interact with our platform.',
        'You can control cookie preferences through your browser settings.',
        'We do not use cookies for advertising or tracking across other websites.',
        'Session cookies are automatically deleted when you close your browser.',
        'Persistent cookies are used to remember your preferences and login status.'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-gray-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-4 mb-6">
            <Shield size={40} />
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-xl opacity-90 max-w-3xl">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <div className="mt-6 text-sm opacity-80">
            <p>Last updated: August 1, 2025</p>
            <p>Effective date: August 1, 2025</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Introduction */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-600 mb-4">
              SaveWise ("we," "our," or "us") is committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our personal finance 
              management platform.
            </p>
            <p className="text-gray-600 mb-4">
              By using SaveWise, you agree to the collection and use of information in accordance with this policy. 
              If you do not agree with our policies and practices, please do not use our service.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-blue-800 font-medium">
                <Shield className="inline mr-2" size={16} />
                We are committed to transparency and will notify you of any changes to this policy.
              </p>
            </div>
          </div>
        </div>

        {/* Main Sections */}
        <div className="max-w-4xl mx-auto space-y-8">
          {sections.map((section, index) => (
            <div key={section.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
                <div className="flex items-center space-x-3">
                  <section.icon size={24} />
                  <h2 className="text-xl font-bold">{section.title}</h2>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-600">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Data Retention */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Data</h3>
                <p className="text-gray-600">
                  We retain your account information for as long as your account is active or as needed to provide services.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Financial Data</h3>
                <p className="text-gray-600">
                  Transaction and financial data is retained for 7 years for tax and regulatory compliance purposes.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Usage Data</h3>
                <p className="text-gray-600">
                  Analytics and usage data is typically retained for 2 years for service improvement purposes.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Deleted Accounts</h3>
                <p className="text-gray-600">
                  When you delete your account, most data is removed within 30 days, except where required by law.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* International Transfers */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">International Data Transfers</h2>
            <p className="text-gray-600 mb-4">
              Your information may be transferred to and processed in countries other than your own. We ensure that such transfers 
              comply with applicable data protection laws and implement appropriate safeguards.
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <p className="text-yellow-800">
                <FileText className="inline mr-2" size={16} />
                We use Standard Contractual Clauses approved by the European Commission for transfers outside the EEA.
              </p>
            </div>
          </div>
        </div>

        {/* Children's Privacy */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
            <p className="text-gray-600 mb-4">
              Our service is not intended for children under 18 years of age. We do not knowingly collect personal information 
              from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, 
              please contact us.
            </p>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-800 font-medium">
                If we discover we have collected information from a child under 18, we will delete it immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="mb-6 opacity-90">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Email</h3>
                <a href="mailto:privacy@savewise.com" className="flex items-center space-x-2 hover:underline">
                  <Mail size={16} />
                  <span>privacy@savewise.com</span>
                </a>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Data Protection Officer</h3>
                <a href="mailto:dpo@savewise.com" className="flex items-center space-x-2 hover:underline">
                  <Mail size={16} />
                  <span>dpo@savewise.com</span>
                </a>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Mailing Address</h3>
                <p className="text-sm opacity-90">
                  SaveWise Technologies Pvt. Ltd.<br />
                  123 Tech Park, Bangalore<br />
                  Karnataka 560001, India
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Response Time</h3>
                <p className="text-sm opacity-90">
                  We will respond to your privacy-related inquiries within 30 days of receipt.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Updates */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Policy Updates</h2>
            <p className="text-gray-600 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
              Privacy Policy on this page and updating the "Last updated" date.
            </p>
            <p className="text-gray-600">
              For significant changes, we will provide more prominent notice, including email notification to registered users.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Privacy
