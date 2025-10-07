import React from 'react'
import { Link } from 'react-router-dom'

const Home: React.FC = () => {
  return (
    <div className="grid gap-8">
      <section className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Your AI-powered exam companion</h1>
        <p className="text-gray-600">Syllabus, study plans, questions, mocks, and progress tracking.</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { to: '/syllabus', title: 'Syllabus', desc: 'Fetch official syllabus instantly.' },
          { to: '/study', title: 'Study Roadmap', desc: 'Personalized week-by-week plan.' },
          { to: '/questions', title: 'Practice Questions', desc: 'Generate or reuse cached MCQs.' },
          { to: '/mock', title: 'Mock Tests', desc: 'Create and submit mock results.' },
          { to: '/progress', title: 'Progress', desc: 'Track topics and mastery.' },
        ].map((c) => (
          <Link key={c.to} to={c.to} className="rounded-lg border p-4 hover:shadow-md transition">
            <h3 className="font-semibold">{c.title}</h3>
            <p className="text-sm text-gray-600">{c.desc}</p>
          </Link>
        ))}
      </section>
    </div>
  )
}

export default Home


