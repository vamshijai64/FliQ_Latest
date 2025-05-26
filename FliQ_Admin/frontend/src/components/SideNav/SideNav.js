import styles from './SideNav.module.scss';
import { Link } from 'react-router-dom';
import { PiHashStraightDuotone } from "react-icons/pi";
import { SlBulb } from "react-icons/sl";
import { MdOutlineLocalMovies, MdMovieEdit } from "react-icons/md";
import { GiVerticalBanner } from "react-icons/gi";
import { useEffect, useState } from 'react';
import logo from './Group62.png';
import { useLocation } from 'react-router-dom';

function SideMenu({ isOpen, toggleSidebar }) {
    const [sidebarClass, setSidebarClass] = useState('');
    const location = useLocation();

    useEffect(() => {
        setSidebarClass(isOpen ? styles.open : '');
    }, [isOpen]);

    return (
        <>
            <button className={styles.hamburgerMenu} onClick={toggleSidebar}>
                ☰
            </button>

            <div className={`${styles.sidemenu} ${sidebarClass}`}>
                <div className={styles.logoContainer}>
                    <img src={logo} alt="logo" width="60" height="60" />
                    <h2>FliQ</h2>
                </div>
                
                <nav>
                    <p className={location.pathname.includes('/categories') ? styles.active : ''}>
                        <Link to='/home/categories'><PiHashStraightDuotone /><span>Categories</span></Link>
                    </p>
                    {/* <p><Link to='questions'><SlBulb /><span>Questions</span></Link></p>
                    <p><Link to='news'><MdMovieEdit /><span>Movie News</span></Link></p>
                    <p><Link to='reviews'><MdOutlineLocalMovies /><span>Movie Reviews</span></Link></p>
                    <p><Link to='banners'><GiVerticalBanner /><span>Banners</span></Link></p>  */}

                    <p className={location.pathname.includes('/questions') ? styles.active : ''}>
                        <Link to="/home/questions"><SlBulb /><span>Questions</span></Link>
                    </p>

                    <p className={location.pathname.includes('/news') ? styles.active : ''}>
                        <Link to="/home/news"><MdMovieEdit /><span>Movie News</span></Link>
                    </p>

                    <p className={location.pathname.includes('/reviews') ? styles.active : ''}>
                        <Link to="/home/reviews"><MdOutlineLocalMovies /><span>Movie Reviews</span></Link>
                    </p>

                    <p className={location.pathname.includes('/banners') ? styles.active : ''}>
                        <Link to="/home/banners"><GiVerticalBanner /><span>Banners</span></Link>
                    </p>
 
                </nav>
            </div>
        </>
    );
}

export default SideMenu;
