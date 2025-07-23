
import React from 'react';
import EditableCell from './EditableCell';

const Doodle1: React.FC = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" className="hidden sm:block absolute top-0 right-full -mr-4 text-purple-300 opacity-80">
    <path d="M20,20 C40,80 80,40 80,80" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" />
  </svg>
);

const Doodle2: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 100 100" className="hidden sm:block absolute bottom-0 right-full -mr-2 text-pink-300 opacity-80">
        <path d="M20 80 Q 50 20 80 80" stroke="currentColor" strokeWidth="8" fill="none"/>
    </svg>
);

const Doodle3: React.FC = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" className="hidden sm:block absolute -top-1 left-full -ml-3 text-pink-300 opacity-90">
      <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m-1-12h2v2h-2v-2m0 4h2v6h-2v-6Z"/>
    </svg>
);

interface HeaderProps {
    title: string;
    onUpdateTitle: (newTitle: string) => void;
    primaryColor: string;
    textColor: string;
}

const Header: React.FC<HeaderProps> = ({ title, onUpdateTitle, primaryColor, textColor }) => {
  const headerTextStyle = "text-4xl sm:text-5xl font-extrabold tracking-tight";
  const inputStyle = `w-full bg-transparent text-center border-b-2 border-blue-300 outline-none pb-1 ${headerTextStyle}`;

  return (
    <div className="flex justify-center items-center py-6 mb-4">
      <div 
        className="relative shadow-xl py-4 px-6 sm:px-12 rounded-lg transition-colors duration-300"
        style={{ backgroundColor: primaryColor }}
      >
        <Doodle1 />
        <Doodle2 />
        <Doodle3 />
        <div 
          className="relative text-center" 
          style={{ color: textColor }}
        >
            <span className="text-sm font-light tracking-wider opacity-90">NEW</span>
            <EditableCell
                initialValue={title}
                onSave={onUpdateTitle}
                className={headerTextStyle}
                inputClassName={inputStyle}
                disableHoverEffect={true}
                style={{ color: textColor }}
            />
        </div>
      </div>
    </div>
  );
};

export default Header;
