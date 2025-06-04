import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to Story Bank</h1>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ margin: '10px 0' }}>
            <Link to="/search">Search Stories</Link>
          </li>
          <li style={{ margin: '10px 0' }}>
            <Link to="/create">Create New Story</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default HomePage; 