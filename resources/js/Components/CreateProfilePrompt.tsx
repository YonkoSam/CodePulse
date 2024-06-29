import React, {useEffect} from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const CreateProfilePrompt = () => {
    useEffect(() => handleCreateProfile, [])
    const handleCreateProfile = () => {
        MySwal.fire({
            title: "Create Profile",
            html: (
                <div>
                    <p>To interact with the community, you need to create a profile first.</p>
                </div>
            ),
            showCancelButton: true,
            confirmButtonText: "Create Profile",
            cancelButtonText: "Cancel",
            icon: "info",
            showLoaderOnConfirm: true,
            preConfirm: () => {
                window.location.href = route('profiles.create');
            }
        });
    };
    return (
        <>
        </>
    );
};

export default CreateProfilePrompt;
