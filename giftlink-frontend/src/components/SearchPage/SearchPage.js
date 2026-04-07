// Correct single import at the top
import React, { useState, useEffect } from "react";
import { useAppContext } from '../../context/AuthContext';
import { urlConfig } from '../../config';
import { useNavigate } from 'react-router-dom';
//import './Navbar.css';

function SearchPage() {
    const navigate = useNavigate();

    // Task 1: State variables
    const [searchQuery, setSearchQuery] = useState('');
    const [ageRange, setAgeRange] = useState(6);
    const [searchResults, setSearchResults] = useState([]);

    // Static dropdown data (lab-acceptable approach)
    const categories = ['Kitchen', 'Living Room', 'Office', 'Bedroom'];
    const conditions = ['New', 'Like New', 'Older'];

    // Task 2: Fetch search results
    const handleSearch = async () => {
        const baseUrl = `${urlConfig.backendUrl}/api/search?`;

        const queryParams = new URLSearchParams({
            name: searchQuery,
            age_years: ageRange,
            category: document.getElementById('categorySelect').value,
            condition: document.getElementById('conditionSelect').value,
        }).toString();

        try {
            const response = await fetch(`${baseUrl}${queryParams}`);
            if (!response.ok) {
                throw new Error('Search failed');
            }
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Failed to fetch search results:', error);
        }
    };

    // Task 6: Navigation to details page
    const goToDetailsPage = (productId) => {
        navigate(`/app/product/${productId}`);
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Search Gifts</h2>

            {/* Task 7: Text input */}
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Category Dropdown */}
            <label htmlFor="categorySelect">Category</label>
            <select id="categorySelect" className="form-control my-1">
                <option value="">All</option>
                {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                ))}
            </select>

            {/* Condition Dropdown */}
            <label htmlFor="conditionSelect">Condition</label>
            <select id="conditionSelect" className="form-control my-1">
                <option value="">All</option>
                {conditions.map(condition => (
                    <option key={condition} value={condition}>{condition}</option>
                ))}
            </select>

            {/* Task 4: Age Range Slider */}
            <label htmlFor="ageRange" className="mt-3">
                Less than {ageRange} years
            </label>
            <input
                type="range"
                className="form-control-range"
                id="ageRange"
                min="1"
                max="10"
                value={ageRange}
                onChange={e => setAgeRange(e.target.value)}
            />

            {/* Task 8: Search button */}
            <button
                className="btn btn-primary mt-3"
                onClick={handleSearch}
            >
                Search
            </button>

            {/* Task 5: Display results */}
            <div className="search-results mt-4">
                {searchResults.length > 0 ? (
                    searchResults.map(product => (
                        <div key={product.id} className="card mb-3">
                            {product.image && (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="card-img-top"
                                />
                            )}
                            <div className="card-body">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text">
                                    {product.description.slice(0, 100)}...
                                </p>
                            </div>
                            <div className="card-footer">
                                <button
                                    onClick={() => goToDetailsPage(product.id)}
                                    className="btn btn-primary"
                                >
                                    View More
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="alert alert-info" role="alert">
                        No products found. Please revise your filters.
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchPage;