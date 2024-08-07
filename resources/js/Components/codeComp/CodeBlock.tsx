import React from "react";
import {PrismLight as SyntaxHighlighter} from 'react-syntax-highlighter';
import {vscDarkPlus} from 'react-syntax-highlighter/dist/esm/styles/prism';
import {isSupported, Toast} from "@/utils";
import CopyButton from "@/Components/codeComp/CopyButton";
import {Code} from "@mui/icons-material";
import {Tooltip} from "@mui/material";
import js from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import ts from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import less from 'react-syntax-highlighter/dist/esm/languages/prism/less';
import scss from 'react-syntax-highlighter/dist/esm/languages/prism/scss';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import html from 'react-syntax-highlighter/dist/esm/languages/prism/markup';
import xml from 'react-syntax-highlighter/dist/esm/languages/prism/markup';
import php from 'react-syntax-highlighter/dist/esm/languages/prism/php';
import csharp from 'react-syntax-highlighter/dist/esm/languages/prism/csharp';
import razor from 'react-syntax-highlighter/dist/esm/languages/prism/csharp';
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';
import vb from 'react-syntax-highlighter/dist/esm/languages/prism/vbnet';
import coffeescript from 'react-syntax-highlighter/dist/esm/languages/prism/coffeescript';
import handlebars from 'react-syntax-highlighter/dist/esm/languages/prism/handlebars';
import pug from 'react-syntax-highlighter/dist/esm/languages/prism/pug';
import fsharp from 'react-syntax-highlighter/dist/esm/languages/prism/fsharp';
import lua from 'react-syntax-highlighter/dist/esm/languages/prism/lua';
import powershell from 'react-syntax-highlighter/dist/esm/languages/prism/powershell';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import ruby from 'react-syntax-highlighter/dist/esm/languages/prism/ruby';
import sass from 'react-syntax-highlighter/dist/esm/languages/prism/sass';
import r from 'react-syntax-highlighter/dist/esm/languages/prism/r';
import objectivec from 'react-syntax-highlighter/dist/esm/languages/prism/objectivec';


import {Link} from "@inertiajs/react";

SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('typescript', ts);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('less', less);
SyntaxHighlighter.registerLanguage('scss', scss);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('html', html);
SyntaxHighlighter.registerLanguage('xml', xml);
SyntaxHighlighter.registerLanguage('php', php);
SyntaxHighlighter.registerLanguage('csharp', csharp);
SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('razor', razor);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('vb', vb);
SyntaxHighlighter.registerLanguage('coffeescript', coffeescript);
SyntaxHighlighter.registerLanguage('handlebars', handlebars);
SyntaxHighlighter.registerLanguage('pug', pug);
SyntaxHighlighter.registerLanguage('fsharp', fsharp);
SyntaxHighlighter.registerLanguage('lua', lua);
SyntaxHighlighter.registerLanguage('powershell', powershell);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('ruby', ruby);
SyntaxHighlighter.registerLanguage('sass', sass);
SyntaxHighlighter.registerLanguage('r', r);
SyntaxHighlighter.registerLanguage('objectivec', objectivec);

export default function CodeBlock({code}) {

    const onCopy = () => {
        Toast.fire({
            icon: "success",
            title: "Copied! Ready to paste."
        });
    }


    return (
        <div className="relative">
            <CopyButton text={code.sourceCode} onCopy={onCopy}/>

            <SyntaxHighlighter
                language={code.language.toLowerCase().replace('-', '')}
                style={vscDarkPlus}
                wrapLines={true}
                wrapLongLines={true}
                customStyle={{
                    background: '#1e1e1e',
                    borderRadius: '15px',
                    padding: '10px 70px 10px 15px',
                }}
            >
                {code.sourceCode}
            </SyntaxHighlighter>

            {
                isSupported(code.language) && <Tooltip title={'run code'}>
                    <Link method='post'
                          href={route('testing-ground', {language: code.language, sourceCode: code.sourceCode})}
                          as={'button'}
                          className=" absolute top-[4px] right-[40px]  z-10 text-white hover:scale-110 duration-300">
                        <Code/>
                    </Link>
                </Tooltip>
            }


        </div>

    );
}
