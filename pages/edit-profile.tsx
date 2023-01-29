import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import Spinner from "react-spinners/ClipLoader";

import classes from "@/styles/EditProfile.module.css";
import { useAuthContext } from "@/components/contexts/AuthContext";

const EditProfile = () => {
    const { pb, auth } = useAuthContext();

    const { register, handleSubmit } = useForm({
        defaultValues: {
            full_name: auth.data?.full_name || "",
            avatar: auth.data?.avatar || "",
            bio: auth.data?.bio || "",
            company: auth.data?.company || "",
            skills: auth.data?.skills || "",
            industry: auth.data?.industry || "",
            visa_type: auth.data?.visa_type || "",
            resume: auth.data?.resume || "",
            experience: auth.data?.experience || "<1 year",
        },
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [message, setMessage] = useState<string>("");

    const updateProfile = useCallback(
        async (data: any) => {
            setLoading(true);

            if (!auth?.data) return;

            const formdata = new FormData();

            for (var key of Object.keys(data)) {
                if (key === "resume") {
                    formdata.append(key, data[key][0]);
                } else {
                    formdata.append(key, data[key]);
                }
            }

            await pb.collection("employee").update(auth.data.id, formdata);

            setMessage("Profile updated");

            setLoading(false);
        },
        [auth, pb]
    );

    if (loading) {
        return (
            <div>
                <Spinner />
            </div>
        );
    }

    return (
        <div>
            <h1>Edit Profile</h1>
            <form
                onSubmit={handleSubmit(updateProfile)}
                className={classes.form}
            >
                <input {...register("full_name")} placeholder="full_name" />
                <input {...register("bio")} placeholder="bio" />
                <input {...register("company")} placeholder="company" />
                <input {...register("skills")} placeholder="skills" />
                <input {...register("industry")} placeholder="industry" />
                <select {...register("visa_type")} placeholder="visa_type">
                    <option value="H1B">H1B</option>
                    <option value="F1 OPT">F1 OPT</option>
                </select>
                <input
                    {...register("resume")}
                    placeholder="resume"
                    type="file"
                    multiple={false}
                />
                <select {...register("experience")} placeholder="experience">
                    <option value="<1 year">Less than 1 year</option>
                    <option value="1+ years">1 year+</option>
                    <option value="2+ years">2 year+</option>
                    <option value="5+ years">5 year+</option>
                </select>

                <input type="submit" />
            </form>

            <div>{message}</div>
        </div>
    );
};

export default EditProfile;
