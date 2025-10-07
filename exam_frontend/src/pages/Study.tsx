import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

const Study: React.FC = () => {
  const [exam, setExam] = React.useState('GATE CSE')
  const [weeks, setWeeks] = React.useState(12)

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['roadmap', exam, weeks],
    queryFn: async () => {
      const res = await api.get(`/study/roadmap/${encodeURIComponent(exam)}?weeks=${weeks}`)
      return res.data
    },
    enabled: false,
  })

  return (
    <div className="grid gap-4">
      <div className="flex gap-2 items-center">
        <input
          className="border rounded px-3 py-2 flex-1"
          placeholder="Exam name"
          value={exam}
          onChange={(e) => setExam(e.target.value)}
        />
        <input
          type="number"
          className="border rounded px-3 py-2 w-28"
          value={weeks}
          onChange={(e) => setWeeks(Number(e.target.value))}
        />
        <button onClick={() => refetch()} className="bg-primary-600 text-white rounded px-4 py-2">
          {isFetching ? 'Loading...' : 'Generate Roadmap'}
        </button>
      </div>
      {data && (
        <article className="prose max-w-none whitespace-pre-wrap bg-white p-4 rounded border text-black">
          {data.roadmap}
        </article>
      )}
    </div>
  )
}

export default Study


