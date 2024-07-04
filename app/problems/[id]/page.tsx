'use client'


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useParams, useRouter} from 'next/navigation';

interface Problem {
    problem_id: string;
    name: string;
    problem_text: string;
    hints: string;
    solution: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: string;
    company: string | null;
    is_paid: boolean;
    created_at: string;
    updated_at: string;
    subcategory: string | null;
    answer: string;
}

export default function Page() {
    const router = useRouter();
    const { id: problem_id } = useParams()
    const [problem, setProblem] = useState<Problem | null>(null);
    const [showHint, setShowHint] = useState(false);
    const [showSolution, setShowSolution] = useState(false);
    const [userNotes, setUserNotes] = useState('');
    const [userAnswer, setUserAnswer] = useState('');
    const [activeTab, setActiveTab] = useState<'problem' | 'solution'>('problem');

    useEffect(() => {
        const fetchProblem = async () => {
            if (!problem_id) return;

            try {
                const response = await axios.get(`http://127.0.0.1:8000/problems/${problem_id}`);
                setProblem(response.data[0]);
            } catch (error) {
                console.error('Error fetching problem:', error);
            }
        };

        fetchProblem();
    }, [problem_id]);

    const difficultyColor = {
        Easy: 'bg-green-600',
        Medium: 'bg-yellow-600',
        Hard: 'bg-red-600'
    };

    if (!problem) {
        return <div className="text-white text-center mt-8">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-8">
            <h1 className="text-3xl font-bold mb-4">{problem.name}</h1>

            <div className="flex space-x-4 mb-4">
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${difficultyColor[problem.difficulty]}`}>
          {problem.difficulty}
        </span>
                {problem.company && (
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-600">
            {problem.company}
          </span>
                )}
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-purple-600">
          {problem.category}
        </span>
            </div>

            <div className="mb-8">
                <div className="flex mb-4">
                    <button
                        className={`px-4 py-2 ${activeTab === 'problem' ? 'bg-gray-700' : 'bg-gray-900'} hover:bg-gray-700 transition-colors duration-200`}
                        onClick={() => setActiveTab('problem')}
                    >
                        Problem
                    </button>
                    <button
                        className={`px-4 py-2 ${activeTab === 'solution' ? 'bg-gray-700' : 'bg-gray-900'} hover:bg-gray-700 transition-colors duration-200`}
                        onClick={() => setActiveTab('solution')}
                    >
                        Solution
                    </button>
                </div>

                {activeTab === 'problem' ? (
                    <>
                        <div className="bg-gray-900 p-6 rounded-lg mb-4">
                            <h2 className="text-xl font-semibold mb-2">Problem Description</h2>
                            <p>{problem.problem_text}</p>
                        </div>

                        {!showHint ? (
                            <button
                                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors duration-200"
                                onClick={() => setShowHint(true)}
                            >
                                Reveal Hint
                            </button>
                        ) : (
                            <div className="bg-gray-900 p-6 rounded-lg mb-4">
                                <h2 className="text-xl font-semibold mb-2">Hint</h2>
                                <p>{problem.hints}</p>
                            </div>
                        )}

                        <div className="mt-8">
                            <h2 className="text-xl font-semibold mb-2">Your Notes</h2>
                            <textarea
                                className="w-full h-32 bg-gray-900 text-white p-2 rounded"
                                value={userNotes}
                                onChange={(e) => setUserNotes(e.target.value)}
                                placeholder="Write your notes here..."
                            />
                        </div>

                        <div className="mt-8">
                            <h2 className="text-xl font-semibold mb-2">Your Answer</h2>
                            <textarea
                                className="w-full h-32 bg-gray-900 text-white p-2 rounded mb-4"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                placeholder="Enter your answer here..."
                            />
                            {userAnswer.trim() !== '' && (
                                <button
                                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors duration-200"
                                    onClick={() => alert('Answer submitted!')}
                                >
                                    Submit Answer
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="bg-gray-900 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-2">Solution</h2>
                        <p>{problem.solution}</p>
                    </div>
                )}
            </div>
        </div>
    );
};


