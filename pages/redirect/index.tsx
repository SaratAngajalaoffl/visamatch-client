import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Spinner from "react-spinners/ClipLoader";

import classes from "@/styles/Redirect.module.css";
import { useAuthContext } from "@/components/contexts/AuthContext";

const AuthRedirect = () => {
    const router = useRouter();

    const { pb } = useAuthContext();

    useEffect(() => {
        (async () => {
            const { code } = router.query;

            if (!code) return;

            const { authProviders } = await pb
                .collection("employee")
                .listAuthMethods();

            const githubProvider = authProviders.find(
                (provider) => provider.name === "github"
            );

            if (!githubProvider) return;

            const { record, meta } = await pb
                .collection("employee")
                .authWithOAuth2(
                    githubProvider.name,
                    code.toString(),
                    githubProvider.codeVerifier,
                    "http://localhost:3000/redirect"
                );

            if (!meta?.rawUser) return;

            const user = meta.rawUser;

            let data = {
                full_name: record.full_name || user.name,
                avatar: record.avatar || user.avatar_url,
                bio: record.bio || user.bio,
                company: record.company || user.company,
            };

            await pb.collection("employee").update(record.id, data)

            router.push({
                pathname: "/"
            })
        })();
    }, [router]);

    return (
        <>
            <Head>
                <title>VisaMatch - Authenticating</title>
                <meta
                    name="description"
                    content="A website that helps people looking for a VISA sponsorship in the US."
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={classes.main}>
                <h1>Authenticating</h1>
                <Spinner loading={true} />
            </main>
        </>
    );
};

export default AuthRedirect;
