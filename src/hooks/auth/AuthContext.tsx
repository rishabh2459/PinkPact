import React, { createContext, useState, useContext, ReactNode } from 'react'

interface AuthContextType {
  authToken: string | null
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [authToken, setAuthToken] = useState<string | null>(null)

  const login = (token: string) => {
    setAuthToken(token)
    setIsAuthenticated(true)
  }

  const logout = () => {
    console.log('token')
    setAuthToken(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ authToken, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
