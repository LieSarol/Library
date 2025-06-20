    const searchInput = document.getElementById('searchInput');
    const queryResults = document.getElementById('queryResults');
    const nounResults = document.getElementById('nounResults');
    const backBtn = document.getElementById('backBtn');
    const searchIcon = document.getElementById('searchIcon');

    // Load initial search query from sessionStorage
    const searchQuery = sessionStorage.getItem('searchQuery') || '';
    searchInput.value = searchQuery;

    // Clicking back button takes user back in history
    backBtn.addEventListener('click', () => {
      window.history.back();
    });

    // Trigger search on clicking the search icon or pressing Enter in input
    function triggerSearch() {
  const query = searchInput.value.trim();
  if (!query) return;

  sessionStorage.setItem('searchQuery', query);

  // Only call exact search if query ends with '?'
  if (query.endsWith('?')) {
    fetchExactSearchResults(query, queryResults);
  } else {
    // If no '?', clear exact results area or show something else
    queryResults.innerHTML = '<div class="no-result">Please end your query with a "?" for exact search.</div>';
  }

  // Always do noun-based search, no '?'
  fetchNoun(query).then(noun => {
    if (noun) {
      fetchSearchResults(noun, nounResults);
    } else {
      nounResults.innerHTML = '<div class="no-result">Couldn’t find a related noun.</div>';
    }
  });
    }

    searchIcon.addEventListener('click', triggerSearch);
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') triggerSearch();
    });

    // Render results with clickable boxes
    function renderResults(container, data) {
  container.innerHTML = data.map(item => `
    <a href="redirect.html" class="result-box" data-xata-id="${item.xata_id}">
      <div>${item.question}</div>
    </a>
  `).join('');

  // After rendering, attach click listeners to each box
  container.querySelectorAll('.result-box').forEach(box => {
    box.addEventListener('click', e => {
      const xataId = box.getAttribute('data-xata-id');
      if (xataId) {
        sessionStorage.setItem('selectedXataId', xataId);
        console.log('Saved xata_id:', xataId); // optional for debugging
      }
    });
  });
    }

    async function fetchExactSearchResults(query, container) {
  try {
    const res = await fetch(`https://library-of-knowledge.vercel.app/search?q=${encodeURIComponent(query)}&limit=5`);
    const data = await res.json();

    console.log("Search response:", data);

    // If no results at all, just show dynamic box
    if (data.message === 'No matching questions found.' || !Array.isArray(data) || data.length === 0) {
      container.innerHTML = `
        <a href="dynamic.html" class="result-box">
          <div>${query}</div>
        </a>
      `;
      return;
    }

    // Check if exact question exists in results (case insensitive)
    const exactExists = data.some(item => item.question.toLowerCase() === query.toLowerCase());

    // Render existing results
    renderResults(container, data);

    // If exact question NOT found, add the dynamic box below results
    if (!exactExists) {
      container.insertAdjacentHTML('beforeend', `
        <a href="dynamic.html" class="result-box" style="background-color: #333; border: 2px dashed #00bfff; margin-top: 15px;">
          <div>Create new entry: <strong>${query}</strong></div>
        </a>
      `);
    }

  } catch (err) {
    console.error('Search failed:', err);
    container.innerHTML = '<div class="no-result">Error loading results.</div>';
  }
    } 
    
    async function fetchSearchResults(query, container) {
      try {
        const res = await fetch(`https://sky.leapcell.app/search?q=${encodeURIComponent(query)}&limit=5`);
        if (!res.ok) {
          container.innerHTML = '<div class="no-result">No results found.</div>';
          return;
        }

        const data = await res.json();
        renderResults(container, data);
      } catch (err) {
        console.error('Search failed:', err);
        container.innerHTML = '<div class="no-result">Error loading results.</div>';
      }
    }

    async function fetchNoun(query) {
      try {
        const res = await fetch('https://cubby-noun-extrac-40.deno.dev/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: query })
        });
        const data = await res.json();
        if (data.nouns && data.nouns.length > 0) {
  return data.nouns.slice(0, 3); // Max 3 nouns
    }
        return null;
      } catch (err) {
        console.error('Noun extraction failed:', err);
        return null;
      }
    }

    // Initial load with session query
    if (searchQuery) {
      fetchExactSearchResults(searchQuery, queryResults);
      fetchNoun(searchQuery).then(noun => {
        if (noun) {
          fetchSearchResults(noun, nounResults);
        } else {
          nounResults.innerHTML = '<div class="no-result">Couldn’t find a related noun.</div>';
        }
      });
    } else {
      queryResults.innerHTML = '<div class="no-result">No search query found.</div>';
    }

// 🔙 Back Button Logic
const backBtn = document.getElementById("backBtn");
if (backBtn) {
  backBtn.addEventListener("click", () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "search"; // Or whatever your fallback is
    }
  });
}
