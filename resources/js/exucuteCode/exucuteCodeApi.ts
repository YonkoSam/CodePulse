import axios from "axios";
import {LANGUAGE_VERSIONS} from "./constants";

interface CodeExecutionResult {
    language: string;  // Name (not alias) of the runtime used
    version: string;   // Version of the used runtime
    run: {
        stdout: string;  // stdout from run stage process
        stderr: string;  // stderr from run stage process
        output: string;  // stdout and stderr combined in order of data from run stage process
        code: number | null;  // Exit code from run process, or null if signal is not null
        signal: string | null;  // Signal from run process, or null if code is not null
    };
    compile?: {
        stdout: string;  // stdout from compile stage process
        stderr: string;  // stderr from compile stage process
        output: string;  // stdout and stderr combined in order of data from compile stage process
        code: number | null;  // Exit code from compile process, or null if signal is not null
        signal: string | null;  // Signal from compile process, or null if code is not null
    };
}

const API = axios.create({
    baseURL: "https://emkc.org/api/v2/piston",
});


export const executeCode = async (language: string, sourceCode: string): Promise<CodeExecutionResult> => {
    const response = await API.post("/execute", {
        language: language,
        version: LANGUAGE_VERSIONS[language],
        files: [
            {
                content: sourceCode,
            },
        ],
    });
    return response.data;
};


