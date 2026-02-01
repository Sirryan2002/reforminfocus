import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { withAuth } from '@/lib/withAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Tag = Database['public']['Tables']['tags']['Row'];
type TagInsert = Database['public']['Tables']['tags']['Insert'];
type TagUpdate = Database['public']['Tables']['tags']['Update'];

function TagsPage() {
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);
  const [status, setStatus] = useState<'loading' | 'idle' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#2563eb'
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setStatus('loading');
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');

      if (error) throw error;
      setTags(data || []);
      setStatus('idle');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load tags');
      console.error('Error loading tags:', error);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: prev.slug === '' || prev.slug === generateSlug(prev.name) ? generateSlug(name) : prev.slug
    }));
  };

  const openCreateForm = () => {
    setEditingTag(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      color: '#2563eb'
    });
    setFormError('');
    setShowForm(true);
  };

  const openEditForm = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      slug: tag.slug,
      description: tag.description || '',
      color: tag.color || '#2563eb'
    });
    setFormError('');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('saving');
    setFormError('');

    try {
      // Validation
      if (!formData.name.trim()) {
        throw new Error('Name is required');
      }
      if (!formData.slug.trim()) {
        throw new Error('Slug is required');
      }

      if (editingTag) {
        // Update existing tag
        const updateData: TagUpdate = {
          name: formData.name.trim(),
          slug: formData.slug.trim(),
          description: formData.description.trim() || null,
          color: formData.color
        };

        const { error } = await supabase
          .from('tags')
          .update(updateData as never)
          .eq('id', editingTag.id);

        if (error) throw error;
      } else {
        // Create new tag
        const insertData: TagInsert = {
          name: formData.name.trim(),
          slug: formData.slug.trim(),
          description: formData.description.trim() || null,
          color: formData.color
        };

        const { error } = await supabase
          .from('tags')
          .insert(insertData as never);

        if (error) throw error;
      }

      setFormStatus('idle');
      setShowForm(false);
      fetchTags();
    } catch (error) {
      setFormStatus('error');
      setFormError(error instanceof Error ? error.message : 'Failed to save tag');
      console.error('Error saving tag:', error);
    }
  };

  const handleDelete = async (tag: Tag) => {
    if (!confirm(`Are you sure you want to delete the tag "${tag.name}"? This will remove it from all articles.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tag.id);

      if (error) throw error;
      fetchTags();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete tag');
      console.error('Error deleting tag:', error);
    }
  };

  if (status === 'loading') {
    return (
      <>
        <Head>
          <title>Tags - Admin - Reform in Focus</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <AdminLayout title="Tags">
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div style={{ fontSize: '1.125rem', color: 'var(--neutral-600)' }}>
              Loading tags...
            </div>
          </div>
        </AdminLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Tags - Admin - Reform in Focus</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <AdminLayout title="Tags">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <p style={{ color: 'var(--neutral-600)' }}>
            {tags.length} {tags.length === 1 ? 'tag' : 'tags'}
          </p>
          <button
            onClick={openCreateForm}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--primary-blue)',
              color: 'var(--white)',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem'
            }}
          >
            + New Tag
          </button>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: '#FEE2E2',
            border: '1px solid #FCA5A5',
            borderRadius: '6px',
            color: '#991B1B'
          }}>
            {errorMessage}
          </div>
        )}

        {/* Tags List */}
        {tags.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 1rem',
            backgroundColor: 'var(--neutral-50)',
            borderRadius: '8px'
          }}>
            <p style={{ fontSize: '1.125rem', color: 'var(--neutral-600)', marginBottom: '1rem' }}>
              No tags yet
            </p>
            <button
              onClick={openCreateForm}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--primary-blue)',
                color: 'var(--white)',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Create your first tag
            </button>
          </div>
        ) : (
          <div style={{
            backgroundColor: 'var(--white)',
            border: '1px solid var(--neutral-200)',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--neutral-50)', borderBottom: '1px solid var(--neutral-200)' }}>
                  <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>
                    Color
                  </th>
                  <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>
                    Name
                  </th>
                  <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>
                    Slug
                  </th>
                  <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>
                    Description
                  </th>
                  <th style={{ padding: '0.875rem 1rem', textAlign: 'right', fontWeight: '600', fontSize: '0.875rem' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {tags.map((tag) => (
                  <tr key={tag.id} style={{ borderBottom: '1px solid var(--neutral-200)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '4px',
                          backgroundColor: tag.color || '#2563eb',
                          border: '1px solid var(--neutral-300)'
                        }}
                      />
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '600' }}>
                      {tag.name}
                    </td>
                    <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.875rem', color: 'var(--neutral-600)' }}>
                      {tag.slug}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--neutral-600)', fontSize: '0.875rem' }}>
                      {tag.description || '—'}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => openEditForm(tag)}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: 'var(--white)',
                            color: 'var(--primary-blue)',
                            border: '1px solid var(--primary-blue)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '600'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(tag)}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: 'var(--white)',
                            color: '#DC2626',
                            border: '1px solid #DC2626',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '600'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Create/Edit Modal */}
        {showForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}>
            <div style={{
              backgroundColor: 'var(--white)',
              borderRadius: '8px',
              padding: '2rem',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1.5rem',
                fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
              }}>
                {editingTag ? 'Edit Tag' : 'New Tag'}
              </h2>

              <form onSubmit={handleSubmit}>
                {/* Name */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label
                    htmlFor="name"
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '600',
                      color: 'var(--neutral-800)'
                    }}
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                    placeholder="e.g., School Choice"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      fontSize: '1rem',
                      border: '1px solid var(--neutral-300)',
                      borderRadius: '6px'
                    }}
                  />
                </div>

                {/* Slug */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label
                    htmlFor="slug"
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '600',
                      color: 'var(--neutral-800)'
                    }}
                  >
                    Slug *
                  </label>
                  <input
                    type="text"
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    placeholder="school-choice"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      fontSize: '1rem',
                      border: '1px solid var(--neutral-300)',
                      borderRadius: '6px',
                      fontFamily: 'monospace'
                    }}
                  />
                </div>

                {/* Description */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label
                    htmlFor="description"
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '600',
                      color: 'var(--neutral-800)'
                    }}
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this tag"
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      fontSize: '1rem',
                      border: '1px solid var(--neutral-300)',
                      borderRadius: '6px',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Color */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label
                    htmlFor="color"
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '600',
                      color: 'var(--neutral-800)'
                    }}
                  >
                    Color
                  </label>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input
                      type="color"
                      id="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      style={{
                        width: '80px',
                        height: '40px',
                        border: '1px solid var(--neutral-300)',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      placeholder="#2563eb"
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        fontSize: '1rem',
                        border: '1px solid var(--neutral-300)',
                        borderRadius: '6px',
                        fontFamily: 'monospace'
                      }}
                    />
                  </div>
                </div>

                {/* Error Message */}
                {formError && (
                  <div style={{
                    marginBottom: '1.5rem',
                    padding: '1rem',
                    backgroundColor: '#FEE2E2',
                    border: '1px solid #FCA5A5',
                    borderRadius: '6px',
                    color: '#991B1B'
                  }}>
                    {formError}
                  </div>
                )}

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    disabled={formStatus === 'saving'}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: 'var(--white)',
                      color: 'var(--neutral-700)',
                      border: '1px solid var(--neutral-300)',
                      borderRadius: '6px',
                      cursor: formStatus === 'saving' ? 'not-allowed' : 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formStatus === 'saving'}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: 'var(--primary-blue)',
                      color: 'var(--white)',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: formStatus === 'saving' ? 'not-allowed' : 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    {formStatus === 'saving' ? 'Saving...' : editingTag ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  );
}

export default withAuth(TagsPage);
