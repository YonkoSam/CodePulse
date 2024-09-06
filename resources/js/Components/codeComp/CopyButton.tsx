import * as React from "react";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {CopyAll} from "@mui/icons-material";
import {Tooltip} from "@mui/material";

type Props = {
    text: string;
    onCopy?: () => void;
};

function CopyButton({text, onCopy}: Props) {
    return (
        <Tooltip title="copy code">
            <button
                className="bg-gray-700 hover:bg-gray-600 text-white p-1 rounded"
            >
                <CopyToClipboard text={text} onCopy={onCopy}>
                    <CopyAll fontSize="small"/>
                </CopyToClipboard>
            </button>
        </Tooltip>
    );
}

export default CopyButton;
