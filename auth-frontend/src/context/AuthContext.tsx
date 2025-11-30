import { createContext, useState, type ReactNode } from "react";

interface User {
    id: string;
    username: string;
    profile?: string;
    token: string;
}

interface AuthContextType {
    user: User | null;
    setUser: (u: User | null) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => {},
    logout: () => {},
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const logout = () => setUser(null);

    return(
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    )
}