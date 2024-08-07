import axios from "axios";
import {LANGUAGE_VERSIONS} from "./constants";

const API = axios.create({
    baseURL: "https://emkc.org/api/v2/piston",
});


export const executeCode = async (language: string, sourceCode: string) => {

    const response = await API.post("/execute", {
        language: language.toLowerCase(),
        version: LANGUAGE_VERSIONS[language],
        files: [
            {

                content: sourceCode,
            },
        ],
    });
    return response.data;
};


