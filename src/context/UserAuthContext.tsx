import { createContext, useContext, useEffect, useState } from 'react'
import {
    onAuthStateChanged,
    signOut,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    User,
    ConfirmationResult,
} from 'firebase/auth'
import { auth } from '../firebase'

type UserAuthContextType = {
    user: User | null
    userDetails: { name: string; role: string }
    logOut: () => Promise<void>
    setUserDetails: React.Dispatch<
        React.SetStateAction<{
            name: string
            role: string
        }>
    >
    setUpRecaptha: (number: string) => Promise<ConfirmationResult>
}

const UserAuthContext = createContext<UserAuthContextType>({} as UserAuthContextType)

type UserAuthContextProviderProps = {
    children: React.ReactNode
}

export function UserAuthContextProvider({ children }: UserAuthContextProviderProps) {
    const [user, setUser] = useState<User | null>({} as User)
    const [userDetails, setUserDetails] = useState({ name: '', role: '' })

    function setUpRecaptha(number: string) {
        const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {})
        recaptchaVerifier.render()
        return signInWithPhoneNumber(auth, number, recaptchaVerifier)
    }

    function logOut() {
        localStorage.removeItem('frp-username')
        localStorage.removeItem('frp-userrole')
        return signOut(auth)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentuser) => {
            console.log('Auth', currentuser)
            setUser(currentuser)
            setUserDetails({
                name: localStorage.getItem('frp-username') || '',
                role: localStorage.getItem('frp-userrole') || '',
            })
        })
        return () => {
            unsubscribe()
        }
    }, [])

    // useEffect(() => {
    //     const handleTabClose = (event: any) => {
    //         event.preventDefault()
    //         logOut()
    //     }
    //     window.addEventListener('beforeunload', handleTabClose)
    //     return () => {
    //         window.removeEventListener('beforeunload', handleTabClose)
    //     }
    // }, [])

    return (
        <UserAuthContext.Provider
            value={{
                user,
                userDetails,
                logOut,
                setUserDetails,
                setUpRecaptha,
            }}
        >
            {children}
        </UserAuthContext.Provider>
    )
}

export function useUserAuth() {
    return useContext(UserAuthContext)
}
