// app/test-tailwind/page.tsx
export default function TestTailwind() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-2xl text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🎨 Tailwind CSS Test
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          If you see styles, Tailwind is working!
        </p>
        <div className="space-y-3">
          <div className="bg-red-500 text-white p-3 rounded">Red Box</div>
          <div className="bg-green-500 text-white p-3 rounded">Green Box</div>
          <div className="bg-blue-500 text-white p-3 rounded">Blue Box</div>
        </div>
      </div>
    </div>
  );
}