import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const sampleData = [ //This is for test purposes only
        {id: 1, name: 'Manny', age: 25, occupation: 'Data Analyst'},
        {id: 2, name: 'Sarah', age: 30, occupation: 'Software Engineer'},
        {id: 3, name: 'Jake', age: 22, occupation: 'Graphic Designer'},
        {id: 4, name: 'Emily', age: 28, occupation: 'Product Manager'},
        {id: 5, name: 'David', age: 35, occupation: 'Marketing Specialist'},
        {id: 6, name: 'Olivia', age: 26, occupation: 'Content Writer'},
        {id: 7, name: 'James', age: 40, occupation: 'Financial Analyst'},
        {id: 8, name: 'Sophia', age: 24, occupation: 'UI/UX Designer'},
        {id: 9, name: 'Daniel', age: 32, occupation: 'DevOps Engineer'},
        {id: 10, name: 'Grace', age: 27, occupation: 'Human Resources Manager'}
    ] ;

const DataTable = () => {
    return (
        <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#e0ecf8' }}>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Age</b></TableCell>
              <TableCell><b>Occupation</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sampleData.map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  '&:hover': {
                    backgroundColor: '#f1f9ff',
                    cursor: 'pointer'
                  },
                }}
              >
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.age}</TableCell>
                <TableCell>{row.occupation}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    ); 
};

export default DataTable;

/*
    const DataTable = () => { ... }     :   REACT ARROW FUNCTION COMPONENT, where DataRTable is the name of the component, = () => {} is the arrow function to define it, and returns a JSX to render the UI
    return ( ... )                      :   WHAT THE COMPONENT RENDERS ON-SCREEN
    <TableContainer component={Paper}>  :   TableContainer is a Material UI component that wraps a table with padding and scrolling; component={Paper} is a prop. uses MUI Paper component to giv it a card-like look... 
                                            You can define more props such like className="my-table" (CSS class), sx={{ maxHeight: 300 }} inline styling with Material-UI’s sx prop.
    {sampleData.map((row) => ( ... ))}  :   Loops through the sampleData array and returns a <TableRow> for each entry. map() is a JS array method. row is each item in sampleData.
    <TableCell>{row.id}</TableCell>...  :   Displays individual fields (id, name, age, occupation) from each data row.
    export default DataTable            :   Makes DataTable available to be imported and used in other files.


*/