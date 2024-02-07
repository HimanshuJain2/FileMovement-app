import React from 'react'
import { Navigate } from 'react-router-dom'
import { useUserAuth } from '../context/UserAuthContext'

type ProtectedRouteProps = {
    children: any
}
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user } = useUserAuth()
    if (!user) {
        return <Navigate to="/" replace />
    }
    return children
}

const AnonymousRoute = ({ children }: ProtectedRouteProps) => {
    const { user } = useUserAuth()
    if (user) {
        return <Navigate to="/search-files" replace />
    }
    return children
}

export { ProtectedRoute, AnonymousRoute }

// https://us-central1-file-request-portal.cloudfunctions.net/addmessage
