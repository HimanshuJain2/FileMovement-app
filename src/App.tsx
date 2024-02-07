import { Route, Routes } from 'react-router-dom'
import { Home, ErrorPage, ViewProposals } from './pages'
import { Footer, Header } from './components'
import { ProtectedRoute, AnonymousRoute } from './components/ProtectedRoute'
import { UserAuthContextProvider } from './context/UserAuthContext'
import './i18n'
import { useEffect } from 'react'

function App() {
    useEffect(() => {
        const handleContextmenu = (e: any) => {
            e.preventDefault()
        }
        document.addEventListener('contextmenu', handleContextmenu)
        return function cleanup() {
            document.removeEventListener('contextmenu', handleContextmenu)
        }
    }, [])
    return (
        <div className="App">
            <UserAuthContextProvider>
                <Header />
                <div className="MainContent">
                    <Routes>
                        <Route
                            path="/search-files"
                            element={
                                <ProtectedRoute>
                                    <ViewProposals />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/"
                            element={
                                <AnonymousRoute>
                                    <Home />
                                </AnonymousRoute>
                            }
                        />
                        <Route path="/*" element={<ErrorPage />} />
                    </Routes>
                </div>
            </UserAuthContextProvider>
            <Footer />
        </div>
    )
}

export default App
