'use client';
import { useBook } from "@/contexts/AppContext";
import { useEffect, useState } from "react";
import Pagination from "./Pagination";
import { IBook } from "@/stores/bookStore";
import Link from "next/link";


const SearchBar = () => {
    const bookStore = useBook();
    const [books, setBooks] = useState([] as IBook[]);
    const [inputValue, setInputValue] = useState('');
    const [hasBooks, setHasBooks] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            if (inputValue.trim()) {
                const result = await bookStore?.getBookByName(inputValue.trim());
                if (result) {
                    setBooks(result);
                    setHasBooks(true);
                }
            }
            else {
                setHasBooks(false);
                setBooks([]);
            }
        }
        fetchData();
    }, [inputValue]);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);

    };

    //handlePageChange
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="relative">
            <div className="flex items-center bg-gray-100 border border-gray-300 rounded-full px-4 py-2">
                <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    className="bg-transparent focus:outline-none w-64"
                    value={inputValue}
                    onChange={handleChange}
                />
                <button className="ml-2 text-orange-600">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M12.9 14.32a7.5 7.5 0 111.415-1.414l4.387 4.386a1 1 0 11-1.414 1.415l-4.388-4.387zM13.5 8.5a5 5 0 11-10 0 5 5 0 0110 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
            <div>
                {hasBooks && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[300%] bg-gray-100 border border-gray-300 rounded-lg shadow-lg z-10">
                        <div className="grid grid-cols-4 gap-4">
                            {books && books.length > 0 ? (
                                books.map((book) => (
                                    <Link href={`/books/${book.id}`} key={book.id}>
                                        <div className="border rounded-lg p-4 cursor-pointer hover:shadow-lg text-center">
                                            <img src={book.image} alt={book.title} className="w-full h-80 mx-auto mb-4" />
                                            <h3 className="text-lg font-bold mb-2">{book.title}</h3>
                                            <p className="text-gray-700">{book.salePrice}</p>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p>Không có cuốn nào</p>
                            )}
                        </div>
                        <div className="flex justify-center mt-4">
                            <Pagination setPagination={handlePageChange} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchBar;   