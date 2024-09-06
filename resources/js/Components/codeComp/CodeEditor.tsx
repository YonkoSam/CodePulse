import React, {useEffect, useRef, useState} from "react";
import {Autocomplete, Box, CircularProgress, IconButton, TextField, Tooltip} from "@mui/material";
import {Editor} from "@monaco-editor/react";
import {isSupported, languages} from "@/utils";
import {FullScreen, useFullScreenHandle} from "react-full-screen";
import {Fullscreen} from "@mui/icons-material";


const CodeEditor = ({setValue, height, defaultLanguage = null, testingGroundMode = false}) => {

    const [language, setLanguage] = useState<{ name: string; value: string } | null>(defaultLanguage ?? languages[0]);
    const [screenHeight, setScreenHeight] = useState(height);
    const editorRef = useRef(null);
    const getLanguageObject = (name: string | null) => {
        return languages.find(lang => lang.name === name) || {name: '', value: ''};
    };

    const handleFullScreen = useFullScreenHandle();

    const customName = (name: string) => {
        return name == 'CPP' ? 'C++' : name == 'CSharp' ? 'C#' : name == 'FSharp' ? 'F#' : name;
    }


    const languageNames = testingGroundMode ? languages.filter(lang => isSupported(lang.name)).map(lang => lang.name)
        : languages.map(lang => lang.name);


    useEffect(() => {
        editorRef.current?.focus();
        if (testingGroundMode) {
            setValue({language: language.name, sourceCode: language.value});
        }
    }, [language]);


    function handleChange() {
        setValue({language: language.name, sourceCode: editorRef.current.getValue()});
    }

    useEffect(() => {
        setScreenHeight(handleFullScreen.active ? '100vh' : height);

    }, [handleFullScreen]);

    return <Box className='relative'>

        <div className='absolute cursor-pointer top-[4px] right-[10px]  z-10  hover:scale-110 duration-300'>
            <Tooltip title='Show in fullscreen'>
                <IconButton onClick={handleFullScreen.enter} className='!text-white'>
                    <Fullscreen/>
                </IconButton>
            </Tooltip>
        </div>


        <Autocomplete
            className=' text-sm px-2 py-1 mb-2 max-w-52 rounded-xl'
            options={languageNames}
            getOptionLabel={(option => customName(option))}
            value={language.name}
            onChange={(event, newValue) => newValue && setLanguage(getLanguageObject(newValue))}
            renderInput={(params) => (
                <TextField
                    sx={{
                        '& .MuiInputLabel-root': {
                            color: 'white',
                        },
                        '& .MuiInputBase-root': {
                            color: 'white',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',
                        },
                    }}

                    {...params}
                    label="Select a language"
                    variant="standard"
                />
            )}
        />
        <FullScreen handle={handleFullScreen}>

            <Editor
                className='[&>.monaco-editor]:rounded-2xl  [&>.monaco-editor]:py-6 mb-5'
                height={screenHeight}
                theme="vs-dark"
                loading={
                    <div className='flex flex-col justify-center items-center w-full gap-3'>
                        <p className="text-gray-400 font-light text-sm text-center">Loading The Code Editor</p>
                        <CircularProgress size={56}/>
                    </div>
                }
                language={language.name == 'Bash' ? 'bat' : language.name.toLowerCase()}
                value={language.value}
                onChange={handleChange}
                onMount={(editor) => (editorRef.current = editor)}
                options={{
                    scrollBeyondLastLine: false,
                    minimap: {enabled: false},
                    fontLigatures: true,
                    fontFamily: `"JetBrains Mono", monospace`,


                }}
            />
        </FullScreen>


    </Box>

}

export default CodeEditor;
