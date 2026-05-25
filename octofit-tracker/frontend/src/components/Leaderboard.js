import React, { useCallback, useEffect, useMemo, useState } from 'react';

const resourceName = 'leaderboard';

// Codespaces backend endpoint example:
// https://<CODESPACE_NAME>-8000.app.github.dev/api/leaderboard/
const getApiUrl = (resource) => {
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const host = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';
  return `${host}/api/${resource}/`;
};

const normalizeData = (data) => {
  if (Array.isArray(data)) {
    return data;
  }
  if (Array.isArray(data?.results)) {
    return data.results;
  }
  if (typeof data === 'object' && data !== null) {
    return [data];
  }
  return [];
};

const Leaderboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const endpoint = getApiUrl(resourceName);

  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null);
    console.log('[Leaderboard] endpoint:', endpoint);

    fetch(endpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load leaderboard: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('[Leaderboard] fetched data:', data);
        setItems(normalizeData(data));
      })
      .catch((fetchError) => {
        console.error('[Leaderboard] fetch error:', fetchError);
        setError(fetchError.message);
      })
      .finally(() => setLoading(false));
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredItems = useMemo(
    () =>
      items.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(query.toLowerCase()),
      ),
    [items, query],
  );

  const openModal = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  return (
    <div className="card shadow-sm resource-card">
      <div className="card-body">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-3">
          <div>
            <h2 className="h4 mb-1">Leaderboard</h2>
            <p className="resource-meta mb-0">
              Loaded from <a href={endpoint} target="_blank" rel="noreferrer" className="link-primary">API endpoint</a>.
            </p>
          </div>
          <div className="btn-group mt-3 mt-md-0">
            <button type="button" className="btn btn-primary btn-sm" onClick={fetchData}>
              Refresh
            </button>
            <button type="button" className="btn btn-outline-secondary btn-sm" disabled>
              {items.length} items
            </button>
          </div>
        </div>

        <div className="row g-2 align-items-center mb-3">
          <div className="col-12 col-lg-6">
            <label className="form-label fw-semibold" htmlFor="leaderboardSearch">
              Search leaderboard
            </label>
            <input
              id="leaderboardSearch"
              type="search"
              className="form-control"
              placeholder="Filter leaderboard entries"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>

        {loading && <div className="alert alert-info">Loading leaderboard...</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Title</th>
                  <th scope="col">Summary</th>
                  <th scope="col">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-4">
                      No leaderboard items match your search.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, index) => (
                    <tr key={item.id ?? index}>
                      <td>{index + 1}</td>
                      <td>{item.name ?? item.title ?? item.username ?? `Entry ${index + 1}`}</td>
                      <td className="table-summary">
                        <pre className="mb-0 small text-muted">{JSON.stringify(item, null, 2)}</pre>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => openModal(item)}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && selectedItem && (
        <>
          <div className="modal-backdrop-custom" onClick={closeModal} />
          <div className="modal-custom">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Leaderboard detail</h5>
                  <button type="button" className="btn-close" onClick={closeModal} />
                </div>
                <div className="modal-body">
                  <pre className="mb-0">{JSON.stringify(selectedItem, null, 2)}</pre>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={closeModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Leaderboard;
