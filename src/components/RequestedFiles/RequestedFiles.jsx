import React, { useEffect, useState } from 'react';
import { useTable, usePagination, useGlobalFilter } from 'react-table';
// import './RequestedFiles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { deleteUser, editUser, fetchUsers } from '../Fetch/UserManagement';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
Modal.setAppElement('#root');

const mockUsers = [
    {'fileName' :  'ba.png'},{'fileName' :  'ball.png'},{'fileName' :  'ccca.png'}
]

export default function UserManagement() {
    //Holds the user data.
    const [data, setData] = useState([]);
    //Indicates whether data is being loaded.
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    //Controls the visibility of the delete confirmation modal.
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    //Holds the email of the user to be deleted.
    const [emailToDelete, setEmailToDelete] = useState(null);

    //Function to display a success toast notification.
    const successNotify = (status) => toast.success(status, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });


    //Opens the delete confirmation modal with the selected user's email.
    const openConfirmModal = (email) => {
        setEmailToDelete(email);
        setIsConfirmModalOpen(true);
    };

    //Closes the delete confirmation modal and resets emailToDelete
    const closeConfirmModal = () => {
        setIsConfirmModalOpen(false);
        setEmailToDelete(null);
    };

    //Loads user data and displays success messages from localStorage on component mount.
    useEffect(() => {
        async function loadData() {
            try {
                // const users = await fetchUsers();
                setData(mockUsers);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
        const editflashMessage = localStorage.getItem('editUser');
        if (editflashMessage) {
            successNotify(editflashMessage);
            localStorage.removeItem('editUser');
        }
    }, []);

    //Defines the columns of the table, including the actions for edit and delete.
    const columns = React.useMemo(
        () => [
            { Header: 'fileName', accessor: 'fileName' },
            {
                Header: 'Actions',
                Cell: ({ row }) => (
                    <>
                        <button onClick={() => { openConfirmModal(row.original) }} className='edit-user-button'>
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button onClick={() => openConfirmModal(row.original.email)} className='delete-user-button'>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </>
                )
            },
        ],
        []
    );

    //Deletes a user and updates the table data.
    const handleDelete = async () => {
        try {
            const data = await deleteUser(emailToDelete);
            successNotify(data.detail);
            setData(prevData => prevData.filter(user => user.email !== emailToDelete));
            closeConfirmModal();
        } catch (error) {
            console.error("Failed to delete user:", error);
        }
    };

    // Initializes the table with pagination and global filter.
    const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page, canPreviousPage,
        canNextPage, pageOptions, state: { pageIndex, globalFilter },
        setGlobalFilter, nextPage, previousPage,
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 },
        },
        useGlobalFilter,
        usePagination
    );

    // Displays a loading spinner while data is being fetched.
    if (loading) {
        return (
            <div className="spinner-overlay">
                <i className="fas fa-spinner fa-spin fa-3x"></i>
            </div>
        );
    }

    return (
        <div className='user-management'>
            <div className="header-container">
                <h1>Requested File Details</h1>
            </div>
            <input value={globalFilter || ""}
                onChange={e => setGlobalFilter(e.target.value || undefined)}
                placeholder="Search..." className="search-input"
            />
            <table {...getTableProps()} className="table">
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className='pagination-container'>
                <button onClick={() => navigate('/Home')} className="back-button">Back</button> 
                <div className="pagination">
                    <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                        Previous
                    </button>
                    <span>
                        Page{' '}
                        <strong>
                            {pageIndex + 1} of {pageOptions.length}
                        </strong>
                    </span>
                    <button onClick={() => nextPage()} disabled={!canNextPage}>
                        Next
                    </button>
                </div>
            </div>

            <Modal isOpen={isConfirmModalOpen} onRequestClose={closeConfirmModal} contentLabel="Delete Confirmation"
                className="modal-popup" overlayClassName="overlay">
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this user?</p><br></br>
                <button type="button" className='ok-button'  onClick={handleDelete}>OK</button>
                <button type="button" className='cancel-button' onClick={closeConfirmModal}>Cancel</button>
            </Modal>
            <ToastContainer />
        </div>
    );
}
