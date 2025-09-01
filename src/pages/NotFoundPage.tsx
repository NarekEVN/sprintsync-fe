import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="text-center">
      <h2 className="text-2xl font-semibold">404 - Not Found</h2>
      <p className="text-gray-600 mt-2">The page you are looking for does not exist.</p>
      <Link className="text-indigo-600 font-medium inline-block mt-4" to="/">Go home</Link>
    </section>
  )
}
