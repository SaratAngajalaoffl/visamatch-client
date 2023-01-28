import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import PocketBase, { Admin, Record } from "pocketbase";
import Spinner from "react-spinners/ClipLoader";

import Navbar from "../navbar/NavbarComponent";

type Props = {
    children: React.ReactNode;
};

type AuthData = {
    isAuthenticated: boolean;
    data?: Record | Admin | null;
};

type IAuthContext = {
    pb: PocketBase;
    auth: AuthData;
};

const authContext = createContext<IAuthContext>({
    pb: new PocketBase("http://127.0.0.1:8090"),
    auth: {
        isAuthenticated: false,
    },
});

const AuthContextProvider: React.FunctionComponent<Props> = ({ children }) => {
    const pb = useMemo(() => new PocketBase("http://127.0.0.1:8090"), []);

    const [loading, setLoading] = useState<boolean>(true);

    const [auth, setAuth] = useState<AuthData>({
        isAuthenticated: false,
    });

    useEffect(() => {
        setLoading(true);

        setAuth({
            isAuthenticated: pb.authStore.isValid,
            data: pb.authStore.model,
        });

        const unsubscribe = pb.authStore.onChange(() => {
            setAuth({
                isAuthenticated: pb.authStore.isValid,
                data: pb.authStore.model,
            });
        });

        setLoading(false);

        return unsubscribe;
    }, [pb]);

    if (loading) {
        return (
            <div>
                <Spinner />
            </div>
        );
    }

    return (
        <authContext.Provider value={{ pb, auth }}>
            <Navbar />
            {children}
        </authContext.Provider>
    );
};

export const useAuthContext = () => {
    const contextData = useContext(authContext);

    return contextData;
};

export default AuthContextProvider;
