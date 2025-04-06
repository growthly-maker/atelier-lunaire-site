import Head from 'next/head';
import { useState, useEffect } from 'react';
import { FiSearch, FiMail, FiCheckCircle } from 'react-icons/fi';
import AdminLayout from '../../../components/admin/Layout';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [roleFilter, setRoleFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const usersPerPage = 10;
  
  useEffect(() => {
    fetchUsers();
  }, [currentPage, roleFilter, searchTerm]);
  
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/admin/users?page=${currentPage}&limit=${usersPerPage}&role=${roleFilter}&search=${searchTerm}`
      );
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des utilisateurs');
      }
      
      const data = await response.json();
      setUsers(data.users);
      setTotalPages(Math.ceil(data.total / usersPerPage));
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  
  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1);
  };
  
  const openRoleModal = (userId, currentIsAdmin) => {
    setSelectedUserId(userId);
    setIsAdmin(currentIsAdmin);
    setIsModalOpen(true);
  };
  
  const handleRoleChange = async () => {
    try {
      const response = await fetch(`/api/admin/users/${selectedUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isAdmin }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du rôle');
      }
      
      // Mettre à jour la liste des utilisateurs
      fetchUsers();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };
  
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <AdminLayout>
      <Head>
        <title>Gestion des utilisateurs | Administration Atelier Lunaire</title>
      </Head>

      <div className="mb-6">
        <h1 className="text-2xl font-serif text-gray-800">Gestion des utilisateurs</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Filtres et recherche */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="sm:w-64">
            <select
              value={roleFilter}
              onChange={handleRoleFilterChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">Tous les utilisateurs</option>
              <option value="admin">Administrateurs</option>
              <option value="customer">Clients</option>
              <option value="newsletter">Abonnés newsletter</option>
            </select>
          </div>
        </div>

        {/* Tableau des utilisateurs */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'inscription</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Newsletter</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.isAdmin ? 'Administrateur' : 'Client'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.newsletterSubscribed ? (
                          <span className="text-green-600 flex items-center">
                            <FiCheckCircle className="mr-1" /> Inscrit
                          </span>
                        ) : (
                          'Non inscrit'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => window.location.href = `mailto:${user.email}`}
                            className="text-gray-500 hover:text-gray-700"
                            title="Envoyer un email"
                          >
                            <FiMail />
                          </button>
                          <button 
                            onClick={() => openRoleModal(user._id, user.isAdmin)}
                            className="text-blue-500 hover:text-blue-700"
                            title="Modifier le rôle"
                          >
                            Modifier le rôle
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      Aucun utilisateur trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-700">
                Page <span className="font-medium">{currentPage}</span> sur{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-primary-100 text-primary-700 hover:bg-primary-200'}`}
              >
                Précédent
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-primary-100 text-primary-700 hover:bg-primary-200'}`}
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal pour modifier le rôle */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Modifier le rôle de l'utilisateur</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Choisissez le rôle à attribuer à cet utilisateur.
                      </p>
                      <div className="mt-4">
                        <div className="flex items-center">
                          <input
                            id="role-admin"
                            name="role"
                            type="radio"
                            checked={isAdmin}
                            onChange={() => setIsAdmin(true)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                          />
                          <label htmlFor="role-admin" className="ml-3">
                            <span className="block text-sm font-medium text-gray-700">Administrateur</span>
                            <span className="block text-sm text-gray-500">Accès à toutes les fonctionnalités d'administration</span>
                          </label>
                        </div>
                        <div className="flex items-center mt-4">
                          <input
                            id="role-customer"
                            name="role"
                            type="radio"
                            checked={!isAdmin}
                            onChange={() => setIsAdmin(false)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                          />
                          <label htmlFor="role-customer" className="ml-3">
                            <span className="block text-sm font-medium text-gray-700">Client</span>
                            <span className="block text-sm text-gray-500">Accès standard à la boutique</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleRoleChange}
                >
                  Enregistrer
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}