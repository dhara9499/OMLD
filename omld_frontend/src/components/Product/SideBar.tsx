import React from 'react';

const Sidebar = ({ sections, onSectionClick, completedSections }) => {
  return (
    <aside
      className="absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-gray duration-300 ease-linear border-r lg:static lg:translate-x-0 translate-x-0"
    >
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              Product Information
            </h3>
            <ul className="mb-6 flex flex-col gap-1.5">
              {sections.map((section, index) => (
                <li
                  key={index}
                  className={`p-4 cursor-pointer hover:bg-gray-700 `}
                  // ${index !== 0 && !completedSections[index - 1] ? 'opacity-50 cursor-not-allowed' : ''
                  //   }`}
                  onClick={() => {
                    // if (index === 0 || completedSections[index - 1]) {
                    onSectionClick(index);
                    // }
                  }}
                >
                  {section}
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
