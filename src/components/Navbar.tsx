import React from 'react'
import {NavLink} from 'react-router-dom'

const Navbar: React.FC = () => (
    <nav>
        <div className='nav-wrapper brown darken-2 ph1'>
            <NavLink to='/' className='brand-logo'>
                Agenda
            </NavLink>
            <ul id='nav-mobile' className='right hide-on-med-and-down'>
                <li>
                    <NavLink to='/'>My tasks</NavLink>
                </li>
                <li>
                    <NavLink to='/about'>About</NavLink>
                </li>
            </ul>
        </div>
    </nav>
)

export default Navbar
