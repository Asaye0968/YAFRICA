import { Metadata } from 'next'
import Link from 'next/link'
import { TruckIcon, ClockIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Shipping Information - Yafrican',
  description: 'Learn about our shipping policies, delivery times, and shipping costs.',
}

const shippingOptions = [
  {
    name: 'Standard Shipping',
    price: 'Free on orders over $50',
    time: '3-5 business days',
    description: 'Our most economical shipping option for non-urgent deliveries.',
    icon: TruckIcon,
  },
  {
    name: 'Express Shipping',
    price: '$9.99',
    time: '1-2 business days',
    description: 'Get your orders faster with our express delivery service.',
    icon: ClockIcon,
  },
  {
    name: 'Same Day Delivery',
    price: '$14.99',
    time: 'Same day',
    description: 'Available for orders placed before 12 PM in select areas.',
    icon: MapPinIcon,
  },
]

const shippingFaqs = [
  {
    question: 'How long does shipping take?',
    answer: 'Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days. Same-day delivery is available for orders placed before 12 PM in eligible areas.',
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Currently, we only ship within Ethiopia. We plan to expand to international shipping in the near future.',
  },
  {
    question: 'How can I track my order?',
    answer: 'Once your order ships, you will receive a tracking number via email. You can also track your order from your account dashboard.',
  },
  {
    question: 'What if I am not home during delivery?',
    answer: 'Our delivery partner will attempt delivery twice. If unsuccessful, your package will be held at the nearest pickup location for 5 business days.',
  },
]

export default function ShippingInfo() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Shipping Information</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn about our shipping options, delivery times, and policies to make your shopping experience seamless.
          </p>
        </div>

        {/* Shipping Options */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Shipping Options</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {shippingOptions.map((option) => (
              <div
                key={option.name}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <option.icon className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">{option.name}</h3>
                </div>
                <p className="text-2xl font-bold text-yellow-600 mb-2">{option.price}</p>
                <p className="text-gray-600 mb-3">
                  <strong>Delivery Time:</strong> {option.time}
                </p>
                <p className="text-gray-500 text-sm">{option.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Shipping Policies */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Policies</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Free Shipping</h3>
                <p className="text-gray-600">
                  Enjoy free standard shipping on all orders over $50. For orders below $50, 
                  a flat rate of $4.99 applies for standard shipping.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Order Processing</h3>
                <p className="text-gray-600">
                  Orders are processed within 24 hours during business days (Monday-Friday). 
                  Orders placed on weekends or holidays will be processed the next business day.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Delivery Areas</h3>
                <p className="text-gray-600">
                  We currently deliver to all major cities in Ethiopia. Some remote areas may 
                  have extended delivery times or additional shipping fees.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {shippingFaqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Support */}
        <section className="text-center bg-yellow-50 rounded-lg p-8 border border-yellow-200">
          <PhoneIcon className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help with Shipping?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our customer service team is here to help you with any shipping-related questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="/track-order"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Track Your Order
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}