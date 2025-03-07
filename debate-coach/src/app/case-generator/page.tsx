import Link from "next/link";

export default function CaseGeneratorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-4xl p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Debate Case Generator</h1>
          <p className="mt-2 text-gray-600">Generate structured debate cases with ARES points for any topic</p>
        </div>
        
        <div className="mt-8">
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
            Debate Topic
          </label>
          <input
            id="topic"
            name="topic"
            type="text"
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your debate topic"
          />
        </div>
        
        <div className="mt-4">
          <label htmlFor="side" className="block text-sm font-medium text-gray-700">
            Debate Side
          </label>
          <select
            id="side"
            name="side"
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="proposition">Proposition</option>
            <option value="opposition">Opposition</option>
          </select>
        </div>
        
        <div className="mt-6">
          <button
            type="button"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Generate Case
          </button>
          <p className="text-sm text-gray-400 text-center mt-2">
            (Case generation functionality will be implemented in Step 7)
          </p>
        </div>
        
        <div className="mt-8 p-6 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Generated Case</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Speaker 1</h3>
              <div className="mt-2 p-4 bg-gray-50 rounded-md">
                <p className="text-gray-500 italic">
                  Speaker 1's ARES points will appear here after generation.
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">Speaker 2</h3>
              <div className="mt-2 p-4 bg-gray-50 rounded-md">
                <p className="text-gray-500 italic">
                  Speaker 2's ARES points will appear here after generation.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled
          >
            Save Case
          </button>
          <p className="text-sm text-gray-400 text-center mt-2 ml-2">
            (Save functionality will be implemented in Step 8)
          </p>
        </div>
      </div>
      
      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:text-blue-500">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
} 