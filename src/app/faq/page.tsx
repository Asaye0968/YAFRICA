import { Metadata } from 'next'
import Link from 'next/link'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions - Yafrican',
  description: 'Find answers to common questions about shopping, shipping, returns, and more.',
}

const faqCategories = [
  {
    name: 'Ordering & Payment',
    questions: [
      {
        question: 'How do I place an order?',
        answer: 'To place an order, simply browse our products, add items to your cart, and proceed to checkout. You will need to create an account or checkout as a guest.',
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept credit/debit cards (Visa, MasterCard), mobile banking, and cash on delivery in select areas.',
      },
      {
        question: 'Can I modify or cancel my order?',
        answer: 'You can modify or cancel your order within 1 hour of placement. After that, please contact customer support immediately.',
      },
    ],
  },
  {
    name: 'Shipping & Delivery',
    questions: [
      {
        question: 'How long does shipping take?',
        answer: 'Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days. Delivery times may vary based on your location.',
      },
      {
        question: 'Do you offer international shipping?',
        answer: 'Currently, we only ship within Ethiopia. We plan to expand to international shipping soon.',
      },
      {
        question: 'How can I track my order?',
        answer: 'Once your order ships, you will receive a tracking number via email. You can also track your order from your account dashboard.',
      },
    ],
  },
  {
    name: 'Returns & Refunds',
    questions: [
      {
        question: 'What is your return policy?',
        answer: 'We offer a 30-day return policy for most items. Items must be in original condition with tags attached. Some items may have different return policies.',
      },
      {
        question: 'How long do refunds take?',
        answer: 'Refunds are processed within 5-7 business days after we receive your return. The time it takes for the refund to appear in your account depends on your payment method.',
      },
      {
        question: 'Who pays for return shipping?',
        answer: 'We cover return shipping for defective or wrong items. For change of mind returns, customers are responsible for return shipping costs.',
      },
    ],
  },
  {
    name: 'Account & Security',
    questions: [
      {
        question: 'How do I reset my password?',
        answer: 'Click on "Forgot Password" on the login page and enter your email address. You will receive instructions to reset your password.',
      },
      {
        question: 'Is my personal information secure?',
        answer: 'Yes, we use industry-standard encryption and security measures to protect your personal and payment information.',
      },
      {
        question: 'Can I have multiple addresses saved?',
        answer: 'Yes, you can save multiple shipping addresses in your account and select your preferred address during checkout.',
      },
    ],
  },
]

export default function FAQ() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Find quick answers to common questions about shopping with Yafrican.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search questions..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <section key={categoryIndex} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-yellow-500 px-6 py-4">
                <h2 className="text-xl font-bold text-white">{category.name}</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {category.questions.map((faq, faqIndex) => (
                    <div key={faqIndex} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                      <h3 className="font-semibold text-gray-900 mb-3 text-lg">{faq.question}</h3>
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Contact Support */}
        <section className="mt-12 text-center bg-yellow-50 rounded-lg p-8 border border-yellow-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our customer support team is here to help you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="/shipping"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Shipping Info
            </Link>
            <Link
              href="/returns"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Returns & Refunds
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}