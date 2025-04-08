import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sections, onSectionClick }) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );


  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className="absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-gray duration-300 ease-linear border-r lg:static lg:translate-x-0 translate-x-0"
    >
    <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
    {/* <!-- Sidebar Menu --> */}
    <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
      {/* <!-- Menu Group --> */}
      <div>
        <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
          Product Information
        </h3>
        <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Dashboard --> */}

              {sections.map((section, index) => (
          <li
            key={index}
            className="p-4 cursor-pointer hover:bg-gray-700"
            onClick={() => onSectionClick(index)}
          >
            {section}
          </li>
        ))}
                    {/* <NavLink
                    to="#"
                    className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                      (pathname === '/' ||
                        pathname.includes('dashboard')) &&
                      'bg-graydark dark:bg-meta-4'
                    }`}
                    
                  >
                    General
                  </NavLink>
                  <NavLink
                    to="#"
                    className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                      (pathname === '/' ||
                        pathname.includes('dashboard')) &&
                      'bg-graydark dark:bg-meta-4'
                    }`}
                    
                  >
                    Categories
                  </NavLink>

                  <NavLink
                    to="#"
                    className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                      (pathname === '/' ||
                        pathname.includes('dashboard')) &&
                      'bg-graydark dark:bg-meta-4'
                    }`}
                    
                  >
                    Attributes
                  </NavLink> */}
                
                </ul>
        </div>
        </nav>
        </div>
        </aside>
  )
};

export default Sidebar;
