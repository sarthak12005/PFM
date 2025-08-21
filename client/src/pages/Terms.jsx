import React from 'react'
import { FileText, Scale, Shield, AlertTriangle, CheckCircle, Mail } from 'lucide-react'

const Terms = () => {
  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: CheckCircle,
      content: [
        'By accessing and using SaveWise, you accept and agree to be bound by these Terms of Service.',
        'If you do not agree to these terms, you may not access or use our service.',
        'These terms apply to all visitors, users, and others who access or use the service.',
        'We reserve the right to update these terms at any time without prior notice.'
      ]
    },
    {
      id: 'description',
      title: 'Description of Service',
      icon: FileText,
      content: [
        'SaveWise is a personal finance management platform that helps users track expenses, manage budgets, and achieve financial goals.',
        'The service includes features such as transaction tracking, budget planning, financial reporting, and goal setting.',
        'We provide the platform "as is" and make no warranties about the availability, reliability, or accuracy of the service.',
        'The service may be modified, updated, or discontinued at any time without notice.'
      ]
    },
    {
      id: 'user-accounts',
      title: 'User Accounts',
      icon: Shield,
      content: [
        'You must create an account to use certain features of our service.',
        'You are responsible for maintaining the confidentiality of your account credentials.',
        'You agree to provide accurate, current, and complete information during registration.',
        'You are responsible for all activities that occur under your account.',
        'You must notify us immediately of any unauthorized use of your account.',
        'We reserve the right to suspend or terminate accounts that violate these terms.'
      ]
    },
    {
      id: 'acceptable-use',
      title: 'Acceptable Use',
      icon: Scale,
      content: [
        'You may use our service only for lawful purposes and in accordance with these terms.',
        'You agree not to use the service to transmit any harmful, illegal, or offensive content.',
        'You may not attempt to gain unauthorized access to our systems or other users\' accounts.',
        'You may not use automated systems to access the service without our written permission.',
        'You may not reverse engineer, decompile, or disassemble any part of the service.',
        'Commercial use of the service requires our prior written consent.'
      ]
    },
    {
      id: 'financial-data',
      title: 'Financial Data and Privacy',
      icon: Shield,
      content: [
        'You retain ownership of all financial data you input into our service.',
        'We will protect your financial data in accordance with our Privacy Policy.',
        'You are responsible for the accuracy of the financial information you provide.',
        'We do not provide financial advice and our service is for informational purposes only.',
        'You should consult with qualified financial professionals for investment decisions.',
        'We are not responsible for any financial losses resulting from use of our service.'
      ]
    },
    {
      id: 'limitations',
      title: 'Limitations of Liability',
      icon: AlertTriangle,
      content: [
        'Our service is provided "as is" without warranties of any kind, express or implied.',
        'We do not warrant that the service will be uninterrupted, error-free, or secure.',
        'We are not liable for any indirect, incidental, special, or consequential damages.',
        'Our total liability to you for any claims shall not exceed the amount you paid us in the past 12 months.',
        'Some jurisdictions do not allow limitation of liability, so these limitations may not apply to you.',
        'You agree to indemnify us against any claims arising from your use of the service.'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-700 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-4 mb-6">
            <Scale size={40} />
            <h1 className="text-4xl font-bold">Terms of Service</h1>
          </div>
          <p className="text-xl opacity-90 max-w-3xl">
            Please read these terms carefully before using SaveWise. By using our service, you agree to these terms.
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
              These Terms of Service ("Terms") govern your use of the SaveWise personal finance management platform 
              operated by SaveWise Technologies Pvt. Ltd. ("SaveWise," "we," "us," or "our").
            </p>
            <p className="text-gray-600 mb-4">
              These Terms constitute a legally binding agreement between you and SaveWise. Please read them carefully 
              as they contain important information about your rights and obligations.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-blue-800 font-medium">
                <AlertTriangle className="inline mr-2" size={16} />
                By using SaveWise, you acknowledge that you have read, understood, and agree to be bound by these Terms.
              </p>
            </div>
          </div>
        </div>

        {/* Main Sections */}
        <div className="max-w-4xl mx-auto space-y-8">
          {sections.map((section, index) => (
            <div key={section.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-gray-600 to-blue-600 text-white p-6">
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

        {/* Payment Terms */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Terms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Free Tier</h3>
                <p className="text-gray-600">
                  Basic features are available free of charge with certain limitations on usage and features.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Subscriptions</h3>
                <p className="text-gray-600">
                  Premium features require a paid subscription. Billing is monthly or annually as selected.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Refunds</h3>
                <p className="text-gray-600">
                  Refunds are available within 30 days of purchase for annual subscriptions, subject to our refund policy.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Price Changes</h3>
                <p className="text-gray-600">
                  We reserve the right to change subscription prices with 30 days advance notice to existing subscribers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Intellectual Property */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Rights</h3>
                <p className="text-gray-600">
                  The SaveWise service, including its design, functionality, and content, is owned by SaveWise and protected 
                  by copyright, trademark, and other intellectual property laws.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Rights</h3>
                <p className="text-gray-600">
                  You retain ownership of all content and data you submit to our service. You grant us a license to use 
                  this content solely to provide our services to you.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Restrictions</h3>
                <p className="text-gray-600">
                  You may not copy, modify, distribute, sell, or lease any part of our service without our written permission.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Termination */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">By You</h3>
                <p className="text-gray-600 mb-2">
                  You may terminate your account at any time by contacting us or using the account deletion feature.
                </p>
                <p className="text-gray-600">
                  Upon termination, your access to the service will cease immediately.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">By Us</h3>
                <p className="text-gray-600 mb-2">
                  We may terminate or suspend your account if you violate these terms or for any other reason.
                </p>
                <p className="text-gray-600">
                  We will provide reasonable notice unless immediate termination is required.
                </p>
              </div>
            </div>
            <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <p className="text-yellow-800">
                <AlertTriangle className="inline mr-2" size={16} />
                Upon termination, you may lose access to your data. Please export any important data before terminating your account.
              </p>
            </div>
          </div>
        </div>

        {/* Governing Law */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law and Disputes</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Governing Law</h3>
                <p className="text-gray-600">
                  These Terms are governed by the laws of India, without regard to conflict of law principles.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Dispute Resolution</h3>
                <p className="text-gray-600">
                  Any disputes arising from these Terms or your use of the service will be resolved through binding arbitration 
                  in Bangalore, India, in accordance with the Arbitration and Conciliation Act, 2015.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Jurisdiction</h3>
                <p className="text-gray-600">
                  You agree to submit to the exclusive jurisdiction of the courts in Bangalore, India, for any matters 
                  not subject to arbitration.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-gradient-to-r from-gray-600 to-blue-600 text-white rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="mb-6 opacity-90">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Legal Department</h3>
                <a href="mailto:legal@savewise.com" className="flex items-center space-x-2 hover:underline">
                  <Mail size={16} />
                  <span>legal@savewise.com</span>
                </a>
              </div>
              <div>
                <h3 className="font-semibold mb-2">General Inquiries</h3>
                <a href="mailto:support@savewise.com" className="flex items-center space-x-2 hover:underline">
                  <Mail size={16} />
                  <span>support@savewise.com</span>
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
                <h3 className="font-semibold mb-2">Business Hours</h3>
                <p className="text-sm opacity-90">
                  Monday - Friday: 9:00 AM - 6:00 PM IST<br />
                  Saturday: 10:00 AM - 4:00 PM IST<br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Severability */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Miscellaneous</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Severability</h3>
                <p className="text-gray-600">
                  If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Entire Agreement</h3>
                <p className="text-gray-600">
                  These Terms, together with our Privacy Policy, constitute the entire agreement between you and SaveWise.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Waiver</h3>
                <p className="text-gray-600">
                  Our failure to enforce any provision of these Terms does not constitute a waiver of that provision.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Terms
