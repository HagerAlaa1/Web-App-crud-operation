import React from "react";
import { Link } from "react-router-dom";

export function Navbar () {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom py-3 mb-3 w-100 "style={{boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)'}} >
            <div className="container">
                <Link className="navbar-brand" to="/">Web App</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                    <Link className="nav-link text-dark p-3" aria-current="page" to="/">Home</Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-link text-dark p-3" to="/Products">Products</Link>
                    </li>
                </ul>
                </div>
            </div>
        </nav>
    )
}

export function Footer () {
    return (
        <footer>
            <div className="container p-3 mt-5 border-top text-center">
                <small className="d-block text-muted text-center">&copy; 2025, Web App .</small>
            </div>
        </footer>
    )
}