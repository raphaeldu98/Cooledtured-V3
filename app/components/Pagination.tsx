import React from 'react';
import {Signal} from '@preact/signals-react';
import {FaAngleLeft, FaAngleRight} from 'react-icons/fa';
import {useSearchParams} from '@remix-run/react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

type ButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  children: React.ReactNode;
};

type PaginationButtonProps = {
  page: number | null;
  disabled: boolean;
  active: boolean;
  content: string | JSX.Element;
};

const Pagination: React.FC<PaginationProps> = ({currentPage, totalPages}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigatePage = (newPage: number) => {
    // Prevent going beyond the last page
    const validatedPage = Math.max(0, Math.min(newPage, totalPages - 1));
    currentPage = validatedPage;

    // Create a new URLSearchParams object based on the current search parameters
    const newSearchParams = new URLSearchParams(searchParams);

    // Set the 'page' search parameter to the new validated page number
    newSearchParams.set('page', (validatedPage + 1).toString());

    // Use setSearchParams to update the URL without losing other search parameters
    setSearchParams(newSearchParams, {replace: true});
  };

  const paginationItems = (): PaginationButtonProps[] => {
    let items: PaginationButtonProps[] = [];

    if (currentPage > 0) {
      items.push({
        page: 0,
        disabled: false,
        active: currentPage === 0,
        content: '1',
      });
    }

    if (currentPage > 2) {
      items.push({page: null, disabled: true, active: false, content: '...'});
    }

    if (currentPage > 1) {
      items.push({
        page: currentPage - 1,
        disabled: false,
        active: false,
        content: currentPage.toString(),
      });
    }

    items.push({
      page: currentPage,
      disabled: false,
      active: true,
      content: (currentPage + 1).toString(),
    });

    if (currentPage < totalPages - 2) {
      items.push({
        page: currentPage + 1,
        disabled: false,
        active: false,
        content: (currentPage + 2).toString(),
      });
    }

    if (currentPage < totalPages - 3) {
      items.push({page: null, disabled: true, active: false, content: '...'});
    }

    if (currentPage < totalPages - 1) {
      items.push({
        page: totalPages - 1,
        disabled: false,
        active: false,
        content: totalPages.toString(),
      });
    }
    return items;
  };

  const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    disabled,
    active = false,
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-amber-500 hover:scale-105 active:animate-ping transition-all duration-100 ease-in-out  ${
        active ? 'bg-blue-200 font-bold scale-90' : ''
      } ${disabled ? 'cursor-not-allowed text-gray-500' : 'text-gray-700'}`}
    >
      {children}
    </button>
  );

  return (
    <div className="my-4 bg-blue-950 px-4 py-2 rounded-3xl">
      <div className="flex bg-slate-200 px-4 py-2 rounded-2xl max-w-52 scale-90 xxs:scale-100 xxs:max-w-full items-center justify-center space-x-1">
        <Button
          onClick={() => navigatePage(currentPage - 1)}
          disabled={currentPage === 0}
        >
          <FaAngleLeft />
        </Button>
        {paginationItems().map((item, index) => (
          <button
            key={index}
            onClick={() => !item.disabled && navigatePage(item.page!)}
            disabled={item.disabled}
            className={`px-4 py-2 border border-gray-300 rounded-lg ${
              item.active ? 'bg-blue-200' : 'bg-white'
            } ${
              item.disabled
                ? 'cursor-not-allowed text-gray-500'
                : 'hover:bg-amber-500 cursor-pointer'
            }`}
          >
            {item.content}
          </button>
        ))}
        <Button
          onClick={() => navigatePage(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
        >
          <FaAngleRight />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
