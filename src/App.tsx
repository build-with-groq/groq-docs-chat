import './App.css'
import Chat from './components/Chat'
import { Github } from 'lucide-react'

function App() {
  return (
    <>
      <Chat />
      <a
        href="https://github.com/build-with-groq/groq-docs-chat"
        target="_blank"
        rel="noopener noreferrer"
        className="github-link"
        aria-label="View source on GitHub"
      >
        <Github size={24} />
      </a>
    </>
  )
}

export default App
