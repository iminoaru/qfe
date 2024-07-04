'use client'

import React, { useState, useEffect } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';

export default function ProblemListDemo() {
    const [problems, setProblems] = useState([]);
    const [selectedProblems, setSelectedProblems] = useState([]);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        category: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        difficulty: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        star: { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(true);

    const difficulties = ['easy', 'medium', 'hard'];

    useEffect(() => {
        fetch('http://127.0.0.1:8000/problems')
            .then(response => response.json())
            .then(data => {
                setProblems(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching problems:', error);
                setLoading(false);
            });
    }, []);

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };

    const difficultyBodyTemplate = (rowData) => {
        return <Tag value={rowData.difficulty} severity={getDifficultySeverity(rowData.difficulty)} />;
    };

    const getDifficultySeverity = (difficulty) => {
        switch (difficulty) {
            case 'easy':
                return 'success';
            case 'medium':
                return 'warning';
            case 'hard':
                return 'danger';
            default:
                return null;
        }
    };

    const difficultyFilterTemplate = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={difficulties}
                onChange={(e) => options.filterCallback(e.value, options.index)}
                itemTemplate={difficultyItemTemplate}
                placeholder="Select Difficulty"
                className="p-column-filter"
                showClear
            />
        );
    };

    const difficultyItemTemplate = (option) => {
        return <Tag value={option} severity={getDifficultySeverity(option)} />;
    };

    const starBodyTemplate = (rowData) => {
        return <i className={`pi ${rowData.star ? 'pi-star-fill' : 'pi-star'}`} style={{ color: rowData.star ? 'gold' : 'grey' }}></i>;
    };

    const starFilterTemplate = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={[{label: 'Starred', value: true}, {label: 'Not Starred', value: false}]}
                onChange={(e) => options.filterCallback(e.value, options.index)}
                placeholder="Select Star Status"
                className="p-column-filter"
                showClear
            />
        );
    };

    const header = renderHeader();

    return (
        <div className="card">
            <DataTable
                value={problems}
                paginator
                header={header}
                rows={10}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                rowsPerPageOptions={[10, 25, 50]}
                dataKey="id"
                selectionMode="checkbox"
                selection={selectedProblems}
                onSelectionChange={(e) => setSelectedProblems(e.value)}
                filters={filters}
                filterDisplay="menu"
                loading={loading}
                globalFilterFields={['name', 'category', 'difficulty']}
                emptyMessage="No problems found."
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                <Column field="name" header="Name" sortable filter filterPlaceholder="Search by name" style={{ minWidth: '14rem' }} />
                <Column field="category" header="Category" sortable filter filterPlaceholder="Search by category" style={{ minWidth: '14rem' }} />
                <Column field="difficulty" header="Difficulty" sortable filterField="difficulty" showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }}
                        style={{ minWidth: '14rem' }} body={difficultyBodyTemplate} filter filterElement={difficultyFilterTemplate} />
                <Column field="star" header="Star" sortable dataType="boolean" bodyClassName="text-center" style={{ minWidth: '8rem' }} body={starBodyTemplate} filter filterElement={starFilterTemplate} />
            </DataTable>
        </div>
    );
}