import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

export default function Component(
    {
        id,
        value,
        setValue,
        config,
        options,
        classes = {
            container: "form-field",
            label: "form-label",
            select: "form-input"
        },
    }: {
        id: string,
        value: string,
        setValue: (child: any) => void,
        config?: { [key: string]: any },
        options: { value: string, label: string }[]
        classes?: { [key: string]: string },
    }) {


    const onChange = (event: any) => {
        setValue(event.target.value);
    }

    const buildOption = (option: { value: string, label: string }) => {
        console.log("Building option:", option);
        return (<MenuItem key={option.value} className={classes.field} value={option.value}>{option.label}</MenuItem>)
    }

    return (
        <div className={classes.container}>
            <FormControl fullWidth>
                <label className={classes.label}>Custom Select:</label>
                <Select
                    id={id}
                    className={classes.select}
                    value={value}
                    onChange={onChange}
                >
                    <MenuItem value="">None</MenuItem>
                    {options && options.map((option) => buildOption(option))}
                </Select>
            </FormControl>
        </div>
    )

}