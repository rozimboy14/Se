import { getOrders } from "../api/axios";

function OrderAutocomplete({ value, onChange }) {
  const [searchText, setSearchText] = useState("");
  const [orders, setOrders] = useState([]);
  const debouncedSearch = useDebounce(searchText, 500);

  useEffect(() => {
    if (!debouncedSearch?.trim()) return;
    getOrders({ search: debouncedSearch, page_size: 20 })
      .then(res => setOrders(res.data.results))
      .catch(console.error);
  }, [debouncedSearch]);

  return (
    <Autocomplete
      options={orders}
      getOptionLabel={(option) => option.full_name || ""}
      isOptionEqualToValue={(option, value) => option.id === value?.id}
      value={value || null}
      onChange={(e, newValue) => onChange(newValue)}
      onInputChange={(e, newValue) => setSearchText(newValue)}
      renderInput={(params) => <TextField {...params} label="Model tanlang" size="small" />}
    />
  );
}
