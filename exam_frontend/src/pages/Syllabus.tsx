import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

const Syllabus: React.FC = () => {
  const [exam, setExam] = React.useState('GATE CSE')

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['syllabus', exam],
    queryFn: async () => {
      const res = await api.get(`/exams/syllabus/${encodeURIComponent(exam)}`)
      return res.data
    },
    enabled: false,
  })

  return (
    <div className="grid gap-4">
      <div className="flex gap-2">
        <input
          className="border rounded px-3 py-2 flex-1"
          placeholder="Exam name"
          value={exam}
          onChange={(e) => setExam(e.target.value)}
        />
        <button onClick={() => refetch()} className="bg-primary-600 text-white rounded px-4 py-2">
          {isFetching ? 'Loading...' : 'Fetch Syllabus'}
        </button>
      </div>
      {data && (
        <article className="prose max-w-none whitespace-pre-wrap bg-white p-4 rounded border text-black">
          {data.syllabus}
        </article>
      )}
    </div>
  )
}

export default Syllabus


