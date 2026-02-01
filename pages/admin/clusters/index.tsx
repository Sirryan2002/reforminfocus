import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { withAuth } from '@/lib/withAuth';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Cluster = Database['public']['Tables']['clusters']['Row'];
type ClusterInsert = Database['public']['Tables']['clusters']['Insert'];
type ClusterUpdate = Database['public']['Tables']['clusters']['Update'];
type Tag = Database['public']['Tables']['tags']['Row'];

interface ClusterWithTags extends Cluster {
  tags?: Tag[];
}

function ClustersPage() {
  const router = useRouter();
  const [clusters, setClusters] = useState<ClusterWithTags[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [status, setStatus] = useState<'loading' | 'idle' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingCluster, setEditingCluster] = useState<ClusterWithTags | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon_or_image_url: '',
    display_order: 0,
    selectedTagIds: [] as string[]
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchClusters();
    fetchAllTags();
  }, []);

  const fetchClusters = async () => {
    try {
      setStatus('loading');
      const { data: clustersData, error: clustersError } = await supabase
        .from('clusters')
        .select('*')
        .order('display_order');

      if (clustersError) throw clustersError;

      // Fetch tags for each cluster
      const clustersWithTags = await Promise.all(
        (clustersData || []).map(async (cluster) => {
          const clusterTyped = cluster as Cluster;
          const { data: clusterTagsData } = await supabase
            .from('cluster_tags')
            .select('tag_id')
            .eq('cluster_id', clusterTyped.id);

          if (!clusterTagsData || clusterTagsData.length === 0) {
            return { ...clusterTyped, tags: [] };
          }

          const tagIds = clusterTagsData.map((ct: any) => ct.tag_id as string);
          const { data: tagsData } = await supabase
            .from('tags')
            .select('*')
            .in('id', tagIds);

          return { ...clusterTyped, tags: (tagsData || []) as Tag[] };
        })
      );

      setClusters(clustersWithTags);
      setStatus('idle');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load clusters');
      console.error('Error loading clusters:', error);
    }
  };

  const fetchAllTags = async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');

      if (error) throw error;
      setAllTags(data || []);
    } catch (error) {
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
    setEditingCluster(null);
    const maxOrder = clusters.reduce((max, c) => Math.max(max, c.display_order || 0), 0);
    setFormData({
      name: '',
      slug: '',
      description: '',
      icon_or_image_url: '',
      display_order: maxOrder + 1,
      selectedTagIds: []
    });
    setFormError('');
    setShowForm(true);
  };

  const openEditForm = (cluster: ClusterWithTags) => {
    setEditingCluster(cluster);
    setFormData({
      name: cluster.name,
      slug: cluster.slug,
      description: cluster.description || '',
      icon_or_image_url: cluster.icon_or_image_url || '',
      display_order: cluster.display_order || 0,
      selectedTagIds: cluster.tags?.map(t => String(t.id)) || []
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

      let clusterId: string | number;

      if (editingCluster) {
        // Update existing cluster
        const updateData: ClusterUpdate = {
          name: formData.name.trim(),
          slug: formData.slug.trim(),
          description: formData.description.trim() || null,
          icon_or_image_url: formData.icon_or_image_url.trim() || null,
          display_order: formData.display_order
        };

        const { error } = await supabase
          .from('clusters')
          .update(updateData as never)
          .eq('id', editingCluster.id);

        if (error) throw error;
        clusterId = editingCluster.id;
      } else {
        // Create new cluster
        const insertData: ClusterInsert = {
          name: formData.name.trim(),
          slug: formData.slug.trim(),
          description: formData.description.trim() || null,
          icon_or_image_url: formData.icon_or_image_url.trim() || null,
          display_order: formData.display_order
        };

        const { data, error } = await supabase
          .from('clusters')
          .insert(insertData as never)
          .select()
          .single();

        if (error) throw error;
        const newCluster = data as Cluster;
        clusterId = newCluster.id;
      }

      // Update cluster_tags associations
      // First, delete all existing associations
      await supabase
        .from('cluster_tags')
        .delete()
        .eq('cluster_id', clusterId);

      // Then, insert new associations
      if (formData.selectedTagIds.length > 0) {
        const clusterTagsData = formData.selectedTagIds.map(tagId => ({
          cluster_id: clusterId,
          tag_id: tagId
        }));

        const { error: clusterTagsError } = await supabase
          .from('cluster_tags')
          .insert(clusterTagsData as never);

        if (clusterTagsError) throw clusterTagsError;
      }

      setFormStatus('idle');
      setShowForm(false);
      fetchClusters();
    } catch (error) {
      setFormStatus('error');
      setFormError(error instanceof Error ? error.message : 'Failed to save cluster');
      console.error('Error saving cluster:', error);
    }
  };

  const handleDelete = async (cluster: ClusterWithTags) => {
    if (!confirm(`Are you sure you want to delete the cluster "${cluster.name}"?`)) {
      return;
    }

    try {
      // Delete cluster_tags associations first
      await supabase
        .from('cluster_tags')
        .delete()
        .eq('cluster_id', cluster.id);

      // Delete cluster
      const { error } = await supabase
        .from('clusters')
        .delete()
        .eq('id', cluster.id);

      if (error) throw error;
      fetchClusters();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete cluster');
      console.error('Error deleting cluster:', error);
    }
  };

  const toggleTagSelection = (tagId: string | number) => {
    const tagIdStr = String(tagId);
    setFormData(prev => ({
      ...prev,
      selectedTagIds: prev.selectedTagIds.includes(tagIdStr)
        ? prev.selectedTagIds.filter(id => id !== tagIdStr)
        : [...prev.selectedTagIds, tagIdStr]
    }));
  };

  if (status === 'loading') {
    return (
      <>
        <Head>
          <title>Clusters - Admin - Reform in Focus</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <AdminLayout title="Topic Clusters">
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div style={{ fontSize: '1.125rem', color: 'var(--neutral-600)' }}>
              Loading clusters...
            </div>
          </div>
        </AdminLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Clusters - Admin - Reform in Focus</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <AdminLayout title="Topic Clusters">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <p style={{ color: 'var(--neutral-600)' }}>
            {clusters.length} {clusters.length === 1 ? 'cluster' : 'clusters'}
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
            + New Cluster
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

        {/* Clusters List */}
        {clusters.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 1rem',
            backgroundColor: 'var(--neutral-50)',
            borderRadius: '8px'
          }}>
            <p style={{ fontSize: '1.125rem', color: 'var(--neutral-600)', marginBottom: '1rem' }}>
              No clusters yet
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
              Create your first cluster
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {clusters.map((cluster) => (
              <div
                key={cluster.id}
                style={{
                  backgroundColor: 'var(--white)',
                  border: '1px solid var(--neutral-200)',
                  borderRadius: '8px',
                  padding: '1.5rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
                      }}>
                        {cluster.name}
                      </h3>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: 'var(--neutral-100)',
                        color: 'var(--neutral-600)',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        Order: {cluster.display_order}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--neutral-600)', marginBottom: '0.5rem', fontFamily: 'monospace' }}>
                      {cluster.slug}
                    </p>
                    {cluster.description && (
                      <p style={{ color: 'var(--neutral-700)', marginBottom: '1rem' }}>
                        {cluster.description}
                      </p>
                    )}
                    {cluster.tags && cluster.tags.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {cluster.tags.map(tag => (
                          <span
                            key={tag.id}
                            style={{
                              padding: '0.25rem 0.75rem',
                              backgroundColor: tag.color || '#2563eb',
                              color: 'var(--white)',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: '600'
                            }}
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => openEditForm(cluster)}
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
                      onClick={() => handleDelete(cluster)}
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
                </div>
              </div>
            ))}
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
              maxWidth: '700px',
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
                {editingCluster ? 'Edit Cluster' : 'New Cluster'}
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
                    placeholder="e.g., Literacy & Reading"
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
                    placeholder="literacy-reading"
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
                    placeholder="Brief description of this cluster"
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

                {/* Display Order */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label
                    htmlFor="display_order"
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '600',
                      color: 'var(--neutral-800)'
                    }}
                  >
                    Display Order
                  </label>
                  <input
                    type="number"
                    id="display_order"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    min="0"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      fontSize: '1rem',
                      border: '1px solid var(--neutral-300)',
                      borderRadius: '6px'
                    }}
                  />
                </div>

                {/* Icon/Image URL */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label
                    htmlFor="icon_or_image_url"
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '600',
                      color: 'var(--neutral-800)'
                    }}
                  >
                    Icon or Image URL
                  </label>
                  <input
                    type="text"
                    id="icon_or_image_url"
                    value={formData.icon_or_image_url}
                    onChange={(e) => setFormData({ ...formData, icon_or_image_url: e.target.value })}
                    placeholder="https://..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      fontSize: '1rem',
                      border: '1px solid var(--neutral-300)',
                      borderRadius: '6px'
                    }}
                  />
                </div>

                {/* Tag Selection */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: 'var(--neutral-800)'
                  }}>
                    Associated Tags
                  </label>
                  {allTags.length === 0 ? (
                    <p style={{ fontSize: '0.875rem', color: 'var(--neutral-600)' }}>
                      No tags available. Create tags first.
                    </p>
                  ) : (
                    <div style={{
                      border: '1px solid var(--neutral-300)',
                      borderRadius: '6px',
                      padding: '1rem',
                      maxHeight: '200px',
                      overflow: 'auto'
                    }}>
                      {allTags.map(tag => (
                        <label
                          key={tag.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.5rem',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            marginBottom: '0.25rem'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={formData.selectedTagIds.includes(String(tag.id))}
                            onChange={() => toggleTagSelection(tag.id)}
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                          />
                          <div
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '4px',
                              backgroundColor: tag.color || '#2563eb'
                            }}
                          />
                          <span style={{ fontWeight: '500' }}>{tag.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
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
                    {formStatus === 'saving' ? 'Saving...' : editingCluster ? 'Update' : 'Create'}
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

export default withAuth(ClustersPage);
