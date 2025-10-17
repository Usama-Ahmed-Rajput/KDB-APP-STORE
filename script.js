        const API_BASE = 'https://apk-downloader.bjcoderx.workers.dev/';
        
        document.getElementById('downloadBtn').addEventListener('click', searchAPKs);
        document.getElementById('apkSearch').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchAPKs();
            }
        });

        async function searchAPKs() {
            const query = document.getElementById('apkSearch').value.trim();
            const loadingEl = document.getElementById('loading');
            const errorEl = document.getElementById('error');
            const resultsEl = document.getElementById('results');
            const downloadBtn = document.getElementById('downloadBtn');
            
            if (!query) {
                showError('Please enter an APK name to search');
                return;
            }
            
            // Show loading state
            loadingEl.style.display = 'block';
            errorEl.style.display = 'none';
            resultsEl.innerHTML = '';
            downloadBtn.disabled = true;
            
            try {
                const response = await fetch(`${API_BASE}?query=${encodeURIComponent(query)}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                loadingEl.style.display = 'none';
                downloadBtn.disabled = false;
                
                if (data && data.length > 0) {
                    displayResults(data);
                } else {
                    showError('No APKs found for your search query. Try a different name.');
                }
                
            } catch (error) {
                console.error('Error fetching APKs:', error);
                loadingEl.style.display = 'none';
                downloadBtn.disabled = false;
                showError('Failed to search APKs. Please check your internet connection and try again.');
            }
        }
        
        function displayResults(apks) {
            const resultsEl = document.getElementById('results');
            resultsEl.innerHTML = '';
            
            apks.forEach(apk => {
                const apkItem = document.createElement('div');
                apkItem.className = 'apk-item';
                
                apkItem.innerHTML = `
                    <div class="apk-header">
                        <img src="${apk.image}" alt="${apk.name}" class="apk-icon" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiByeD0iMTAiIGZpbGw9IiNmMGYwZjAiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxMyIgeT0iMTMiPgo8cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptLTIgMTVsLTUtNSAxLjQxLTEuNDFMMTAgMTQuMTdsNy41OS03LjU5TDE5IDhsLTkgOXoiIGZpbGw9IiM5OTk5OTkiLz4KPC9zdmc+Cjwvc3ZnPgo='">
                        <div class="apk-name">${apk.name}</div>
                    </div>
                    <div class="apk-details">
                        <div><strong>Version:</strong> ${apk.version}</div>
                        <div><strong>Size:</strong> ${apk.filesize}</div>
                        <div><strong>Developer:</strong> ${apk.developer}</div>
                        <div><strong>Downloads:</strong> ${apk.downloads.toLocaleString()}</div>
                        <div><strong>Rating:</strong> ${apk.rating}/5 ⭐</div>
                        <div><strong>Rank:</strong> ${apk.rank}</div>
                    </div>
                    <button class="apk-download-btn" onclick="downloadAPK('${apk.path}', '${apk.name}')">
                        📥 Download APK
                    </button>
                `;
                
                resultsEl.appendChild(apkItem);
            });
        }
        
        function downloadAPK(downloadUrl, apkName) {
            try {
                // Create a temporary link element and trigger download
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = `${apkName.replace(/[^a-zA-Z0-9]/g, '_')}.apk`;
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Show success message
                showSuccess(`Download started for ${apkName}`);
            } catch (error) {
                console.error('Download error:', error);
                showError('Failed to start download. Please try again.');
            }
        }
        
        function showError(message) {
            const errorEl = document.getElementById('error');
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
        
        function showSuccess(message) {
            const errorEl = document.getElementById('error');
            errorEl.textContent = message;
            errorEl.style.display = 'block';
            errorEl.style.background = '#d4edda';
            errorEl.style.color = '#155724';
            
            setTimeout(() => {
                errorEl.style.display = 'none';
                errorEl.style.background = '#f8d7da';
                errorEl.style.color = '#dc3545';
            }, 3000);
        }
