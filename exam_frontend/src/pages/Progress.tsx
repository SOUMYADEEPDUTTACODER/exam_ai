import React from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

const Progress: React.FC = () => {
  const [userId, setUserId] = React.useState('u1')
  const [exam, setExam] = React.useState('GATE CSE')
  const [topic, setTopic] = React.useState('DBMS')
  const [status, setStatus] = React.useState('completed')

  const updateMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/progress/update', {
        user_id: userId,
        exam_name: exam,
        topic,
        status,
      })
      return res.data
    },
  })

  const progressQuery = useQuery({
    queryKey: ['progress', userId],
    queryFn: async () => {
      const res = await api.get(`/progress/user/${encodeURIComponent(userId)}`)
      return res.data
    },
    enabled: !!userId,
  })

  return (
    <div className="grid gap-4">
      <div className="grid gap-2 md:grid-cols-5">
        <input className="border rounded px-3 py-2" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User ID" />
        <input className="border rounded px-3 py-2" value={exam} onChange={(e) => setExam(e.target.value)} placeholder="Exam" />
        <input className="border rounded px-3 py-2" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic" />
        <select className="border rounded px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="completed">completed</option>
          <option value="pending">pending</option>
          <option value="weak">weak</option>
        </select>
        <button onClick={() => updateMutation.mutate()} className="bg-primary-600 text-white rounded px-4 py-2">Update</button>
      </div>

      <div className="flex gap-2">
        <button onClick={() => progressQuery.refetch()} className="border rounded px-4 py-2">Refresh Progress</button>
      </div>

      {progressQuery.data && (
        <pre className="bg-white border rounded p-4 overflow-auto text-xs">{JSON.stringify(progressQuery.data, null, 2)}</pre>
      )}
    </div>
  )
}

export default Progress


