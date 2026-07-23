function ActionItems({ items }) {
  if (!items?.length) return null

  return (
    <section className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
      <h2 className="text-lg font-medium text-indigo-900">Action items</h2>
      <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-indigo-900">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </section>
  )
}

export default ActionItems
