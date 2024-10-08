import audioLocation from "../../assets/audio/notification.mp3"
import Swal from "sweetalert2"; // Import SweetAlert for notifications
import {router} from "@inertiajs/react";
import {User} from "@/types";
import {LANGUAGE_VERSIONS} from "@/exucuteCode/constants";


export const getLevel = (xp: number) => {
    return Math.min(100, Math.floor(xp / 1000));
}

export const BACKGROUND_GRADIENT = "bg-gradient-to-tr from-indigo-600  to-purple-500";
export const buttonStyle = `p-0.5 rounded-3xl ${BACKGROUND_GRADIENT}`;
export const spanStyle = 'block text-black px-4 py-2 font-semibold rounded-3xl bg-white hover:bg-transparent hover:text-white transition'


export const audio = new Audio(audioLocation);

export const iconStyle = 'text-white hover:scale-105 transition-transform duration-200';

export const languages = [
    {name: "JavaScript", value: "const greet = () => console.log('Hello, world! JavaScript');\ngreet();"},
    {name: "TypeScript", value: "const greet = ():void => console.log('Hello, world! TypeScript');\ngreet();"},

    {
        name: "CSS",
        value: "body { background-color: #f0f0f0; }\nbody::after { content: 'Hello, world! CSS'; display: block; }"
    },
    {
        name: "LESS",
        value: "@primary-color: #4CAF50; .header { color: @primary-color; }\n.header::after { content: 'Hello, world! LESS'; }"
    },
    {
        name: "SCSS",
        value: "$primary-color: #4CAF50; .header { color: $primary-color; }\n.header::after { content: 'Hello, world! SCSS'; }"
    },
    {name: "JSON", value: "{ \"message\": \"Hello, world! JSON\", \"name\": \"John\", \"age\": 30 }"},
    {name: "HTML", value: "<div>Hello, world! HTML</div>"},
    {name: "XML", value: "<message>Hello, world! XML</message>"},
    {name: "PHP", value: "<?php echo 'Hello, world! PHP'; ?>"},
    {
        name: "CSharp",
        value: "using System;\nclass Program {\n    static void Main() {\n        Console.WriteLine(\"Hello, world! CSharp\");\n    }\n}"
    },
    {
        name: "CPP",
        value: "#include <iostream>\nint main() {\n    std::cout << \"Hello, world! CPP\" << std::endl;\n    return 0;\n}"
    },
    {name: "Razor", value: "@{ var message = \"Hello, world! Razor\"; }<p>@message</p>"},
    {name: "Markdown", value: "# Hello, world! Markdown"},
    {
        name: "Java",
        value: "public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, world! Java\");\n    }\n}"
    },
    {
        name: "VB",
        value: "Module Module1\n    Sub Main()\n        Console.WriteLine(\"Hello, world! VB\")\n    End Sub\nEnd Module"
    },
    {name: "CoffeeScript", value: "greet = -> console.log 'Hello, world! CoffeeScript'\ngreet()"},
    {name: "Handlebars", value: "{{greet 'world Handlebars'}}"},
    {name: "Pug", value: "p Hello, world! Pug"},
    {name: "FSharp", value: "printfn \"Hello, world! FSharp\""},
    {name: "Lua", value: "print('Hello, world! Lua')"},
    {name: "Powershell", value: "Write-Output 'Hello, world! Powershell'"},
    {name: "Python", value: "print('Hello, world! Python')"},
    {name: "Ruby", value: "puts 'Hello, world! Ruby'"},
    {
        name: "SASS",
        value: "$primary-color: #4CAF50; .header { color: $primary-color; }\n.header::after { content: 'Hello, world! SASS'; }"
    },
    {name: "R", value: "print('Hello, world! R')"},
    {name: "Bash", value: "echo \"Hello, world! Bash\""},

    {
        name: "Objective-C",
        value: "#import <Foundation/Foundation.h>\nint main() {\n    @autoreleasepool {\n        NSLog(@\"Hello, world! Objective-C\");\n    }\n    return 0;\n}"
    }
];


export const isSupported = (language: string) => !!LANGUAGE_VERSIONS[language.toLowerCase()];
export const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

export function handleUnblock(user: User) {

    Swal.fire({
        title: "Are you sure?",
        text: `You will unblock ${user.name}!`,
        icon: "warning",
        imageUrl: user.profile_image ?? null,
        imageHeight: 150,
        imageAlt: `${user.name} profile image`,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, im sure!"
    }).then((result: any) => {
        if (result.isConfirmed) {
            router.patch(route('friend.unblock', {'friend': user.id}), {}, {
                onSuccess: () => {
                    Toast.fire({
                        icon: "success",
                        title: "Friend was unblocked Successfully"
                    });
                },
                onError: (errors) => {
                    Toast.fire({
                        icon: "error",
                        title: `${errors.message}`
                    });
                }
            });
        }
    })


}

export enum dataType {
    Users = 1,
    Friends,
    pulses,
}


export const inputStyle = "shadow appearance-none  rounded w-full p-3 text-gray-700 leading-tight focus:ring  duration-300 ease-in-out";


