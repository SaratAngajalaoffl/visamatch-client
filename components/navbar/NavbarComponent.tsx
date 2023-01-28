import React, { useCallback } from "react";
import { useAuthContext } from "../contexts/AuthContext";

import classes from "./NavbarComponent.module.css";

const Navbar: React.FunctionComponent = () => {
    const { pb, auth } = useAuthContext();

    const employeeSignup = useCallback(async () => {
        const { authProviders } = await pb
            .collection("employee")
            .listAuthMethods();

        const githubProvider = authProviders.find(
            (provider) => provider.name === "github"
        );

        window.location.replace(
            githubProvider?.authUrl + "http://localhost:3000/redirect"
        );
    }, []);

    const handleLogout = async () => {
        pb.authStore.clear();
    };

    return (
        <nav className={classes.main}>
            <h1>VisaMatch</h1>
            <div className={classes.nav_items}>
                {!auth.isAuthenticated || !auth?.data ? (
                    <>
                        <button
                            onClick={employeeSignup}
                            className={classes.nav_item}
                        >
                            Employee Login
                        </button>
                    </>
                ) : (
                    <>
                        Welcome {auth.data.full_name}
                        <button
                            onClick={handleLogout}
                            className={classes.nav_item}
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
