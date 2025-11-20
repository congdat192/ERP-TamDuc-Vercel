import React from 'react';
import { DataProvider } from './contexts/DataContext';

const SimpleApp: React.FC = () => {
    return (
        <div style={{ padding: '40px', fontFamily: 'Arial' }}>
            <h1 style={{ color: '#3b82f6', marginBottom: '20px' }}>FinTrack - Simple Test</h1>
            <p>If you see this, DataProvider is working!</p>
            <div style={{ marginTop: '20px', padding: '15px', background: '#f0f0f0', borderRadius: '8px' }}>
                <strong>Status:</strong> App is rendering correctly
            </div>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <DataProvider>
            <SimpleApp />
        </DataProvider>
    );
};

export default App;
