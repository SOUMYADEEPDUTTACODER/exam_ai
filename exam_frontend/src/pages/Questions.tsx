import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

type Question = { question_text: string; options: string[]; answer: string }

const Questions: React.FC = () => {
  const [exam, setExam] = React.useState('GATE CSE')
  const [topic, setTopic] = React.useState('DBMS')

  const { data, isFetching, refetch } = useQuery<{ questions: Question[] }>({
    queryKey: ['questions', exam, topic],
    queryFn: async () => {
      const res = await api.get(`/study/questions/${encodeURIComponent(exam)}/${encodeURIComponent(topic)}`)
      return res.data
    },
    enabled: false,
  })

  return (
    <div className="grid gap-4">
      <div className="flex gap-2">
        <input className="border rounded px-3 py-2" value={exam} onChange={(e) => setExam(e.target.value)} />
        <input className="border rounded px-3 py-2" value={topic} onChange={(e) => setTopic(e.target.value)} />
        <button onClick={() => refetch()} className="bg-primary-600 text-white rounded px-4 py-2">
          {isFetching ? 'Loading...' : 'Generate'}
        </button>
      </div>
      <div className="grid gap-3 text-black">
        {data?.questions?.map((q, idx) => (
          <div key={idx} className="border rounded p-4 bg-white">
            <div className="font-medium mb-2">{q.question_text}</div>
            <ul className="list-disc pl-6 text-sm text-gray-700">
              {q.options?.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ul>
            <div className="text-sm font-semibold mt-2 text-black">Answer: {q.answer}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Questions


