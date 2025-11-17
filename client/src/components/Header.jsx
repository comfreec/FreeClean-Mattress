import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-coway-blue whitespace-nowrap">
              무상매트리스케어
            </h1>
          </Link>

          <ul className="hidden md:flex space-x-8">
            <li>
              <Link to="/" className="text-gray-700 hover:text-coway-blue transition">
                홈
              </Link>
            </li>
            <li>
              <Link to="/application" className="text-gray-700 hover:text-coway-blue transition">
                무료 케어 신청
              </Link>
            </li>
            <li>
              <Link to="/mites" className="text-gray-700 hover:text-coway-blue transition">
                진드기사진
              </Link>
            </li>
            <li>
              <Link to="/board" className="text-gray-700 hover:text-coway-blue transition">
                후기 게시판
              </Link>
            </li>
          </ul>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link
              to="/admin"
              className="bg-gray-600 text-white px-3 sm:px-4 md:px-6 py-2 rounded-full hover:bg-gray-700 transition text-sm sm:text-base whitespace-nowrap"
            >
              관리자
            </Link>
            <Link
              to="/application"
              className="bg-coway-blue text-white px-3 sm:px-4 md:px-6 py-2 rounded-full hover:bg-coway-navy transition text-sm sm:text-base whitespace-nowrap"
            >
              지금 신청
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
