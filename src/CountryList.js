import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const CountryList = () => {
  const [countries, setCountries] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [regionFilters, setRegionFilters] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [countriesPerPage] = useState(10);

  useEffect(() => {
    axios.get('https://restcountries.com/v2/all?fields=name,region,area')
      .then(response => {
        setCountries(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    let filtered = countries;
      if (regionFilters !== '') {
        filtered = filtered.filter(country => country.region === regionFilters);
      }
      if (sortOption === 'smaller_than_lthn') {
        filtered = filtered.filter(country => country.area < 65300);
      }
      setFilteredCountries(filtered);
  }, [countries, sortOption, regionFilters]);

  const handleSortChange = event => {
    setSortOption(event.target.value);
  }

  const handleRegionChange = event => {
    setRegionFilters(event.target.value);
  }

  const sortOptions = [
    { value: '', label: 'Sort by'},
    { value: 'name_asc', label: 'Name (A-Z)' },
    { value: 'name_desc', label: 'Name (Z-A)' },
    { value: 'region_asc', label: 'Region (A-Z)' },
    { value: 'region_desc', label: 'Region (Z-A)' },
    { value: 'area_asc', label: 'Area (smallest to largest)' },
    { value: 'area_desc', label: 'Area (largest to smallest)' },
    { value: 'smaller_than_lthn', label: 'Countries smaller than Lithuania'},
  ];

  const regions = [
    {value: '', label:'All regions'},
    {value: 'Africa', label:'Africa'},
    {value: 'Americas', label:'Americas'},
    {value: 'Asia', label:'Asia'},
    {value: 'Europe', label:'Europe'},
    {value: 'Oceania', label:'Oceania'},
  ]

  const getSortOrder = sortOption => {
    if (sortOption.endsWith('_asc')) {
      return 'asc';
    } else if (sortOption.endsWith('_desc')) {
      return 'desc';
    } else {
      return '';
    }
  };

  const getSortColumn = sortOption => {
    if (sortOption.startsWith('name')) {
      return 'name';
    } else if (sortOption.startsWith('region')) {
      return 'region';
    } else if (sortOption.startsWith('area')) {
      return 'area';
    } else {
      return '';
    }
  };

  const sortedCountries = [...filteredCountries].sort((a, b) => {
    if (sortOption === 'smaller_than_lthn') {
      if (a.area < 65300 && b.area < 65300) {
        return a.area - b.area;
      }
    } else {
      const columnA = a[getSortColumn(sortOption)];
      const columnB = b[getSortColumn(sortOption)];
      if (getSortOrder(sortOption) === 'asc') {
        return columnA < columnB ? -1 : 1;
      } else {
        return columnA > columnB ? -1 : 1;        
      }
    }
  });
  



  

  const indexOfLastCountry = currentPage * countriesPerPage;
  const indexOfFirstCountry = indexOfLastCountry - countriesPerPage;
  const currentCountries = sortedCountries.slice(
    indexOfFirstCountry,
    indexOfLastCountry
  );
  
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(sortedCountries.length / countriesPerPage); i++) {
    pageNumbers.push(i)
  }

  const MAX_PAGES = 4;
  
  return (
    <div className='table-wrapper'>
    <div>
      <h1>Country List</h1>

      <div className='sort-dropdown'>
        <select value={sortOption} onChange={handleSortChange}>
          {sortOptions.map(option => (
            <option key = {option.value} value = {option.value}>
              {option.label}
            </option>
          ))}
        </select>


        <select onChange={handleRegionChange} value={regionFilters}>
          {regions.map(option => (
            <option key = {option.value} value = {option.value}>{option.label}</option>
          ))}

        </select>



      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Region</th>
            <th>Area</th>
          </tr>
        </thead>
        
        <tbody>
          {currentCountries.map(country => (
            <tr key={country.name}>
              <td>{country.name}</td>
              <td>{country.region}</td>
              <td>{country.area}</td>
            </tr>
          ))}
        </tbody>
      </table>


    <div className="pagination">

    <button
      disabled = {currentPage === 1}
      onClick = {() => setCurrentPage(currentPage - 1)}
    >
      {"<"}
    </button>

    {pageNumbers.map((number) => {
      let lowerLimit, upperLimit;

      if (pageNumbers.length <= MAX_PAGES) {
        lowerLimit = 1;
        upperLimit = pageNumbers.length;
      } else {
        lowerLimit = Math.max(1, currentPage - Math.floor(MAX_PAGES / 2));
        upperLimit = Math.min(pageNumbers.length, lowerLimit + MAX_PAGES - 1);
      }

      if (number === 1 || number === pageNumbers || (number >= lowerLimit && number <= upperLimit)) {
        return(
          <button
            key = {number}
            className = {currentPage === number ? "active" : ""}
            onClick = {() => setCurrentPage(number)}
          >
            {number}
          </button>
        );
      }else if (number === lowerLimit -1 || number === upperLimit + 1 ){

      }else {
        return null;
      }
    })}

    <button
      disabled = {currentPage === pageNumbers[pageNumbers.length - 1]}
      onClick={() => setCurrentPage(currentPage + 1)}
    >
      {">"}
    </button>
    
    </div>
  </div>
</div>
  );
};


export default CountryList;