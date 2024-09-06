import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/Components/ui/card"
import InputLabel from "@/Components/formComp/InputLabel";
import TextInput from "@/Components/formComp/TextInput";
import {useForm} from "@inertiajs/react";
import {FormEvent, useMemo} from "react";
import {DatePicker} from "@/Components/ui/DatePicker";
import {Checkbox} from "@/Components/ui/checkbox";
import {Button, Stack} from "@mui/material";
import {EditIcon,} from "lucide-react";
import InputError from "@/Components/formComp/InputError";
import AddIcon from "@mui/icons-material/Add";
import {Toast} from "@/utils";

interface ProfileCardProps {
    type: {
        title: string;
        firstField: string;
        secondField: string;
        thirdField: string;
    };
    object: any;
    setOpen: Function;
}

const ProfileCard: React.FC<ProfileCardProps> = ({type, object, setOpen}) => {

    const initialValues = useMemo(() => ({
        [type.firstField]: object?.[type.firstField] || "",
        [type.secondField]: object?.[type.secondField] || "",
        [type.thirdField]: object?.[type.thirdField] || "",
        from: object?.from || null,
        to: object?.to || null,
        current: object?.current === 1 || false,
    }), [object, type]);

    const {data, setData, post, patch, errors} = useForm(initialValues);


    const onSubmit = (e: FormEvent) => {
        e.preventDefault();

        const request = object
            ? patch(`/profiles/${type.title.toLowerCase()}/${object.id}`, {
                onSuccess: () => {
                    Toast.fire({
                        icon: "success",
                        title: `${type.title} detail Updated successfully`
                    });
                    setOpen(false);
                }
            })
            : post(`/profiles/${type.title.toLowerCase()}`, {
                onSuccess: () => {
                    Toast.fire({
                        icon: "success",
                        title: `${type.title} detail Added successfully`
                    });
                    setOpen(false);
                }
            });
    };

    return (
        <form onSubmit={onSubmit}>
            <Card className="text-white rounded-lg">
                <CardHeader>
                    <CardTitle>Add {type.title}</CardTitle>
                    <CardDescription>*= required field</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid w-full items-center gap-4">
                        {[type.firstField, type.secondField, type.thirdField].map(field => (
                            <div key={field} className="flex flex-col space-y-1.5">
                                <InputLabel htmlFor={field}>{field}</InputLabel>
                                <TextInput
                                    name={field}
                                    value={data[field]}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData(e.target.name, e.target.value)}
                                    placeholder={field}
                                />
                                <InputError message={errors[field]} className="mt-2"/>
                            </div>
                        ))}
                        <Stack direction="column" alignItems="start" gap={2}>
                            <InputLabel htmlFor="from">From Date</InputLabel>
                            <DatePicker id="from" value={data.from}
                                        onDateChange={(date: Date) => setData('from', date)}/>
                            <Stack className="pl-4" direction="row" gap={1}>
                                <Checkbox checked={data.current}
                                          onCheckedChange={(checked: boolean) => setData('current', checked)}/>
                                <InputLabel htmlFor="current">Current</InputLabel>
                            </Stack>
                            <InputLabel htmlFor="to">To Date</InputLabel>
                            <DatePicker id="to" value={data.to} onDateChange={(date: Date) => setData('to', date)}/>
                            <InputError message={errors.from} className="mt-2"/>
                            <InputError message={errors.to} className="mt-2"/>
                        </Stack>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button type="submit" variant={"outlined"} className='!text-white !border-white'
                            endIcon={object ? <EditIcon/> : <AddIcon/>}>
                        {object ? "Update" : "Add"}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
};

export default ProfileCard;
