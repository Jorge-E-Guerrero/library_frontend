import SearchIcon from '@mui/icons-material/Search';

export default function Search({ value, onInput }: { value: string, onInput: (value: string) => void }) {

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        event.stopPropagation();
        onInput(event.target.value);
    }

    return (
        <div className="search-container">
            <SearchIcon className="search-icon" />
            <input
                type="text"
                placeholder="Search..."
                value={value}
                onChange={handleChange}
                className="search-input"
            />
        </div>
    )
}