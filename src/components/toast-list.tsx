type ToastType = 'success' | 'error'

export type ToastMessage = {
  id: number
  type: ToastType
  text: string
}

type ToastListProps = {
  items: ToastMessage[]
}

export function ToastList({ items }: ToastListProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <div className="fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-2">
      {items.map((item) => (
        <div
          key={item.id}
          className={`rounded-lg border px-3 py-2 text-sm shadow-sm ${
            item.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {item.text}
        </div>
      ))}
    </div>
  )
}

