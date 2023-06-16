import { useState, useEffect, useCallback } from "react";

import Axios from "../Axios";

const Countries = () => {

  const [data, setData] = useState({});

  const [params, setParams] = useState({ country: "India" });

  const [countries, setCountries] = useState([]);

  const [expandedContinents, setExpandedContinents] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [searchedCountry, setSearchedCountry] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const countriesPerPage = 40;

  const getHistory = useCallback(async (params) => {

    try {

      const res = await Axios.get("history", { params });

      setData(res.data);

    } catch (error) {

      console.log(error);

    }

  }, []);

  const getCountries = useCallback(async () => {

    try {

      const res = await Axios.get("countries");

      setCountries(res.data.response);

    } catch (error) {

      console.log(error);

    }

  }, []);

  useEffect(() => {

    getHistory(params).catch((error) => {

      console.log(error);

    });

  }, [getHistory, params]);

  useEffect(() => {

    getCountries().catch((error) => {

      console.log(error);

    });

  }, [getCountries]);

  const handleContinentToggle = async (country) => {

    if (expandedContinents.includes(country)) {

      setExpandedContinents((prevExpanded) =>

        prevExpanded.filter((item) => item !== country)

      );

    } else {

      setExpandedContinents((prevExpanded) => [...prevExpanded, country]);

      try {

        const res = await Axios.get("history", { params: { country } });

        setData((prevData) => ({ ...prevData, [country]: res.data }));

      } catch (error) {

        console.log(error);

      }

    }

  };

  const handleSearch = (event) => {

    const searchTerm = event.target.value.toLowerCase();

    setSearchTerm(searchTerm);

    if (searchTerm === "") {

      setSearchedCountry(null);

    } else {

      const searchedCountry = countries.find((country) =>

        country.toLowerCase().includes(searchTerm)

      );

      setSearchedCountry(searchedCountry);

    }

  };

  const indexOfLastCountry = currentPage * countriesPerPage;

  const indexOfFirstCountry = indexOfLastCountry - countriesPerPage;

  const currentCountries = countries.slice(

    indexOfFirstCountry,

    indexOfLastCountry

  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (

    <div className="container mx-auto px-4 py-8">

      <h1 className="text-2xl font-bold text-center mb-4">COVID-19 Tracker</h1>

      <div className="flex justify-center">

        <div className="relative mb-10">

          <input

            type="text"

            placeholder="Search by country"

            value={searchTerm}

            onChange={handleSearch}

            className="p-2 pl-10 pr-4 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"

          />

          <svg

            xmlns="http://www.w3.org/2000/svg"

            className="h-5 w-5 absolute top-2 left-3 text-gray-400"

            viewBox="0 0 20 20"

            fill="currentColor"

          >

            <path

              fillRule="evenodd"

              d="M8 15a7 7 0 100-14 7 7 0 000 14zm7.707-2.293l-3.01-3.01a4.5 4.5 0 10-1.414 1.414l3.01 3.01a1 1 0 101.414-1.414z"

              clipRule="evenodd"

            />

          </svg>

        </div>

      </div>

      {searchedCountry ? (

        <div className="mb-4 p-4 border border-gray-300 rounded">

          <h2 className="text-xl font-bold mb-2">{searchedCountry}</h2>

          <p>Population: {data?.[searchedCountry]?.response?.[0]?.population}</p>

          <p>Total Covid Cases: {data?.[searchedCountry]?.response?.[0]?.cases?.total}</p>

        </div>

      ) : (

        <div className="grid gap-3 justify-center sm:grid-cols-2 lg:grid-cols-3">

        {currentCountries.map((country, index) => (

          <div key={index} className="mb-4">

            <div className="flex flex-wrap">

              <button

                onClick={() => handleContinentToggle(country)}

                className="bg-blue-500 text-white px-2 py-1 rounded"

              >

                {expandedContinents.includes(country) ? "-" : "+"}

              </button>

              <h2 className="text-xl font-bold mt-2 px-3">{country}</h2>

            </div>

            {expandedContinents.includes(country) && (

              <table className="mt-2 w-full border-collapse py-5">

                <thead>

                  <tr>

                    <th className="px-4 py-2 border">Country</th>

                    <th className="px-4 py-2 border">Population</th>

                    <th className="px-4 py-2 border">Total Covid Cases</th>

                  </tr>

                </thead>

                <tbody>

                  {data?.[country]?.response?.slice(0, 1).map((item, index) => (

                    <tr key={index}>

                      <td className="border px-4 py-2">{item.country}</td>

                      <td className="border px-4 py-2">{item.population}</td>

                      <td className="border px-4 py-2">{item.cases.total}</td>

                    </tr>

                  ))}

                </tbody>

              </table>

            )}

          </div>

        ))}

      </div>

      

      )}

      <div className="flex justify-center mt-4">

        {countries.length > countriesPerPage && (

          <div className="flex items-center">

            {Array.from(

              { length: Math.ceil(countries.length / countriesPerPage) },

              (_, index) => (

                <button

                  key={index}

                  onClick={() => paginate(index + 1)}

                  className={`mx-1 px-3 py-1 rounded-lg ${

                    currentPage === index + 1

                      ? "bg-blue-500 text-white"

                      : "bg-white text-gray-500 hover:bg-gray-200"

                  }`}

                >

                  {index + 1}

                </button>

              )

            )}

          </div>

        )}

      </div>

    </div>

  );

};

export default Countries;
