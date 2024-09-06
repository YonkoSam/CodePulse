import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Autocomplete, CircularProgress, TextField} from '@mui/material';

const CountrySelector = ({onChange, defaultCountry}) => {
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(defaultCountry);

    useEffect(() => {
        const fetchCountries = async () => {
            setLoading(true);
            try {
                const cachedCountries = localStorage.getItem('countries');
                if (cachedCountries) {
                    setCountries(JSON.parse(cachedCountries));
                } else {
                    const response = await axios.get('https://restcountries.com/v3.1/all?fields=name');

                    const countryNames = response.data.map((country: {
                        name: { common: string; };
                    }) => country.name.common)
                        .filter((countryName: string) => countryName !== 'Israel');
                    setCountries(countryNames);
                    localStorage.setItem('countries', JSON.stringify(countryNames));
                }
            } catch (error) {
                console.error("Error fetching countries:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCountries();
    }, []);

    const handleCountryChange = (event, value) => {
        setSelectedCountry(value);
        onChange(value);
    };

    return (
        <Autocomplete
            value={selectedCountry}
            onChange={handleCountryChange}
            options={countries}
            className='!rounded-3xl'
            getOptionLabel={(option) => option}
            loading={loading}
            renderInput={(params) => (
                <TextField
                    className='bg-gray-800 rounded-xl !p-1'
                    {...params}
                    sx={{
                        '& .MuiInputBase-root': {
                            color: 'white',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: '0',
                        },
                    }}

                    placeholder='Country'
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={20}/> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
};

export default CountrySelector;
