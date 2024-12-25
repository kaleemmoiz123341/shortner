import * as React from 'react';
import { UrlData } from '../../interface/UrlData';
import { Link } from 'react-router-dom';
import { serverUrl } from '../../helpers/Constants';
import axios from 'axios';

interface IDataTableProps {
    data: UrlData[];
    updateReloadState: () => void;
}

const DataTable: React.FunctionComponent<IDataTableProps> = (props) => {

    const { data, updateReloadState } = props;
    console.log("Data in datatable: ", data);

    const renderTableData = () => {
        return data.map((item) => {
            return (
                <tr key={item._id} className='border-b text-slate-700 bg-white hover:text-white hover:bg-gray-800'>
                    <td className='px-6 py-3 break-words'>
                        <Link to={item.fullUrl} target='_blank' rel='noreferrer noopener'>
                            {item.fullUrl}
                        </Link>
                    </td>
                    <td className='px-6 py-3'>
                        <Link to={`${serverUrl}/shortUrl/${item.shortUrl}`} target='_blank' rel='noreferrer noopener'>
                            {item.shortUrl}
                        </Link>
                    </td>
                    <td className="px-6 py-3">{item.clicks}</td>
                    <td className="px-6 py-3">
                        <div className="flex content-center">
                            <div className='cursor-pointer px-2' onClick={() => copyToClipboard(item.shortUrl)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                    <path fillRule="evenodd" d="M17.663 3.118c.225.015.45.032.673.05C19.876 3.298 21 4.604 21 6.109v9.642a3 3 0 0 1-3 3V16.5c0-5.922-4.576-10.775-10.384-11.217.324-1.132 1.3-2.01 2.548-2.114.224-.019.448-.036.673-.051A3 3 0 0 1 13.5 1.5H15a3 3 0 0 1 2.663 1.618ZM12 4.5A1.5 1.5 0 0 1 13.5 3H15a1.5 1.5 0 0 1 1.5 1.5H12Z" clipRule="evenodd" />
                                    <path d="M3 8.625c0-1.036.84-1.875 1.875-1.875h.375A3.75 3.75 0 0 1 9 10.5v1.875c0 1.036.84 1.875 1.875 1.875h1.875A3.75 3.75 0 0 1 16.5 18v2.625c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625v-12Z" />
                                    <path d="M10.5 10.5a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963 5.23 5.23 0 0 0-3.434-1.279h-1.875a.375.375 0 0 1-.375-.375V10.5Z" />
                                </svg>
                            </div>
                            <div className='cursor-pointer px-2' onClick={() => deleteUrl(item._id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 fill-red-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </div>
                        </div>

                    </td>

                </tr>
            )
        })
    };
    const deleteUrl = async (id: string) => {
        try {
            const response = await axios.delete(`${serverUrl}/shortUrl/${id}`);
            updateReloadState();
            console.log(response);
        } catch (error) {
            console.log(error);

        }

    }
    const copyToClipboard = async (url: string) => {
        try {
            await navigator.clipboard.writeText(`${serverUrl}/shortUrl/${url}`)
            alert(`URL copied: ${serverUrl}/shortUrl/${url}`)
        } catch (error) {
            console.log(error);
        }

    }
    return (
        <div className="container mx-auto pt-2 pb-10">
            <div className="relative overflow-x-auto shadow-sm sm:rounded-lg">
                <table className="w-full table-fixed text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-md uppercase text-gray-50 bg-gray-700">
                        <tr>
                            <th scope='col' className="px-6 py-3 w-6/12">
                                FullUrl
                            </th>
                            <th scope='col' className="px-6 py-3 w-6/12">
                                ShortUrl
                            </th>
                            <th scope='col' className="px-6 py-3 w-6/12">
                                Clicks
                            </th>
                            <th scope='col' className="px-6 py-3 w-6/12">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderTableData()}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTable;
