import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface Problem {
    problem_id: string;
    name: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: string;
    bookmarked: boolean;
}

const categorys = ['Probability', 'Statistics', 'Maths', 'Calculas'];
const difficulties = ['Easy', 'Medium', 'Hard'];

const ProblemTable: React.FC = () => {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
    const [filters, setFilters] = useState({
        difficulty: [] as string[],
        category: [] as string[]
    });
    const [sortField, setSortField] = useState<keyof Problem>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [activeFilter, setActiveFilter] = useState<'difficulty' | 'category' | null>(null);

    const filterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/problems');
                setProblems(response.data);
                setFilteredProblems(response.data);
            } catch (error) {
                console.error('Error fetching problems:', error);
            }
        };

        fetchProblems();
    }, []);

    useEffect(() => {
        const filtered = problems.filter(problem =>
            (filters.difficulty.length === 0 || filters.difficulty.includes(problem.difficulty)) &&
            (filters.category.length === 0 || filters.category.includes(problem.category))
        );
        const sorted = [...filtered].sort((a, b) => {
            if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
            if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredProblems(sorted);
    }, [filters, problems, sortField, sortOrder]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setActiveFilter(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleBookmark = (problem_id: string) => {
        const updatedProblems = problems.map(p =>
            p.problem_id === problem_id ? { ...p, bookmarked: !p.bookmarked } : p
        );
        setProblems(updatedProblems);
    };

    const handleSort = (field: keyof Problem) => {
        setSortOrder(sortField === field && sortOrder === 'asc' ? 'desc' : 'asc');
        setSortField(field);
    };

    const toggleFilter = (filter: 'difficulty' | 'category') => {
        setActiveFilter(activeFilter === filter ? null : filter);
    };

    const handleFilterChange = (field: 'difficulty' | 'category', value: string) => {
        setFilters(prevFilters => {
            const updatedFilter = prevFilters[field].includes(value)
                ? prevFilters[field].filter(item => item !== value)
                : [...prevFilters[field], value];
            return { ...prevFilters, [field]: updatedFilter };
        });
    };

    const difficultyColor = {
        Easy: 'bg-green-600',
        Medium: 'bg-yellow-600',
        Hard: 'bg-red-600'
    };

    const FilterDropdown: React.FC<{ options: string[], field: 'difficulty' | 'category' }> = ({ options, field }) => (
        <div className="absolute z-10 mt-1 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                {options.map(option => (
                    <label key={option} className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                        <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                            checked={filters[field].includes(option)}
                            onChange={() => handleFilterChange(field, option)}
                        />
                        <span className="ml-2">{option}</span>
                    </label>
                ))}
            </div>
        </div>
    );

    const SortableHeader: React.FC<{ field: keyof Problem, children: React.ReactNode, filterable?: boolean }> = ({ field, children, filterable }) => (
        <th className="p-3 text-left">
            <div className="flex items-center">
                <button
                    onClick={() => handleSort(field)}
                    className="flex items-center hover:text-blue-400 transition-colors duration-200"
                >
                    {children}
                    {sortField === field && (
                        <span className="ml-1">
              {sortOrder === 'asc' ? '↑' : '↓'}
            </span>
                    )}
                </button>
                {filterable && (
                    <button
                        onClick={() => toggleFilter(field as 'difficulty' | 'category')}
                        className="ml-2 text-gray-400 hover:text-white transition-colors duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                    </button>
                )}
            </div>
            {filterable && activeFilter === field && (
                <div ref={filterRef}>
                    <FilterDropdown options={field === 'difficulty' ? difficulties : categorys} field={field as 'difficulty' | 'category'} />
                </div>
            )}
        </th>
    );

    return (
        <div className="p-4 bg-neutral-950 dark:bg-grid-white/[0.05] min-h-screen text-white">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="bg-gray-800">
                        <SortableHeader field="name">Name</SortableHeader>
                        <SortableHeader field="difficulty" filterable>Difficulty</SortableHeader>
                        <SortableHeader field="category" filterable>Topic</SortableHeader>
                        <th className="p-3 text-center">Bookmark</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredProblems.map((problem) => (
                        <tr key={problem.problem_id} className="border-t border-gray-700 hover:bg-gray-800 transition-colors duration-200">
                            <td className="p-3">
                                <a
                                    href={`http://localhost:3000/problems/${problem.problem_id}`}
                                    className="text-white hover:text-blue-400 transition-colors duration-200"
                                >
                                    {problem.name}
                                </a>
                            </td>
                            <td className="p-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${difficultyColor[problem.difficulty]}`}>
                    {problem.difficulty}
                  </span>
                            </td>
                            <td className="p-3">{problem.category}</td>
                            <td className="p-3 text-center">
                                <button
                                    onClick={() => toggleBookmark(problem.problem_id)}
                                    className={`focus:outline-none ${problem.bookmarked ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-400 transition-colors duration-200`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProblemTable;