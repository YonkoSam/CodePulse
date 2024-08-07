import {useState} from "react";
import {Box, CircularProgress, Typography} from "@mui/material";
import {executeCode} from "@/exucuteCode/exucuteCodeApi";
import {BACKGROUND_GRADIENT, Toast} from "@/utils";
import PrimaryButton from "@/Components/formComp/PrimaryButton";

const Output = ({language, sourceCode}) => {
    const [output, setOutput] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);


    const runCode = async () => {
        if (!sourceCode) return;
        try {
            setIsLoading(true);
            const {run: result} = await executeCode(language, sourceCode);

            setOutput(result.output.split("\n"));
            setIsError(!!result.stderr);
            if (result.signal == "SIGKILL") {
                setIsError(true);
                setOutput(["Execution Timed Out", "Our servers are configured to only allow a certain amount of time for your code to execute. In rare cases the server may be taking on too much work and simply wasn't able to run your code efficiently enough. Most of the time though this issue is caused by inefficient algorithms. If you see this error multiple times you should try to optimize your code further."]);
            }
        } catch (error) {
            Toast.fire({
                title: "An error occurred.",
                text: error.message || "Unable to run code",
                icon: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            width="100%"
            p={3}
            className={`${BACKGROUND_GRADIENT} rounded-xl shadow-lg`}
        >
            <Typography variant="h6" className="text-white mb-4">
                Output
            </Typography>
            <PrimaryButton
                disabled={isLoading}
                onClick={runCode}
                className="bg-blue-600 hover:bg-blue-700 transition duration-200"
            >
                Run Code {isLoading && <CircularProgress size={12}/>}
            </PrimaryButton>
            <Box
                height="75vh"
                p={2}
                className={`mt-4 rounded-2xl overflow-auto bg-white text-black border-2 shadow-md  ${
                    isError ? "border-red-500" : "border-gray-300"
                }`}
            >
                {output ? (
                    output.map((line, i) => (
                        <Typography
                            key={i}
                            variant="body2"
                            className={`whitespace-pre-line ${
                                isError ? "text-red-600" : ""
                            }`}
                        >
                            {line}
                        </Typography>
                    ))
                ) : (
                    <Typography variant="body2" className="text-gray-500">
                        Click "Run Code" to see the output here
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default Output;
