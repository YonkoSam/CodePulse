import * as React from "react";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {CopyAll} from "@mui/icons-material";

type Props = {
    text: string;
    onCopy?: () => void;
};

function CopyButton({text, onCopy}: Props) {
    return (
        <button
            className=" absolute cursor-pointer top-[4px] right-[10px]  z-10 text-white hover:scale-110 duration-300">
            <CopyToClipboard text={text} onCopy={onCopy}>
                <CopyAll/>
            </CopyToClipboard>
        </button>
    );
}

export default CopyButton;
