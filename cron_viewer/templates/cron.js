import { parseCronExpression } from 'https://cdn.skypack.dev/cron-schedule@^4.0.0';

const cronJobs = {CRON_JOBS}
  
const searchInput = document.getElementById('searchInput');
const jobsGrid = document.getElementById('jobsGrid');
const noResults = document.getElementById('noResults');
const searchTermSpan = document.getElementById('searchTerm');
const subtitle = document.getElementById('subtitle')

// SVG Icons
const clockIcon = `<svg class="execution-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12,6 12,12 16,14"></polyline>
</svg>`;

const calendarIcon = `<svg class="execution-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
</svg>`;

const activityIcon = `<svg class="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline>
</svg>`;


function createJobCard(job) {
    return `
        <div class="job-card">
            <div class="card-header">
                <h3 class="card-title">${job.name}</h3>
                <span class="status-badge">
                    ${activityIcon}
                    ${job.status}
                </span>
            </div>
            
            <div class="card-content">
                <div class="cron-expression">
                    <code class="cron-code">${job.cron}</code>
                </div>
                
                <div class="execution-info">
                    <div class="execution-item">
                        ${clockIcon}
                        <div class="execution-details">
                            <span class="execution-time">${job.description}</span>
                        </div>
                    </div>
                    
                    <div class="execution-item">
                        ${calendarIcon}
                        <div class="execution-details">
                            <span class="execution-label">Next execution at</span>
                            <span class="execution-time">${job.nextRun.toLocaleString('pt-BR')}</span>
                        </div>
                    </div>
                </div>
                
                <button class="details-button" onclick="handleDetailsClick('${job.name}')">
                    Details
                </button>
            </div>
        </div>
    `;
}

function filterJobs(searchTerm) {
    return cronJobs.filter(job => 
        job.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

function renderJobs(jobs, searchTerm = '') {
    subtitle.innerText = `${jobs.length} crons found`

    for (const job of jobs) {
        const now = new Date();
        const cron = parseCronExpression(job.cron);
        job.nextRun = cron.getNextDate(now);
    }
    
    jobs.sort((a, b) => a.nextRun - b.nextRun);

    if (jobs.length === 0 && searchTerm) {
        jobsGrid.innerHTML = '';
        searchTermSpan.textContent = searchTerm;
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
        jobsGrid.innerHTML = jobs.map(job => createJobCard(job)).join('');
    }
}


function handleSearch() {
    const searchTerm = searchInput.value.trim();
    const filteredJobs = filterJobs(searchTerm);
    renderJobs(filteredJobs, searchTerm);
}

function handleDetailsClick(jobName) {}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Event listeners
searchInput.addEventListener('input', handleSearch);

// Initial render
document.addEventListener('DOMContentLoaded', function() {
    renderJobs(cronJobs);
});

searchInput.removeEventListener('input', handleSearch);
searchInput.addEventListener('input', debounce(handleSearch, 300));