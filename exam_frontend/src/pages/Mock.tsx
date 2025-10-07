import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { api } from '../lib/api'

const Mock: React.FC = () => {
  const [exam, setExam] = React.useState('GATE CSE')
  const [topics, setTopics] = React.useState('DBMS, OS')
  const [result, setResult] = React.useState('')

  const genMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/mock/generate/${encodeURIComponent(exam)}`, topics.split(',').map(t => t.trim()))
      return res.data
    },
  })

  const submitMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/mock/submit`, {
        user_id: 'u1',
        exam_name: exam,
        score: 18,
        total: 25,
        weak_topics: ['Compilers', 'CN']
      })
      return res.data
    }
  })

  return (
    <div className="grid gap-4">
      <div className="flex gap-2">
        <input className="border rounded px-3 py-2" value={exam} onChange={(e) => setExam(e.target.value)} />
        <input className="border rounded px-3 py-2 flex-1" value={topics} onChange={(e) => setTopics(e.target.value)} />
        <button onClick={() => genMutation.mutate()} className="bg-primary-600 text-white rounded px-4 py-2">Generate</button>
        <button onClick={() => submitMutation.mutate()} className="border rounded px-4 py-2">Submit Sample</button>
      </div>
      {genMutation.data && (
        <pre className="bg-white border rounded p-4 overflow-auto text-xs">{JSON.stringify(genMutation.data, null, 2)}</pre>
      )}
      {submitMutation.data && (
        <pre className="bg-white border rounded p-4 overflow-auto text-xs">{JSON.stringify(submitMutation.data, null, 2)}</pre>
      )}
    </div>
  )
}

export default Mock


