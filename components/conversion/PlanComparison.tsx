export function PlanComparison() {
  const features = [
    {
      name: 'Prompts Included',
      free: '100',
      starter: '500',
      pro: '2,000',
      complete: '5,000+'
    },
    {
      name: 'AI Model Compatibility',
      free: 'ChatGPT Only',
      starter: 'All Models',
      pro: 'All Models',
      complete: 'All Models + Beta'
    },
    {
      name: 'Weekly New Prompts',
      free: false,
      starter: true,
      pro: true,
      complete: true
    },
    {
      name: 'Priority Support',
      free: false,
      starter: false,
      pro: true,
      complete: true
    },
    {
      name: 'Discord Community',
      free: false,
      starter: false,
      pro: 'Standard Access',
      complete: 'VIP Access'
    },
    {
      name: 'Custom Prompt Requests',
      free: false,
      starter: false,
      pro: '3/month',
      complete: 'Unlimited'
    },
    {
      name: 'Advanced Search & Filters',
      free: 'Basic',
      starter: true,
      pro: true,
      complete: true
    },
    {
      name: 'Prompt Collections',
      free: false,
      starter: '5 collections',
      pro: '25 collections',
      complete: 'Unlimited'
    },
    {
      name: 'Export to Notion/Docs',
      free: false,
      starter: false,
      pro: true,
      complete: true
    },
    {
      name: 'API Access',
      free: false,
      starter: false,
      pro: false,
      complete: true
    }
  ]

  const renderCell = (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-slate-300 dark:text-slate-700 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    }
    return <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{value}</span>
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl overflow-x-auto">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Compare All Plans
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Choose the perfect plan for your needs
        </p>
      </div>

      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b-2 border-slate-200 dark:border-slate-800">
            <th className="text-left p-4 font-bold text-slate-900 dark:text-white min-w-[200px]">Features</th>
            <th className="p-4 font-bold text-slate-600 dark:text-slate-400 min-w-[120px]">
              <div>Free</div>
              <div className="text-2xl mt-1">$0</div>
            </th>
            <th className="p-4 font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 min-w-[120px]">
              <div>Starter</div>
              <div className="text-2xl mt-1">$49</div>
            </th>
            <th className="p-4 font-bold text-purple-600 bg-purple-50 dark:bg-purple-900/20 min-w-[120px]">
              <div className="flex items-center justify-center gap-1">
                <span>Pro</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="text-2xl mt-1">$137</div>
              <div className="text-xs line-through opacity-60">$197</div>
            </th>
            <th className="p-4 font-bold text-pink-600 bg-pink-50 dark:bg-pink-900/20 min-w-[120px]">
              <div>Complete</div>
              <div className="text-2xl mt-1">$297</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr key={index} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td className="p-4 font-medium text-slate-900 dark:text-white">{feature.name}</td>
              <td className="p-4 text-center">{renderCell(feature.free)}</td>
              <td className="p-4 text-center bg-blue-50/50 dark:bg-blue-900/10">{renderCell(feature.starter)}</td>
              <td className="p-4 text-center bg-purple-50/50 dark:bg-purple-900/10 font-semibold">{renderCell(feature.pro)}</td>
              <td className="p-4 text-center bg-pink-50/50 dark:bg-pink-900/10">{renderCell(feature.complete)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-8 flex items-center justify-center gap-4">
        <a
          href="#pricing"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 rounded-xl text-white font-bold hover:shadow-2xl hover:scale-105 transition-all"
        >
          <span>Choose Your Plan</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>
      </div>
    </div>
  )
}
