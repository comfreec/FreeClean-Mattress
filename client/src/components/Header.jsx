import { Link } from 'react-router-dom';
import { useState } from 'react';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-coway-blue whitespace-nowrap">
              무상매트리스케어
            </h1>
          </Link>

          {/* 데스크톱 메뉴 */}
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
            {/* 햄버거 메뉴 버튼 (모바일) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-coway-blue transition p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            <Link
              to="/admin"
              className="hidden sm:block bg-gray-600 text-white px-3 sm:px-4 md:px-6 py-2 rounded-full hover:bg-gray-700 transition text-sm sm:text-base whitespace-nowrap"
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

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="block text-gray-700 hover:text-coway-blue hover:bg-blue-50 px-4 py-2 rounded-lg transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  홈
                </Link>
              </li>
              <li>
                <Link
                  to="/application"
                  className="block text-gray-700 hover:text-coway-blue hover:bg-blue-50 px-4 py-2 rounded-lg transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  무료 케어 신청
                </Link>
              </li>
              <li>
                <Link
                  to="/mites"
                  className="block text-gray-700 hover:text-coway-blue hover:bg-blue-50 px-4 py-2 rounded-lg transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  진드기사진
                </Link>
              </li>
              <li>
                <Link
                  to="/board"
                  className="block text-gray-700 hover:text-coway-blue hover:bg-blue-50 px-4 py-2 rounded-lg transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  후기 게시판
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="block text-gray-700 hover:text-coway-blue hover:bg-blue-50 px-4 py-2 rounded-lg transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  관리자
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
