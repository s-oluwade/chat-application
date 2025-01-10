import './App.css'
import ChatBox from './components/ChatBox'

function App() {

  return (
    <div className="h-screen bg-gray-100 flex justify-center items-center">
    <h1 className="text-2xl font-bold mb-4">Welcome to the Chat App</h1>
    <ChatBox />
  </div>
  )
}

export default App
