import { notFound } from 'next/navigation'
import { type Metadata } from 'next'

// Define the exact shape of params
interface SubCategoryPageProps {
  params: {
    category: string
    subcategory: string
  }
}

// Generate metadata dynamically
export function generateMetadata({ params }: SubCategoryPageProps): Metadata {
  const { category, subcategory } = params
  const capitalize = (str: string) =>
    str.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())

  return {
    title: `${capitalize(subcategory)} - ${capitalize(category)} | Yafrican`,
    description: `Browse ${subcategory.replace(/-/g, ' ')} products in ${category.replace(/-/g, ' ')}`,
  }
}

// Page component
export default async function SubCategoryPage({ params }: SubCategoryPageProps) {
  const { category, subcategory } = params

  const validCategories: Record<string, string[]> = {
    electronics: ['phones', 'laptops', 'cameras'],
    clothing: ['men', 'women', 'kids'],
    toys: ['action-figures', 'puzzles', 'board-games'],
    'home-&-kitchen': ['furniture', 'appliances', 'decor'],
    beauty: ['makeup', 'skincare', 'hair-care'],
    sports: ['outdoor', 'gym', 'team-sports'],
    books: ['fiction', 'non-fiction', 'children'],
  }

  const categoryKey = category.toLowerCase()
  const subKey = subcategory.toLowerCase()

  if (!(categoryKey in validCategories && validCategories[categoryKey].includes(subKey))) {
    notFound()
  }

  const capitalize = (str: string) =>
    str.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">
        {capitalize(category)} / {capitalize(subcategory)}
      </h1>

      <p className="text-gray-700 mb-6">
        Displaying products under <strong>{capitalize(subcategory)}</strong> in{' '}
        <strong>{capitalize(category)}</strong>.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((num) => (
          <div
            key={num}
            className="border rounded shadow p-4 bg-white hover:shadow-lg transition"
          >
            <div className="h-40 bg-gray-100 rounded mb-2" />
            <h2 className="font-semibold text-sm">Product {num}</h2>
            <p className="text-xs text-gray-500">Product description</p>
          </div>
        ))}
      </div>
    </main>
  )
}
