import React, { useState, useEffect } from 'react';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../../services/categoryService';
import { FaTag, FaPlus, FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await getCategories();
            setCategories(response.data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) {
            setError('Category name is required');
            return;
        }

        try {
            await addCategory({ name: newCategoryName.trim() });
            setSuccess('Category added successfully!');
            setNewCategoryName('');
            setShowAddForm(false);
            setError('');
            fetchCategories();
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Error adding category:', error);
            setError(error.response?.data?.message || 'Failed to add category');
        }
    };

    const handleCancelAdd = () => {
        setShowAddForm(false);
        setNewCategoryName('');
        setError('');
    };

    const handleStartEdit = (category) => {
        setEditingId(category.id);
        setEditingName(category.name);
        setError('');
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingName('');
        setError('');
    };

    const handleUpdateCategory = async (id) => {
        if (!editingName.trim()) {
            setError('Category name cannot be empty');
            return;
        }

        const cleanId = String(id).replace(/[^0-9]/g, '');
        console.log('Updating category ID:', id, 'Clean ID:', cleanId);

        try {
            await updateCategory(cleanId, { name: editingName.trim() });
            setSuccess('Category updated successfully!');
            setEditingId(null);
            setEditingName('');
            setError('');
            fetchCategories();
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Error updating category:', error);
            const errorMsg = error.response?.data?.message || error.response?.data || error.message || 'Failed to update category';
            setError(errorMsg);
            setTimeout(() => setError(''), 5000);
        }
    };

    const handleDeleteCategory = async (id, name) => {
        const cleanId = String(id).replace(/[^0-9]/g, '');
        console.log('Deleting category ID:', id, 'Clean ID:', cleanId);

        if (!window.confirm(`Are you sure you want to delete "${name}"? This may affect donations in this category.`)) {
            return;
        }

        try {
            await deleteCategory(cleanId);
            setSuccess('Category deleted successfully!');
            setError('');
            fetchCategories();
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Error deleting category:', error);
            const errorMsg = error.response?.data?.message || error.response?.data || error.message || 'Failed to delete category';
            setError(errorMsg);
            setTimeout(() => setError(''), 5000);
        }
    };

    if (loading) {
        return <div style={styles.loading}>Loading categories...</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <h2 style={styles.title}>
                        <FaTag style={{ fontSize: '1.5rem' }} />
                        Category Management
                    </h2>
                    <p style={styles.subtitle}>Manage donation categories</p>
                </div>
                {!showAddForm && (
                    <button 
                        onClick={() => setShowAddForm(true)}
                        style={styles.addButton}
                    >
                        <FaPlus style={{ marginRight: '0.5rem' }} />
                        Add Category
                    </button>
                )}
            </div>

            {error && (
                <div style={styles.errorBox}>
                    <span style={styles.errorIcon}>⚠️</span>
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div style={styles.successBox}>
                    <span style={styles.successIcon}>✅</span>
                    <span>{success}</span>
                </div>
            )}

            {showAddForm && (
                <div style={styles.formCard}>
                    <h3 style={styles.formTitle}>Add New Category</h3>
                    <form onSubmit={handleAddCategory} style={styles.form}>
                        <input
                            type="text"
                            placeholder="Category name (e.g., Electronics, Clothing)"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            style={styles.input}
                            autoFocus
                        />
                        <div style={styles.formButtons}>
                            <button type="submit" style={styles.saveButton}>
                                <FaSave style={{ marginRight: '0.5rem' }} />
                                Save
                            </button>
                            <button 
                                type="button" 
                                onClick={handleCancelAdd}
                                style={styles.cancelButton}
                            >
                                <FaTimes style={{ marginRight: '0.5rem' }} />
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div style={styles.statsCard}>
                <div style={styles.statItem}>
                    <span style={styles.statValue}>{categories.length}</span>
                    <span style={styles.statLabel}>Total Categories</span>
                </div>
            </div>

            {categories.length === 0 ? (
                <div style={styles.emptyState}>
                    <FaTag style={styles.emptyIcon} />
                    <p style={styles.emptyText}>No categories found</p>
                    <p style={styles.emptySubtext}>Add your first category to get started</p>
                </div>
            ) : (
                <div style={styles.grid}>
                    {categories.map((category) => (
                        <div key={category.id} style={styles.categoryCard}>
                            {editingId === category.id ? (
                                <div style={styles.editForm}>
                                    <input
                                        type="text"
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleUpdateCategory(category.id)}
                                        style={styles.editInput}
                                        autoFocus
                                    />
                                    <div style={styles.editButtons}>
                                        <button
                                            onClick={() => handleUpdateCategory(category.id)}
                                            style={{...styles.iconButton, ...styles.editButton}}
                                            title="Save"
                                        >
                                            <FaSave />
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            style={styles.iconButton}
                                            title="Cancel"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div style={styles.categoryIcon}>
                                        <FaTag />
                                    </div>
                                    <div style={styles.categoryContent}>
                                        <h3 style={styles.categoryName}>{category.name}</h3>
                                        <p style={styles.categoryId}>ID: {category.id}</p>
                                    </div>
                                    <div style={styles.categoryActions}>
                                        <button
                                            onClick={() => handleStartEdit(category)}
                                            style={{...styles.iconButton, ...styles.editButton}}
                                            title="Edit"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCategory(category.id, category.name)}
                                            style={{...styles.iconButton, ...styles.deleteButton}}
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '2rem',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(141, 160, 242, 0.08)',
        border: '1px solid rgba(141, 160, 242, 0.1)',
    },
    loading: {
        padding: '3rem',
        textAlign: 'center',
        color: '#666',
        fontSize: '1.1rem',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem',
    },
    headerLeft: {
        flex: 1,
    },
    title: {
        fontSize: '1.8rem',
        fontWeight: '700',
        color: '#8da0f2',
        marginBottom: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    subtitle: {
        color: '#666',
        fontSize: '0.95rem',
        margin: 0,
    },
    addButton: {
        background: 'linear-gradient(135deg, #8da0f2 0%, #cfd8ff 100%)',
        color: 'white',
        border: 'none',
        padding: '0.75rem 1.5rem',
        borderRadius: '8px',
        fontSize: '0.95rem',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 4px 15px rgba(141, 160, 242, 0.3)',
        transition: 'transform 0.2s, box-shadow 0.2s',
    },
    errorBox: {
        background: '#fee',
        border: '1px solid #fcc',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#c33',
    },
    errorIcon: {
        fontSize: '1.2rem',
    },
    successBox: {
        background: '#efe',
        border: '1px solid #cfc',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#363',
    },
    successIcon: {
        fontSize: '1.2rem',
    },
    formCard: {
        background: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
        border: '2px solid #8da0f2',
    },
    formTitle: {
        fontSize: '1.2rem',
        fontWeight: '600',
        color: '#333',
        marginBottom: '1rem',
        marginTop: 0,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    input: {
        padding: '0.75rem',
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        fontSize: '1rem',
        transition: 'border-color 0.2s',
        outline: 'none',
    },
    formButtons: {
        display: 'flex',
        gap: '0.75rem',
    },
    saveButton: {
        background: 'linear-gradient(135deg, #8da0f2 0%, #cfd8ff 100%)',
        color: 'white',
        border: 'none',
        padding: '0.75rem 1.5rem',
        borderRadius: '8px',
        fontSize: '0.95rem',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        transition: 'transform 0.2s',
    },
    cancelButton: {
        background: '#f5f5f5',
        color: '#666',
        border: 'none',
        padding: '0.75rem 1.5rem',
        borderRadius: '8px',
        fontSize: '0.95rem',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        transition: 'background 0.2s',
    },
    statsCard: {
        background: 'linear-gradient(135deg, #8da0f2 0%, #cfd8ff 100%)',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-around',
        boxShadow: '0 4px 15px rgba(141, 160, 242, 0.3)',
    },
    statItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
    },
    statValue: {
        fontSize: '2rem',
        fontWeight: '700',
        color: 'white',
    },
    statLabel: {
        fontSize: '0.9rem',
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '500',
    },
    emptyState: {
        padding: '4rem 2rem',
        textAlign: 'center',
        color: '#999',
    },
    emptyIcon: {
        fontSize: '4rem',
        color: '#ddd',
        marginBottom: '1rem',
    },
    emptyText: {
        fontSize: '1.2rem',
        fontWeight: '600',
        color: '#666',
        marginBottom: '0.5rem',
    },
    emptySubtext: {
        color: '#999',
        fontSize: '0.95rem',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem',
    },
    categoryCard: {
        background: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        transition: 'transform 0.2s, box-shadow 0.2s',
        border: '2px solid transparent',
    },
    categoryIcon: {
        width: '50px',
        height: '50px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #8da0f2 0%, #cfd8ff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '1.5rem',
        flexShrink: 0,
    },
    categoryContent: {
        flex: 1,
    },
    categoryName: {
        fontSize: '1.1rem',
        fontWeight: '600',
        color: '#333',
        margin: 0,
        marginBottom: '0.25rem',
    },
    categoryId: {
        fontSize: '0.85rem',
        color: '#999',
        margin: 0,
    },
    categoryActions: {
        display: 'flex',
        gap: '0.5rem',
    },
    iconButton: {
        background: 'transparent',
        border: 'none',
        padding: '0.5rem',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '1rem',
        color: '#666',
        transition: 'background 0.2s, color 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    editButton: {
        color: '#8da0f2',
    },
    deleteButton: {
        color: '#f5576c',
    },
    editForm: {
        display: 'flex',
        gap: '0.5rem',
        width: '100%',
        alignItems: 'center',
    },
    editInput: {
        flex: 1,
        padding: '0.5rem',
        border: '2px solid #8da0f2',
        borderRadius: '6px',
        fontSize: '0.95rem',
        outline: 'none',
    },
    editButtons: {
        display: 'flex',
        gap: '0.25rem',
    },
};

export default CategoryManagement;
