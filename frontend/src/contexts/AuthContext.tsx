import {
  createContext,
  useEffect,
  useState,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";
import axios from "axios";

interface Posts {
  title: string;
  content: string;
  createdAt: string;
  post_id: number;
}

interface User {
  username: string;
  posts: Posts[];
}

interface Context {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  loading: boolean;
}

const AuthContext = createContext<Context | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside a provider.");
  }

  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getUser() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/posts`,
          {
            withCredentials: true,
          },
        );
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    if (!user) getUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
