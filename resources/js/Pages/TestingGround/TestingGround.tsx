import React, {useState} from 'react';
import CodeEditor from "@/Components/codeComp/CodeEditor";
import Output from "@/Components/codeComp/Output";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {usePage} from "@inertiajs/react";
import {PageProps} from "@/types";
import {motion} from "framer-motion";
import {useWindowSize} from "@/utils";
import {IconButton} from "@mui/material";
import {Code, Terminal} from "@mui/icons-material";

const TestingGround = ({language = "", sourceCode = ""}) => {
    const [code, setCode] = useState({language: language, sourceCode: sourceCode});
    const [runCode, setRunCode] = useState(false)
    const {width} = useWindowSize();
    const {auth} = usePage<PageProps>().props;
    const isMobile = width <= 768;
    return (
        <AuthenticatedLayout user={auth.user} title='Testing Ground'
                             header={<h2 className="font-semibold text-xl text-white leading-tight">Testing
                                 Ground</h2>}>
            <div className='px-2 md:px-16 flex gap-3 flex-col items-center flex-1 md:flex-row'>
                {
                    isMobile && <IconButton className='!text-white' onClick={() => setRunCode(prevState => !prevState)}>
                        {runCode ?
                            <Terminal/> :
                            <Code/>}
                    </IconButton>
                }


                <motion.div
                    initial={{x: -50, opacity: 0}}
                    animate={{x: 0, opacity: 1}}
                    transition={{duration: 0.3, delay: 0.2}}

                    className={`w-full md:w-1/2 bg-black/30 rounded-xl shadow-lg p-4 ${isMobile && (runCode ? 'hidden' : 'block')} `}
                >
                    <CodeEditor setValue={setCode}
                                defaultLanguage={language ? {name: language, value: sourceCode} : null}
                                height={'80vh'} testingGroundMode={true}/>
                </motion.div>

                <motion.div
                    initial={{x: 50, opacity: 0}}
                    animate={{x: 0, opacity: 1}}
                    transition={{duration: 0.3, delay: 0.2}}
                    className={`w-full md:w-1/2 ${isMobile && (runCode ? 'block' : 'hidden')}`}

                >
                    <Output language={code.language} sourceCode={code.sourceCode}/>
                </motion.div>


            </div>
        </AuthenticatedLayout>

    );
};

export default TestingGround;
