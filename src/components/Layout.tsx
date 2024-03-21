import React from 'react';
import { Link } from 'react-router-dom';
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div>
            <h1><h1>Boltadeildin version 123812099990</h1></h1>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Heim</Link>
                    </li>
                    <li>
                       <Link to="/yfirlit">Yfirlit</Link>
                    </li>
                    <li>
                      <Link to="/games/1">Leikur</Link>
                    </li>
                </ul>
            </nav>
            <main>{children}</main>
            <footer>
            </footer>
        </div>
    );
};

export default Layout;
