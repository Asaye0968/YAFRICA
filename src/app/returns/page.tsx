import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowPathIcon, QuestionMarkCircleIcon, ClockIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Returns & Refunds - Yafrican',
  description: 'Our hassle-free return and refund policy. Learn how to return items and get refunds.',
}

const returnSteps = [
  {
    step: 1,
    title: 'Initiate Return',
    description: 'Go to your order history and select the item you want to return.',
    icon: ArrowPathIcon,
  },
  {
    step: 2,
    title: 'Print Label',
    description: 'Print the return label and packing slip provided.',
    icon: ClockIcon,
  },
  {
    step: 3,
    title: 'Pack Items',
    description: 'Pack the items in their original packaging with all tags attached.',
    icon: QuestionMarkCircleIcon,
  },
  {
    step: 4,
    title: 'Drop Off',
    description: 'Drop off your package at any authorized shipping location.',
    icon: ArrowPathIcon,
  },
]

const refundPolicies = [
  {
    category: 'Eligible Items',
    items: [
      'Unworn, unwashed clothing with tags attached',
      'Unused electronics in original packaging',
      'Defective or damaged items',
      'Wrong items received',
    ],
  },
  {
    category: 'Non-Eligible Items',
    items: [
      'Personal care items (opened)',
      'Underwear and swimwear (for hygiene reasons)',
      'Customized or personalized items',
      'Items without original packaging',
    ],
  },
]

export default function ReturnsRefunds() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Returns & Refunds</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We offer a 30-day hassle-free return policy. If you're not satisfied, we'll make it right.
          </p>
        </div>

        {/* Return Process */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How to Return an Item</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {returnSteps.map((step) => (
              <div
                key={step.step}
                className="bg-white rounded-lg shadow-md p-6 text-center border border-gray-200"
              >
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-3">
                  {step.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Return Policies */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Return Policy Details</h2>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid md:grid-cols-2 gap-8">
              {refundPolicies.map((policy) => (
                <div key={policy.category}>
                  <h3 className="font-semibold text-gray-900 mb-4 text-lg">{policy.category}</h3>
                  <ul className="space-y-2">
                    {policy.items.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div
                          className={`w-1.5 h-1.5 rounded-full mt-2 mr-3 ${
                            policy.category === 'Eligible Items' ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        ></div>
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Refund Information */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Refund Information</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <ClockIcon className="w-8 h-8 text-yellow-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Processing Time</h3>
              <p className="text-gray-600">Refunds are processed within 5-7 business days after we receive your return.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <ArrowPathIcon className="w-8 h-8 text-yellow-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Refund Method</h3>
              <p className="text-gray-600">Refunds are issued to your original payment method.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <QuestionMarkCircleIcon className="w-8 h-8 text-yellow-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Return Shipping</h3>
              <p className="text-gray-600">Free returns for defective or wrong items. Customer pays for change of mind returns.</p>
            </div>
          </div>
        </section>

        {/* Important Notes */}
        <section className="bg-yellow-50 rounded-lg p-6 border border-yellow-200 mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Important Notes</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• Return requests must be initiated within 30 days of delivery</li>
            <li>• Items must be in original condition with all tags and packaging</li>
            <li>• Return shipping costs are the responsibility of the customer unless the return is due to our error</li>
            <li>• Sale items may have different return policies</li>
            <li>• Digital products and gift cards are non-refundable</li>
          </ul>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help with a Return?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Contact our customer support team for assistance with returns and refunds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="/faq"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Visit FAQ
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}