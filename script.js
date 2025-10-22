const projects = [
    {
        id: 'p1',
        title: 'Static Site Boilerplate',
        desc: 'A minimal, responsive static site starter with build scripts and deploy action.',
        tags: ['html','css','workflow', 'github', 'actions', 'static', 'boilerplate', 'starter', 'template', 'web'],
        link: '#'
    },
    {
        id: 'p2',
        title: 'Interactive Map Demo',
        desc: 'Client-side interactive maps with vector tiles and custom markers.',
        tags: ['javascript','maps','ui'],
        link: '#'
    },
    {
        id: 'p3',
        title: 'Data Visualizer',
        desc: 'Small library to visualize CSV and JSON datasets with charts and export.',
        tags: ['javascript','charts','data'],
        link: '#'
    },
    {
        id: 'p4',
        title: 'Component Library',
        desc: 'Collection of accessible UI components styled with CSS variables.',
        tags: ['css','ui','accessibility'],
        link: '#'
    }
];

const grid = document.getElementById('grid');
const tagList = document.getElementById('tagList');
const search = document.getElementById('search');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');

// build unique tags
const allTags = Array.from(new Set(projects.flatMap(p => p.tags))).sort();

// render tag buttons
function renderTags(activeTag){
    tagList.innerHTML = '';
    const allBtn = document.createElement('button');
    allBtn.className = 'tag' + (activeTag === '' ? ' active' : '');
    allBtn.textContent = 'All';
    allBtn.onclick = () => { applyFilter(''); };
    tagList.appendChild(allBtn);

    allTags.forEach(t => {
        const b = document.createElement('button');
        b.className = 'tag' + (t === activeTag ? ' active' : '');
        b.textContent = t;
        b.onclick = () => { applyFilter(t); };
        tagList.appendChild(b);
    });
}

// render project cards based on query and tag
let currentTag = '';
function renderGrid(q='', tag=''){
    grid.innerHTML = '';
    const ql = q.trim().toLowerCase();
    const filtered = projects.filter(p => {
        const matchText = ql === '' || (p.title + ' ' + p.desc + ' ' + p.tags.join(' ')).toLowerCase().includes(ql);
        const matchTag = tag === '' || p.tags.includes(tag);
        return matchText && matchTag;
    });

    if(filtered.length === 0){
        const empty = document.createElement('div');
        empty.style.color = 'var(--muted)';
        empty.textContent = 'No projects match your search.';
        grid.appendChild(empty);
        return;
    }

    filtered.forEach(p => {
        const card = document.createElement('article');
        card.className = 'card';
        card.tabIndex = 0;
        card.innerHTML = `
            <div class="thumb" aria-hidden="true">Preview</div>
            <div>
                <div style="display:flex;justify-content:space-between;align-items:center">
                    <div>
                        <div class="title">${escapeHtml(p.title)}</div>
                        <div class="desc">${escapeHtml(p.desc)}</div>
                    </div>
                    <div class="meta"><span style="color:var(--muted);font-size:12px">${p.tags[0] || ''}</span></div>
                </div>
                <div class="badges" style="margin-top:8px"></div>
            </div>
        `;
        const badges = card.querySelector('.badges');
        p.tags.forEach(t => {
            const b = document.createElement('span');
            b.className = 'badge';
            b.textContent = t;
            b.onclick = (e) => { e.stopPropagation(); applyFilter(t); };
            badges.appendChild(b);
        });

        card.onclick = () => openModal(p);
        card.onkeydown = (e) => { if(e.key === 'Enter') openModal(p); };

        grid.appendChild(card);
    });
}

function applyFilter(tag){
    currentTag = tag;
    renderTags(tag);
    renderGrid(search.value, tag);
}

function openModal(p){
    modalTitle.textContent = p.title;
    modalBody.innerHTML = `
        <p style="margin-top:6px">${escapeHtml(p.desc)}</p>
        <p style="margin-top:12px"><strong>Tags:</strong> ${p.tags.map(t=>'<span style="display:inline-block;margin-left:8px;background:rgba(255,255,255,0.03);padding:4px 8px;border-radius:8px;font-size:12px;color:var(--muted)">'+escapeHtml(t)+'</span>').join('')}</p>
        <p style="margin-top:12px"><a href="${p.link}" style="color:var(--accent);text-decoration:none">Open project</a></p>
    `;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
}

function closeModal(){
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModal(); });

search.addEventListener('input', ()=> renderGrid(search.value, currentTag));

// small sanitizer for text
function escapeHtml(s){
    return String(s)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#39;');
}

// initial render
renderTags('');
renderGrid();